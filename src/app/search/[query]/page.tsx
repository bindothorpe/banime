import { AnimeInfo } from "@/components/anime/info/anime-info";
import { AnimeTabs } from "@/components/anime/info/anime-tabs";
import { Badge } from "@/components/ui/badge";
import { AnimeInfoResponse } from "@/types/anime-info-response";

interface AnimePageProps {
  params: {
    animeId: string;
  };
}

export default async function AnimePage({ params }: AnimePageProps) {
  const data = await fetch(
    process.env.API_BASE_URL + "/anime/" + params.animeId
  );
  const episodesData = await fetch(
    process.env.API_BASE_URL + "/anime/" + params.animeId + "/episodes"
  );
  const response: AnimeInfoResponse = await data.json();
  const episodesResponse = await episodesData.json();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <AnimeInfo anime={response.data.anime} />

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {response.data.anime.info.name}
            </h1>
            <div className="flex gap-2 mb-4">
              <Badge>{response.data.anime.info.stats.rating}</Badge>
              <Badge variant="outline">
                {response.data.anime.info.stats.quality}
              </Badge>
            </div>
            <p className="text-gray-600">
              {response.data.anime.info.description}
            </p>
          </div>

          <AnimeTabs data={response.data} />
        </div>
      </div>
    </div>
  );
}
