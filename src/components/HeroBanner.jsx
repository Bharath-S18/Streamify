import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movie, onOpen }) => {
  const navigate = useNavigate();

  if (!movie) {
    return (
      <div className="animate-pulse rounded-2xl bg-app-card p-8 md:p-12">
        <div className="mb-4 h-8 w-48 rounded bg-white/10" />
        <div className="mb-3 h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    );
  }

  return (
    <section className="relative -mt-[72px] min-h-[75vh] overflow-hidden bg-cover bg-center md:min-h-[88vh]" style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05070d] to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[75vh] w-full max-w-[1600px] items-end px-6 pb-16 md:min-h-[88vh] md:px-14">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold tracking-[0.3em] text-zinc-300">FEATURED TODAY</p>
          <h1 className="text-4xl font-black leading-tight text-white drop-shadow-2xl md:text-7xl">{movie.title}</h1>
          <p className="text-sm text-zinc-300 md:text-lg">⭐ {movie.rating} | {movie.releaseDate?.slice(0, 4) || "N/A"}</p>
          <p className="line-clamp-3 text-base text-zinc-200 md:text-3xl/relaxed">{movie.overview}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/watch/${movie.type}/${movie.id}?title=${encodeURIComponent(movie.title)}`)}
            className="rounded-xl bg-white px-8 py-3 text-2xl font-semibold text-black transition hover:bg-zinc-200"
          >
            ▶  Play
          </button>
          <button
            type="button"
            onClick={() => onOpen?.(movie)}
            className="rounded-xl border border-white/20 bg-zinc-900/70 px-8 py-3 text-xl font-semibold text-white transition hover:bg-zinc-800"
          >
            ⓘ See More
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroBanner;
