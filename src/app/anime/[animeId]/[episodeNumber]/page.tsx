import { AnimeEpisodeGridButton } from "@/components/anime/info/anime-episode-grid-button";
import { AnimeInfo } from "@/components/anime/info/anime-info";
import { AnimeTabs } from "@/components/anime/info/anime-tabs";
import { Badge } from "@/components/ui/badge";
import { AnimeInfoResponse } from "@/types/anime-info-response";
import { Episode, EpisodesResponse } from "@/types/episode-response";
import { Server, ServerResponse } from "@/types/server-response";
import { SourceResponse } from "@/types/source-response";

interface AnimeEpisodeProps {
  params: {
    animeId: string;
    episodeNumber: string;
  };
}

export default async function AnimeEpisodePage({ params }: AnimeEpisodeProps) {
  const animeData = await fetch(
    process.env.API_BASE_URL + "/anime/" + (await params).animeId
  );
  const episodesData = await fetch(
    process.env.API_BASE_URL + "/anime/" + (await params).animeId + "/episodes"
  );
  const animeResponse: AnimeInfoResponse = await animeData.json();
  const episodesResponse: EpisodesResponse = await episodesData.json();

  const episodeNumber = (await params).episodeNumber;

  const currentEpisode = episodesResponse.data.episodes.find(
    (episode: Episode) => episode.number === parseInt(episodeNumber)
  );

  if (!currentEpisode) {
    return null;
  }

  const serverData = await fetch(
    process.env.API_BASE_URL +
      "/episode/servers?animeEpisodeId=" +
      currentEpisode.episodeId
  );

  const serverResponse: ServerResponse = await serverData.json();

  if (!serverResponse.success) {
    return (
      <div>
        <h1>Server Error</h1>
        <div>No success</div>
      </div>
    );
  }

  if (serverResponse.data.sub.length === 0) {
    return (
      <div>
        <h1>Server Error</h1>
        <div>No sub</div>
      </div>
    );
  }

  const server: Server = serverResponse.data.sub[0];

  const sourceData = await fetch(
    process.env.API_BASE_URL +
      "/episode/sources?animeEpisodeId=" +
      currentEpisode.episodeId +
      "&server=" +
      server.serverName +
      "&category=sub"
  );

  const sourceResponse: SourceResponse = await sourceData.json();

  console.log(sourceResponse);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <AnimeInfo anime={animeResponse.data.anime} />

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {animeResponse.data.anime.info.name}
            </h1>
            <div className="flex gap-2 mb-4">
              <Badge>{animeResponse.data.anime.info.stats.rating}</Badge>
              <Badge variant="outline">
                {animeResponse.data.anime.info.stats.quality}
              </Badge>
            </div>
            <p className="text-gray-600">
              {animeResponse.data.anime.info.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Episodes</h2>
            <div className="grid grid-cols-6 gap-2">
              {episodesResponse.data.episodes.map((episode: Episode) => (
                <AnimeEpisodeGridButton
                  key={episode.number}
                  animeId={animeResponse.data.anime.info.id}
                  number={episode.number}
                  isCurrent={false}
                  isWatched={false}
                />
              ))}
            </div>
          </div>

          <AnimeTabs data={animeResponse.data} />
        </div>
      </div>
    </div>
  );
}
