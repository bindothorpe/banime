export interface SearchResponse {
  success: boolean;
  data: SearchData;
}
export interface SearchData {
  animes: Anime[];
  mostPopularAnimes: MostPopularAnime[];
  searchQuery: string;
  searchFilters: SearchFilters;
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
}
export interface Anime {
  id: string;
  name: string;
  jname: string;
  poster: string;
  duration: string;
  type: string;
  rating: string;
  episodes: Episodes;
}
export interface Episodes {
  sub: number;
  dub: number | null;
}
export interface MostPopularAnime {
  id: string;
  name: string;
  jname: string;
  poster: string;
  episodes: Episodes;
  type: string;
}
export interface SearchFilters {}
