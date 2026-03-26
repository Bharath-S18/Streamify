import { useNavigate } from "react-router-dom";

const HeroBanner = ({ movie }) => {
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
    <section
      className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-cover bg-center md:min-h-[360px]"
      style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="relative z-10 max-w-2xl space-y-4 p-6 md:p-10">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200">
          Featured This Week
        </span>
        <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">{movie.title}</h1>
        <p className="line-clamp-3 text-sm text-zinc-200 md:text-base">{movie.overview}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/watch/${movie.type}/${movie.id}?title=${encodeURIComponent(movie.title)}`)}
            className="rounded-md bg-app-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            ▶ Play
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
