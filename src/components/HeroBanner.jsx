import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movie, onOpen, movies = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayMovie, setDisplayMovie] = useState(movie);

  // Get all available movies for rotation
  const heroMovies = useMemo(() => (movies && movies.length > 0 ? movies.slice(0, 5) : [movie]), [movies, movie]);
  const heroBackgroundImage = useMemo(() => {
    if (displayMovie?.backdropPath) {
      return `https://image.tmdb.org/t/p/w1280${displayMovie.backdropPath}`;
    }
    if (displayMovie?.posterPath) {
      return `https://image.tmdb.org/t/p/w780${displayMovie.posterPath}`;
    }
    return displayMovie?.backdropUrl || displayMovie?.posterUrl || "";
  }, [displayMovie]);

  // Auto-slide hero every 6 seconds
  useEffect(() => {
    if (!heroMovies || heroMovies.length === 0) return;

    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
        setDisplayMovie(heroMovies[(currentIndex + 1) % heroMovies.length]);
        setFadeOut(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroMovies, currentIndex]);

  // Update display movie when movie prop changes
  useEffect(() => {
    setDisplayMovie(movie);
  }, [movie]);

  if (!displayMovie) {
    return (
      <section className="relative w-full min-h-[68vh] md:h-screen overflow-hidden bg-app-card landscape:max-h-[100svh]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-app-bg to-transparent" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-3 sm:px-6 md:px-14 pt-16 max-[360px]:pt-14 md:pt-0">
          <div className="max-w-3xl space-y-4">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.14em] sm:tracking-[0.2em] text-red-500 uppercase">★ Featured Today</p>
            <h1 className="text-xl max-[360px]:text-lg sm:text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-2xl">
              Featured on Streamify
            </h1>
            <div className="h-4 w-64 rounded bg-white/15 animate-pulse" />
            <div className="h-4 w-[85%] rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-[70%] rounded bg-white/10 animate-pulse" />
            <div className="pt-2 flex gap-3">
              <div className="h-10 w-28 rounded-lg bg-white/20 animate-pulse md:h-12 md:w-36" />
              <div className="h-10 w-28 rounded-lg bg-white/10 animate-pulse md:h-12 md:w-36" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`relative w-full min-h-[68vh] md:h-screen overflow-hidden bg-cover bg-center transition-opacity duration-500 landscape:max-h-[100svh] ${
        fadeOut ? "opacity-70" : "opacity-100"
      }`}
      style={{ 
        backgroundImage: `url(${heroBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Gradient Overlay - Left (black) to Right (transparent) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      
      {/* Gradient Overlay - Bottom fade to black */}
      <div className="absolute inset-x-0 bottom-0 h-48 sm:h-56 md:h-64 bg-gradient-to-t from-app-bg to-transparent" />

      {/* Content Container - Aligned top with navbar */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-3 sm:px-6 md:px-14 pt-16 max-[360px]:pt-14 md:pt-0">
        <div className="max-w-3xl space-y-3 animate-fade-in">
          {/* Label */}
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.14em] sm:tracking-[0.2em] text-red-500 uppercase">
            ★ Featured Today
          </p>

          {/* Title */}
          <h1 className="text-xl max-[360px]:text-lg sm:text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-2xl line-clamp-2 sm:line-clamp-none">
            {displayMovie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs md:text-sm">
            <span className="text-yellow-400 font-bold">⭐ {Number(displayMovie.rating || 0).toFixed(1)}</span>
            <span className="text-zinc-300">{displayMovie.releaseDate?.slice(0, 4) || "N/A"}</span>
            {displayMovie.genres && displayMovie.genres.length > 0 && (
              <span className="text-zinc-300">
                {displayMovie.genres.slice(0, 3).join(" • ")}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-3 sm:line-clamp-2 max-w-2xl text-xs max-[360px]:text-[11px] sm:text-sm md:text-base text-zinc-200 leading-relaxed">
            {displayMovie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={() => 
                navigate(`/watch/${displayMovie.type || "movie"}/${displayMovie.id}?title=${encodeURIComponent(displayMovie.title)}`)
              }
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 sm:px-4 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-bold text-black transition duration-200 hover:bg-zinc-200 shadow-lg"
            >
              ▶ Play
            </button>
            <button
              type="button"
              onClick={() => onOpen?.(displayMovie)}
              className="rounded-lg border-2 border-white/40 bg-white/10 backdrop-blur px-3 py-2 sm:px-4 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-bold text-white transition duration-200 hover:border-white hover:bg-white/20"
            >
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
