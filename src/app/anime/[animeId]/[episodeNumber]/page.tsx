import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeInfoResponse } from "@/types/anime-info-response";
import { Episode, EpisodesResponse } from "@/types/episode-response";
import { ServerResponse } from "@/types/server-response";
import { SourceResponse, Track } from "@/types/source-response";
import VideoPlayer from "@/components/player/video-player";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import ShowMoreText from "@/components/show-more-text";
import AnimeSeasonsCombobox from "@/components/anime/info/anime-seasons-combobox";
import { Separator } from "@/components/ui/separator";

type AnimeEpisodePageProps = Promise<{
  animeId: string;
  episodeNumber: string;
}>;

export default async function AnimeEpisodePage(props: {
  params: AnimeEpisodePageProps;
}) {
  const params = await props.params;
  const [animeResponse, episodesResponse] = await Promise.all([
    fetch(process.env.API_BASE_URL + "/anime/" + params.animeId).then(
      (res) => res.json() as Promise<AnimeInfoResponse>
    ),
    fetch(
      process.env.API_BASE_URL + "/anime/" + params.animeId + "/episodes"
    ).then((res) => res.json() as Promise<EpisodesResponse>),
  ]);

  async function getEpisodes(seasonId: string) {
    "use server";

    const episodesResponse = await fetch(
      `${process.env.API_BASE_URL}/anime/${seasonId}/episodes`
    ).then((res) => res.json() as Promise<EpisodesResponse>);

    return episodesResponse.data.episodes;
  }

  const currentEpisode = episodesResponse.data.episodes.find(
    (episode: Episode) => episode.number === parseInt(params.episodeNumber)
  );

  if (!currentEpisode) return null;

  const serverResponse = await fetch(
    `${process.env.API_BASE_URL}/episode/servers?animeEpisodeId=${currentEpisode.episodeId}`
  ).then((res) => res.json() as Promise<ServerResponse>);

  if (!serverResponse.success || serverResponse.data.sub.length === 0) {
    return <ErrorMessage message="No servers available" />;
  }

  const sourceResponse = await fetch(
    `${process.env.API_BASE_URL}/episode/sources?animeEpisodeId=${currentEpisode.episodeId}&server=${serverResponse.data.sub[0].serverName}&category=sub`
  ).then((res) => res.json() as Promise<SourceResponse>);

  if (!sourceResponse.success || !sourceResponse.data.sources[0]) {
    return <ErrorMessage message="No source available" />;
  }

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/anime/${animeResponse.data.anime.info.id}`}>
              {animeResponse.data.anime.info.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Episode {currentEpisode.number}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="aspect-video w-full rounded-lg overflow-hidden mb-8">
        <VideoPlayer
          option={{
            url: sourceResponse.data.sources[0].url,
            subtitle: {
              url: sourceResponse.data.tracks.find(
                (track: Track) => track.default == true
              )?.file,
              type: "vtt",
              encoding: "utf-8",
              escape: true,
              style: {
                color: "#FFFFFF",
                fontSize: "24px",
              },
            },
            subtitleOffset: true,
            setting: true,
          }}
          sourceData={sourceResponse.data}
          className="w-full h-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="hidden md:block relative aspect-[3/4] w-full">
          <Image
            src={animeResponse.data.anime.info.poster}
            alt={animeResponse.data.anime.info.name}
            fill
            className="rounded-lg object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
            priority
          />
        </div>
        <div className="col-span-4 md:col-span-3 h-fit">
          <h2 className="text-2xl font-bold mb-4">
            {animeResponse.data.anime.info.name}
          </h2>
          <div className="text-gray-400">
            <ShowMoreText text={animeResponse.data.anime.info.description} />
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      <section className="pb-16">
        <AnimeSeasonsCombobox
          animeResponse={animeResponse}
          episodesResponse={episodesResponse}
          initialEpisodes={episodesResponse.data.episodes}
          onSeasonChange={getEpisodes}
        />
      </section>
    </div>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen">
    <Card className="bg-gray-900 border-none">
      <CardContent className="p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Server Error</h1>
        <p>{message}</p>
      </CardContent>
    </Card>
  </div>
);
