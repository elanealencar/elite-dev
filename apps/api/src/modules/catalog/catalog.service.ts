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

type TmdbMovieDetails = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
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

export async function getMovieByIdService(movieId: number) {
  const url = new URL(
    `https://api.themoviedb.org/3/movie/${movieId}`
  );

  url.searchParams.set("language", "pt-BR");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    throw new Error("MOVIE_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("TMDB_REQUEST_FAILED");
  }

  const movie = (await response.json()) as TmdbMovieDetails;

  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    runtime: movie.runtime,

    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,

    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : null,
  };
}