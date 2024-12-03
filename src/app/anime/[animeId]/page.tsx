import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeInfoResponse } from "@/types/anime-info-response";
import Image from "next/image";
import Link from "next/link";

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
  const anime = response.data.anime;

  const episodesResponse = await episodesData.json();
  console.log(episodesResponse);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Poster and Quick Info */}
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
                      <Badge
                        key={producer}
                        variant="outline"
                        className="text-xs"
                      >
                        {producer}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{anime.info.name}</h1>
            <div className="flex gap-2 mb-4">
              <Badge>{anime.info.stats.rating}</Badge>
              <Badge variant="outline">{anime.info.stats.quality}</Badge>
            </div>
            <p className="text-gray-600">{anime.info.description}</p>
          </div>

          <Tabs defaultValue="characters" className="w-full">
            <TabsList>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              {response.data.seasons.length > 0 && (
                <TabsTrigger value="seasons">Seasons</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="characters" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {anime.info.charactersVoiceActors?.map((char) => (
                  <Card key={char.character.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <div className="relative w-16 h-16">
                          <Image
                            src={char.character.poster}
                            alt={char.character.name}
                            fill
                            className="rounded object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {char.character.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {char.character.cast}
                          </p>
                          <p className="text-xs mt-1">{char.voiceActor.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="related" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {response.data.relatedAnimes.map((anime) => (
                  <Link href={`/anime/${anime.id}`} key={anime.id}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={anime.poster}
                          alt={anime.name}
                          fill
                          className="rounded-t-lg object-cover"
                          sizes="(min-width: 768px) 25vw, 50vw"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm line-clamp-2">
                          {anime.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {response.data.recommendedAnimes.map((anime) => (
                  <Link href={`/anime/${anime.id}`} key={anime.id}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={anime.poster}
                          alt={anime.name}
                          fill
                          className="rounded-t-lg object-cover"
                          sizes="(min-width: 768px) 25vw, 50vw"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm line-clamp-2">
                          {anime.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {response.data.seasons.length > 0 && (
              <TabsContent value="seasons" className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {response.data.seasons.map((season) => (
                    <Link href={`/anime/${season.id}`} key={season.id}>
                      <Card
                        className={`hover:shadow-lg transition-all duration-300 ${
                          season.isCurrent ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="aspect-[3/4] relative">
                          <Image
                            src={season.poster}
                            alt={season.name}
                            fill
                            className="rounded-t-lg object-cover"
                            sizes="(min-width: 768px) 25vw, 50vw"
                          />
                        </div>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm line-clamp-2">
                            {season.title}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
