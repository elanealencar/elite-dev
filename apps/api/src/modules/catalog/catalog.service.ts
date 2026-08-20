type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

type TmdbSearchResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export async function searchMoviesService(query: string) {
  const url = new URL(
    "https://api.themoviedb.org/3/search/movie"
  );

  url.searchParams.set("query", query);
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("page", "1");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("TMDB_REQUEST_FAILED");
  }

  const data = (await response.json()) as TmdbSearchResponse;

  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,

    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,

    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : null,
  }));
}