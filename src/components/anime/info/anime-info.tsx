import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AnimeInfo as AnimeInfoType } from "@/types/anime-info-response";

interface AnimeInfoProps {
  anime: AnimeInfoType;
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] w-full md:w-64">
        <Image
          src={anime.info.poster}
          alt={anime.info.name}
          fill
          className="rounded-lg object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
          priority
        />
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-500">Type:</span>
            <span>{anime.info.stats.type}</span>
            <span className="text-gray-500">Episodes:</span>
            <span>
              Sub: {anime.info.stats.episodes.sub}{" "}
              {anime.info.stats.episodes.dub > 0 &&
                `/ Dub: ${anime.info.stats.episodes.dub}`}
            </span>
            <span className="text-gray-500">Status:</span>
            <span>{anime.moreInfo.status}</span>
            <span className="text-gray-500">Duration:</span>
            <span>{anime.moreInfo.duration}</span>
            <span className="text-gray-500">Studios:</span>
            <span>{anime.moreInfo.studios}</span>
            <span className="text-gray-500">Premiered:</span>
            <span>{anime.moreInfo.premiered}</span>
            <span className="text-gray-500">Japanese:</span>
            <span>{anime.moreInfo.japanese}</span>
            <span className="text-gray-500">Score:</span>
            <span>{anime.moreInfo.malscore}</span>
          </div>
          <div>
            <h3 className="font-medium mb-2">Genres</h3>
            <div className="flex flex-wrap gap-1">
              {anime.moreInfo.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          {anime.moreInfo.producers && (
            <div>
              <h3 className="font-medium mb-2">Producers</h3>
              <div className="flex flex-wrap gap-1">
                {anime.moreInfo.producers.map((producer) => (
                  <Badge key={producer} variant="outline" className="text-xs">
                    {producer}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
