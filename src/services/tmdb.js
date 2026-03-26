import axios from "axios";

const env = process.env;

const TMDB_API_KEY = env.REACT_APP_TMDB_API_KEY || env.TMDB_API_KEY || "";
const TMDB_BASE_URL = env.REACT_APP_TMDB_BASE_URL || env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = env.REACT_APP_IMAGE_BASE_URL || env.IMAGE_BASE_URL || "https://image.tmdb.org/t/p/original";

const isBearerToken = (value) => value.includes(".");

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 12000
});

const tmdbRequest = async (url, params = {}) => {
  const headers = {};
  const finalParams = { ...params };

  if (TMDB_API_KEY) {
    if (isBearerToken(TMDB_API_KEY)) {
      headers.Authorization = `Bearer ${TMDB_API_KEY}`;
    } else {
      finalParams.api_key = TMDB_API_KEY;
    }
  }

  const response = await tmdb.get(url, {
    params: finalParams,
    headers
  });

  return response.data;
};

const normalizeMedia = (item, fallbackType = "movie") => ({
  id: item.id,
  type: item.media_type || (item.first_air_date ? "tv" : fallbackType),
  title: item.title || item.name || "Untitled",
  overview: item.overview || "No description available yet.",
  rating: Number(item.vote_average || 0).toFixed(1),
  releaseDate: item.release_date || item.first_air_date || "",
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  posterUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : "",
  backdropUrl: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : "",
  genreIds: item.genre_ids || [],
  popularity: item.popularity || 0
});

export const imageFromPath = (path) => (path ? `${IMAGE_BASE_URL}${path}` : "");

export const getTrending = async (mediaType = "all") => {
  const data = await tmdbRequest(`/trending/${mediaType}/week`, { language: "en-US" });
  return (data.results || []).map((item) => normalizeMedia(item, mediaType === "all" ? "movie" : mediaType));
};

export const getPopularMovies = async () => {
  const data = await tmdbRequest("/movie/popular", { language: "en-US", page: 1 });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const getTopRatedMovies = async () => {
  const data = await tmdbRequest("/movie/top_rated", { language: "en-US", page: 1 });
  return (data.results || []).map((item) => normalizeMedia(item, "movie"));
};

export const getTrendingTv = async () => {
  const data = await tmdbRequest("/trending/tv/week", { language: "en-US" });
  return (data.results || []).map((item) => normalizeMedia(item, "tv"));
};

export const getMovieGenres = async () => {
  const data = await tmdbRequest("/genre/movie/list", { language: "en-US" });
  return data.genres || [];
};

export const searchMedia = async (query) => {
  if (!query?.trim()) {
    return [];
  }

  const data = await tmdbRequest("/search/multi", {
    language: "en-US",
    query: query.trim(),
    include_adult: false,
    page: 1
  });

  return (data.results || [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => normalizeMedia(item, item.media_type));
};

export const getMediaDetails = async (type, id) => {
  const data = await tmdbRequest(`/${type}/${id}`, { language: "en-US" });
  return {
    ...normalizeMedia(data, type),
    genres: data.genres || [],
    runtime: data.runtime || data.episode_run_time?.[0] || null
  };
};

export const config = {
  TMDB_BASE_URL,
  IMAGE_BASE_URL,
  VIKING_BASE_URL: env.REACT_APP_VIKING_BASE_URL || env.VIKING_BASE_URL || "https://your-viking-api.com"
};
