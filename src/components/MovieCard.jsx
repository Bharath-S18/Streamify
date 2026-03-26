import { useEffect, useMemo, useState } from "react";
import { getTrailerKey, getVideos } from "../services/api";

const YT_SRC = (key) => `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1`;

const MovieCard = ({ item, onClick, compact = false }) => {
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadTrailer = async () => {
      if (!hovered || trailerKey || loaded) {
        return;
      }

      setLoaded(true);
      try {
        const videos = await getVideos(item.type, item.id);
        if (!active) {
          return;
        }

        const key = getTrailerKey(videos);
        setTrailerKey(key || "");
      } catch {
        if (active) {
          setTrailerKey("");
        }
      }
    };

    loadTrailer();

    return () => {
      active = false;
    };
  }, [hovered, trailerKey, loaded, item.id, item.type]);

  const iframeSrc = useMemo(() => (trailerKey ? YT_SRC(trailerKey) : ""), [trailerKey]);

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1118] text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-red-500/50 ${
        compact ? "w-[220px] snap-start" : "w-[260px] snap-start"
      }`}
    >
      <div className="relative">
        {hovered && iframeSrc ? (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={`${item.title} trailer`}
            allow="autoplay; encrypted-media"
            className="pointer-events-none h-[300px] w-full border-0"
          />
        ) : (
          <>
            {item.posterUrl ? (
              <img
                src={item.posterUrl}
                alt={item.title}
                loading="lazy"
                className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center bg-app-soft text-sm text-app-muted">
                No poster
              </div>
            )}
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-zinc-200 opacity-0 transition group-hover:opacity-100">
          {hovered && iframeSrc ? "Playing" : "Play"}
        </span>
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-base font-semibold text-white">{item.title}</h3>
        <p className="line-clamp-1 text-xs text-zinc-400">
          {item.overview || "Movie details unavailable"}
        </p>
        <p className="text-xs text-zinc-300">⭐ {item.rating}</p>
      </div>

      {!item.posterUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-xs text-zinc-300">
          Preview unavailable
        </div>
      )}
    </button>
  );
};

export default MovieCard;
