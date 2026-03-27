import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import {
  getCredits,
  getMediaDetails,
  getRecommendations,
  getTrailerKey,
  getTvSeasonEpisodes,
  getVideos
} from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LIST_KEY = "streamify-my-list-v1";

const crewPriority = ["Director", "Writer", "Screenplay", "Producer", "Creator"];

const durationLabel = (minutes) => {
  if (!minutes || Number(minutes) <= 0) return "—";
  return `${Math.round(Number(minutes))} min`;
};

const DetailsPage = () => {
  const { type, tmdbId } = useParams();
  const navigate = useNavigate();

  const episodesRef = useRef(null);
  const similarRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recommendations, setRecommendations] = useState([]);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  const [trailerLoaded, setTrailerLoaded] = useState(false);
  const [myList, setMyList] = useLocalStorage(LIST_KEY, []);

  const isTv = type === "tv";

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setTrailerLoaded(false);

      try {
        const [detailsData, videosData, creditsData, recommendationData] = await Promise.all([
          getMediaDetails(type, tmdbId),
          getVideos(type, tmdbId),
          getCredits(type, tmdbId),
          getRecommendations(type, tmdbId)
        ]);

        if (!active) return;

        setDetails(detailsData);
        setVideos(videosData || []);
        setCredits(creditsData || { cast: [], crew: [] });
        setRecommendations((recommendationData || []).slice(0, 16));

        if (type === "tv") {
          const seasons = (detailsData?.seasons || []).filter((season) => season?.season_number > 0);
          const initialSeason = seasons[0]?.season_number || 1;
          setSelectedSeason(initialSeason);
        }
      } catch {
        if (!active) return;
        setDetails(null);
        setVideos([]);
        setCredits({ cast: [], crew: [] });
        setRecommendations([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [type, tmdbId]);

  useEffect(() => {
    if (!isTv || !tmdbId || !selectedSeason) {
      setEpisodes([]);
      return;
    }

    let active = true;

    const loadSeason = async () => {
      setSeasonLoading(true);
      try {
        const seasonData = await getTvSeasonEpisodes(tmdbId, selectedSeason);
        if (active) {
          setEpisodes(seasonData?.episodes || []);
        }
      } catch {
        if (active) {
          setEpisodes([]);
        }
      } finally {
        if (active) {
          setSeasonLoading(false);
        }
      }
    };

    loadSeason();

    return () => {
      active = false;
    };
  }, [isTv, tmdbId, selectedSeason]);

  useEffect(() => {
    const previousTitle = document.title;
    if (details?.title) {
      document.title = `${details.title} • Streamify`;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [details?.title]);

  const trailerKey = useMemo(() => getTrailerKey(videos), [videos]);

  const trailerUrl = useMemo(() => {
    if (!trailerKey) return "";
    return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0&playsinline=1`;
  }, [trailerKey]);

  const heroBackground = useMemo(() => {
    if (details?.backdropPath) return `https://image.tmdb.org/t/p/w1280${details.backdropPath}`;
    if (details?.posterPath) return `https://image.tmdb.org/t/p/w780${details.posterPath}`;
    return details?.backdropUrl || details?.posterUrl || "";
  }, [details]);

  const genres = useMemo(() => (details?.genres || []).map((genre) => genre.name).slice(0, 4), [details?.genres]);

  const year = useMemo(() => details?.releaseDate?.slice(0, 4) || "N/A", [details?.releaseDate]);

  const topCast = useMemo(() => (credits?.cast || []).slice(0, 18), [credits?.cast]);

  const topCrew = useMemo(() => {
    const crew = credits?.crew || [];
    const sorted = [...crew].sort((a, b) => {
      const aIndex = crewPriority.indexOf(a.job);
      const bIndex = crewPriority.indexOf(b.job);
      const av = aIndex === -1 ? 999 : aIndex;
      const bv = bIndex === -1 ? 999 : bIndex;
      return av - bv;
    });
    return sorted.slice(0, 10);
  }, [credits?.crew]);

  const castWithProfile = useMemo(
    () => topCast.filter((person) => person.profile_path),
    [topCast]
  );

  const crewWithProfile = useMemo(
    () => topCrew.filter((person) => person.profile_path),
    [topCrew]
  );

  const seasonOptions = useMemo(() => {
    if (!isTv) return [];
    const seasons = (details?.seasons || []).filter((season) => season?.season_number > 0);
    return seasons;
  }, [isTv, details?.seasons]);

  const detailsKey = details ? `${details.type}-${details.id}` : "";
  const inMyList = useMemo(
    () => myList.some((item) => `${item.type}-${item.id}` === detailsKey),
    [myList, detailsKey]
  );

  const toggleMyList = () => {
    if (!details) return;

    setMyList((prev) => {
      const exists = prev.some((item) => `${item.type}-${item.id}` === detailsKey);
      if (exists) {
        return prev.filter((item) => `${item.type}-${item.id}` !== detailsKey);
      }
      return [details, ...prev];
    });
  };

  const playEpisode = useCallback((episode) => {
    if (!details?.id || !episode?.episodeNumber) return;
    const watchTitle = `${details.title} • S${selectedSeason} E${episode.episodeNumber}`;
    navigate(
      `/watch/tv/${details.id}?title=${encodeURIComponent(watchTitle)}&season=${selectedSeason}&episode=${episode.episodeNumber}`
    );
  }, [details?.id, details?.title, navigate, selectedSeason]);

  const scrollToEpisodes = useCallback(() => {
    episodesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToSimilar = useCallback(() => {
    similarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white pt-20">
        <section className="relative min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 md:px-10 pt-20 space-y-4">
            <div className="h-6 w-36 rounded bg-white/10 animate-pulse" />
            <div className="h-12 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-64 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-3/4 max-w-2xl rounded bg-white/10 animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-28 rounded-lg bg-white/20 animate-pulse" />
              <div className="h-11 w-32 rounded-lg bg-white/10 animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen bg-black text-white pt-24 px-4 md:px-10">
        <p className="text-zinc-300">Could not load details right now.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section with Trailer Background */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden bg-black">
        {/* Trailer/Image Background */}
        <div className="absolute inset-0 w-full h-full">
          {trailerUrl ? (
            <div className="absolute inset-0">
              <iframe
                src={trailerUrl}
                title={`${details.title} trailer`}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                onLoad={() => setTrailerLoaded(true)}
                className={`h-full w-full border-0 transition-opacity duration-700 ${
                  trailerLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ) : null}

          {!trailerLoaded && heroBackground && (
            <img
              src={heroBackground}
              alt={details.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-56 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-10 pb-8 sm:pb-12 md:pb-16">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">Now Streaming</p>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">{details.title}</h1>

              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-200">
                <span className="text-yellow-400 font-semibold">⭐ {details.rating}</span>
                <span>{year}</span>
                {genres.length > 0 && <span>• {genres.join(" • ")}</span>}
              </div>

              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-300 line-clamp-2 sm:line-clamp-3 max-w-2xl">{details.overview}</p>

              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(`/watch/${details.type}/${details.id}?title=${encodeURIComponent(details.title)}`)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 sm:px-4 py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-bold text-black hover:bg-zinc-200 transition"
                >
                  ▶ Play
                </button>

                <button
                  onClick={toggleMyList}
                  className="rounded-lg border border-white/30 bg-white/10 px-3 sm:px-4 py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-semibold hover:bg-white/20 transition"
                >
                  {inMyList ? "✓ In My List" : "+ Add to List"}
                </button>

                {isTv && (
                  <button
                    onClick={scrollToEpisodes}
                    className="rounded-lg border border-white/30 bg-white/10 px-3 sm:px-4 py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-semibold hover:bg-white/20 transition"
                  >
                    Episodes
                  </button>
                )}

                <button
                  onClick={scrollToSimilar}
                  className="rounded-lg border border-white/30 bg-white/10 px-3 sm:px-4 py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-semibold hover:bg-white/20 transition"
                >
                  Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] space-y-12 px-4 sm:px-6 md:px-10 pb-14">
        {isTv && (
          <section ref={episodesRef} className="space-y-4">
            <h2 className="section-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">Episodes</h2>

            <div className="flex">
              <select
                value={selectedSeason}
                onChange={(event) => setSelectedSeason(Number(event.target.value))}
                className="w-full sm:w-auto rounded-lg border border-white/15 bg-[#11151d] px-3 py-2 text-sm text-zinc-100 outline-none"
              >
                {seasonOptions.map((season) => (
                  <option key={season.id || season.season_number} value={season.season_number}>
                    {season.name || `Season ${season.season_number}`}
                  </option>
                ))}
              </select>
            </div>

            {seasonLoading ? (
              <div className="max-h-[52vh] sm:max-h-[58vh] lg:max-h-[62vh] overflow-y-auto pr-1 space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="h-28 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="max-h-[52vh] sm:max-h-[58vh] lg:max-h-[62vh] overflow-y-auto pr-1 space-y-3">
                {episodes.map((episode) => (
                  <button
                    type="button"
                    key={episode.id || `${selectedSeason}-${episode.episodeNumber}`}
                    onClick={() => playEpisode(episode)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f131a] p-2.5 sm:p-3 flex gap-3 text-left transition hover:bg-[#161c27] focus:outline-none focus:ring-2 focus:ring-red-500/60"
                  >
                    <div className="relative h-20 w-28 sm:h-24 sm:w-40 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                      {episode.stillPath ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.stillPath}`}
                          alt={episode.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-zinc-500">No image</div>
                      )}
                      <div className="absolute left-1.5 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold">
                        {episode.episodeNumber}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-white line-clamp-1">{episode.name}</h3>
                      <p className="mt-0.5 text-xs text-zinc-400">{durationLabel(episode.runtime)}</p>
                      <p className="mt-2 text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3">{episode.overview}</p>
                    </div>
                  </button>
                ))}

                {!episodes.length && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-zinc-400">
                    No episodes available for this season.
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="section-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">Cast & Crew</h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-[0.15em] text-zinc-400">Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {castWithProfile.map((person) => (
                    <article
                      key={`cast-${person.id}`}
                      className="rounded-xl border border-white/15 bg-white/[0.05] p-3 flex flex-col items-center text-center hover:bg-white/[0.08] transition"
                    >
                      <div className="h-24 w-24 overflow-hidden rounded-full border border-white/15 bg-zinc-900 flex-shrink-0">
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-zinc-100 line-clamp-2">{person.name}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1">{person.character || "—"}</p>
                    </article>
                  ))}
              </div>
            </div>

            {!!crewWithProfile.length && (
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-[0.15em] text-zinc-400">Crew</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {crewWithProfile.map((person, idx) => (
                      <article
                        key={`crew-${person.id}-${idx}`}
                        className="rounded-xl border border-white/15 bg-white/[0.05] p-3 flex flex-col items-center text-center hover:bg-white/[0.08] transition"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-full border border-white/15 bg-zinc-900 flex-shrink-0">
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-zinc-100 line-clamp-2">{person.name}</p>
                        <p className="text-xs text-zinc-400 line-clamp-1">{person.job || "—"}</p>
                      </article>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section ref={similarRef} className="space-y-4">
          <h2 className="section-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">You may also like</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {recommendations.map((item) => (
              <MovieCard key={`${item.type}-${item.id}`} item={item} compact />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DetailsPage;
