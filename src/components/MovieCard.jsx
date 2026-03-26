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
      className={`group relative w-full overflow-hidden rounded-lg bg-app-card text-left shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg`}
    >
      <div className="relative aspect-[2/3]">
        {hovered && iframeSrc ? (
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={`${item.title} trailer`}
            allow="autoplay; encrypted-media"
            className="pointer-events-none h-full w-full border-0"
          />
        ) : (
          <>
            {item.posterUrl ? (
              <img
                src={item.posterUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-app-soft text-sm text-app-muted">
                No poster
              </div>
            )}
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
            MOVIE
          </span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{item.rating}</span>
        </div>
      </div>
    </button>
  );
};

export default MovieCard;
