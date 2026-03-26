import { useNavigate } from "react-router-dom";

const Modal = ({ movie, onClose, onToggleList, isInList }) => {
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-app-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 w-full md:h-72">
          {movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-app-soft" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
          <p className="text-sm text-zinc-300">⭐ {movie.rating} • {movie.releaseDate || "TBA"}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{movie.overview}</p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/watch/${movie.type}/${movie.id}?title=${encodeURIComponent(movie.title)}`)}
              className="rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white"
            >
              ▶ Play
            </button>
            <button
              type="button"
              onClick={() => onToggleList?.(movie)}
              className="rounded-md border border-white/20 px-4 py-2 text-sm text-white"
            >
              {isInList ? "✓ In My List" : "+ My List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
