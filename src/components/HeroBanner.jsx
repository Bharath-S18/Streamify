import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movie, onOpen, movies = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayMovie, setDisplayMovie] = useState(movie);

  // Get all available movies for rotation
  const heroMovies = movies && movies.length > 0 ? movies.slice(0, 5) : [movie];

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
      <div className="mt-16 animate-pulse rounded-2xl bg-app-card p-8 md:p-12">
        <div className="mb-4 h-8 w-48 rounded bg-white/10" />
        <div className="mb-3 h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    );
  }

  return (
    <section 
      className={`relative w-full h-screen overflow-hidden bg-cover bg-center transition-opacity duration-500 ${
        fadeOut ? "opacity-70" : "opacity-100"
      }`}
      style={{ 
        backgroundImage: `url(${displayMovie.backdropUrl || displayMovie.posterUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Gradient Overlay - Left (black) to Right (transparent) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      
      {/* Gradient Overlay - Bottom fade to black */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070d] to-transparent" />

      {/* Content Container - Aligned top with navbar */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-6 md:px-14">
        <div className="max-w-3xl space-y-3 animate-fade-in">
          {/* Label */}
          <p className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
            ★ Featured Today
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-2xl">
            {displayMovie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
            <span className="text-yellow-400 font-bold">⭐ {Number(displayMovie.rating || 0).toFixed(1)}</span>
            <span className="text-zinc-300">{displayMovie.releaseDate?.slice(0, 4) || "N/A"}</span>
            {displayMovie.genres && displayMovie.genres.length > 0 && (
              <span className="text-zinc-300">
                {displayMovie.genres.slice(0, 3).join(" • ")}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2 max-w-2xl text-sm md:text-base text-zinc-200 leading-relaxed">
            {displayMovie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => 
                navigate(`/watch/${displayMovie.type || "movie"}/${displayMovie.id}?title=${encodeURIComponent(displayMovie.title)}`)
              }
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-bold text-black transition duration-200 hover:bg-zinc-200 shadow-lg"
            >
              ▶ Play
            </button>
            <button
              type="button"
              onClick={() => onOpen?.(displayMovie)}
              className="rounded-lg border-2 border-white/40 bg-white/10 backdrop-blur px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-bold text-white transition duration-200 hover:border-white hover:bg-white/20"
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
