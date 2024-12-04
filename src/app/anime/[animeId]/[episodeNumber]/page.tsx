import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeInfoResponse } from "@/types/anime-info-response";
import { Episode, EpisodesResponse } from "@/types/episode-response";
import { ServerResponse } from "@/types/server-response";
import { SourceResponse } from "@/types/source-response";
import VideoPlayer from "@/components/player/video-player";

interface AnimeEpisodeProps {
  params: {
    animeId: string;
    episodeNumber: string;
  };
}

export default async function AnimeEpisodePage({ params }: AnimeEpisodeProps) {
  const [animeResponse, episodesResponse] = await Promise.all([
    fetch(process.env.API_BASE_URL + "/anime/" + params.animeId).then(
      (res) => res.json() as Promise<AnimeInfoResponse>
    ),
    fetch(
      process.env.API_BASE_URL + "/anime/" + params.animeId + "/episodes"
    ).then((res) => res.json() as Promise<EpisodesResponse>),
  ]);

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
    <div className="container mx-auto px-4 space-y-6">
      <div className="text-sm text-gray-400 mt-4">
        <span>{animeResponse.data.anime.info.name}</span>
        {" > "}
        <span>Episode {currentEpisode.number}</span>
      </div>

      <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
        <VideoPlayer
          option={{ url: sourceResponse.data.sources[0].url }}
          className="w-full h-full"
        />
      </div>

      <Card className="bg-gray-900 border-none">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {animeResponse.data.anime.info.name}
          </h2>
          <p className="text-gray-400">
            {animeResponse.data.anime.info.description}
          </p>
        </CardContent>
      </Card>

      <section>
        <h3 className="text-xl font-bold mb-4">Episodes</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {episodesResponse.data.episodes.map((episode: Episode) => (
            <Button
              key={episode.number}
              variant={
                episode.number === currentEpisode.number
                  ? "secondary"
                  : "outline"
              }
              className="w-full h-12"
            >
              {episode.number}
            </Button>
          ))}
        </div>
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
