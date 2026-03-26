import axios from "axios";

const env = import.meta.env;

const TMDB_API_KEY = env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = env.VITE_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/original";
const PLAYER_BASE_URL = env.VITE_PLAYER_BASE_URL || "https://www.vidking.net/embed";

const isBearerToken = (value) => value?.includes(".");

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 12000
});

const request = async (url, params = {}) => {
  const headers = {};
  const finalParams = { ...params };

  if (TMDB_API_KEY) {
    if (isBearerToken(TMDB_API_KEY)) {
      headers.Authorization = `Bearer ${TMDB_API_KEY}`;
    } else {
      finalParams.api_key = TMDB_API_KEY;
    }
  }

  const response = await client.get(url, { params: finalParams, headers });
  return response.data;
};

const normalizeMedia = (item, fallbackType = "movie") => ({
  id: item.id,
  type: item.media_type || (item.first_air_date ? "tv" : fallbackType),
  title: item.title || item.name || "Untitled",
  overview: item.overview || "No overview available.",
  rating: Number(item.vote_average || 0).toFixed(1),
  releaseDate: item.release_date || item.first_air_date || "",
  posterPath: item.poster_path || "",
  backdropPath: item.backdrop_path || "",
  posterUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
  backdropUrl: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : "",
  genreIds: item.genre_ids || []
});

export const imageFromPath = (path) => (path ? `${IMAGE_BASE_URL}${path}` : "");

export const getTrending = async () => {
  const data = await request("/trending/movie/week", { language: "en-US" });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const getPopularMovies = async () => {
  const data = await request("/movie/popular", { language: "en-US", page: 1 });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const getTopRatedMovies = async () => {
  const data = await request("/movie/top_rated", { language: "en-US", page: 1 });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const getMovieGenres = async () => {
  const data = await request("/genre/movie/list", { language: "en-US" });
  return data.genres || [];
};

export const getMoviesByGenre = async (genreId) => {
  const data = await request("/discover/movie", {
    language: "en-US",
    sort_by: "popularity.desc",
    with_genres: genreId,
    page: 1,
    include_adult: false
  });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const searchMedia = async (query) => {
  if (!query?.trim()) {
    return [];
  }

  const data = await request("/search/multi", {
    query: query.trim(),
    include_adult: false,
    language: "en-US",
    page: 1
  });

  return (data.results || [])
    .filter((item) => ["movie", "tv"].includes(item.media_type))
    .map((item) => normalizeMedia(item, item.media_type));
};

export const getMediaDetails = async (type, id) => {
  const data = await request(`/${type}/${id}`, { language: "en-US" });
  return {
    ...normalizeMedia(data, type),
    genres: data.genres || [],
    runtime: data.runtime || data.episode_run_time?.[0] || 0
  };
};

export const getVideos = async (type, id) => {
  const data = await request(`/${type}/${id}/videos`, { language: "en-US" });
  return data.results || [];
};

export const getCredits = async (type, id) => {
  const data = await request(`/${type}/${id}/credits`, { language: "en-US" });
  return {
    cast: data.cast || [],
    crew: data.crew || []
  };
};

export const getSimilar = async (type, id) => {
  const data = await request(`/${type}/${id}/similar`, { language: "en-US", page: 1 });
  return (data.results || []).map((item) => normalizeMedia(item, type));
};

export const getTrailerKey = (videos = []) => {
  const trailer = videos.find((video) => video.site === "YouTube" && video.type === "Trailer")
    || videos.find((video) => video.site === "YouTube" && ["Teaser", "Clip"].includes(video.type));
  return trailer?.key || "";
};

export const getMovieBundle = async (type, id) => {
  const [details, videos, credits, similar] = await Promise.all([
    getMediaDetails(type, id),
    getVideos(type, id),
    getCredits(type, id),
    getSimilar(type, id)
  ]);

  return {
    details,
    videos,
    credits,
    similar,
    trailerKey: getTrailerKey(videos)
  };
};

export const config = {
  TMDB_BASE_URL,
  IMAGE_BASE_URL,
  PLAYER_BASE_URL
};
