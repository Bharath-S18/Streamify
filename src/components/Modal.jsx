import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieBundle } from "../services/api";
import CastRow from "./CastRow";
import SimilarRow from "./SimilarRow";

const crewLabels = ["Director", "Writer", "Producer", "Screenplay"];

const Modal = ({ movie, onClose, onToggleList, isInList, onOpenMovie }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bundle, setBundle] = useState(null);

  useEffect(() => {
    if (!movie) {
      setBundle(null);
      return;
    }

    let active = true;

    const fetchBundle = async () => {
      setLoading(true);
      try {
        const data = await getMovieBundle(movie.type, movie.id);
        if (active) {
          setBundle(data);
        }
      } catch {
        if (active) {
          setBundle(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBundle();

    return () => {
      active = false;
    };
  }, [movie]);

  if (!movie) {
    return null;
  }

  const details = bundle?.details || movie;
  const trailerKey = bundle?.trailerKey || "";
  const trailerSrc = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`
    : "";

  const cast = (bundle?.credits?.cast || []).slice(0, 14);
  const crew = (bundle?.credits?.crew || [])
    .filter((person) => crewLabels.includes(person.job))
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 p-3 backdrop-blur-[10px] md:p-6" onClick={onClose}>
      <div
        className="mx-auto max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/10 bg-[#090d15]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[260px] w-full md:h-[420px]">
          {trailerSrc ? (
            <iframe
              src={trailerSrc}
              title={`${details.title} trailer`}
              allow="autoplay; encrypted-media"
              className="h-full w-full border-0"
            />
          ) : (
            <img
              src={details.backdropUrl || details.posterUrl}
              alt={details.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0f1728] to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8 p-4 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/watch/${movie.type}/${movie.id}?title=${encodeURIComponent(details.title)}`)}
              className="rounded-xl bg-white px-8 py-3 text-2xl font-semibold text-black"
            >
              ▶  Play
            </button>
            <button
              type="button"
              onClick={() => onToggleList?.(movie)}
              className="rounded-xl border border-white/25 bg-white/5 px-8 py-3 text-xl text-zinc-200"
            >
              {isInList ? "✓ In My List" : "+ My List"}
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-5xl font-extrabold tracking-tight text-white">{details.title}</h2>
            <p className="text-xl text-zinc-300">⭐ {details.rating} • {details.releaseDate || "TBA"}</p>
            <p className="max-w-4xl text-3xl/relaxed text-zinc-300">{details.overview}</p>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
              <div className="h-20 w-full animate-pulse rounded bg-white/10" />
            </div>
          )}

          {cast.length > 0 && <CastRow cast={cast} />}

          {crew.length > 0 && (
            <section className="space-y-3">
              <h3 className="section-heading text-4xl font-semibold tracking-tight text-white">Crew</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {crew.map((person) => (
                  <div key={`${person.id}-${person.job}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
                    <span className="text-lg font-semibold text-zinc-100">{person.job}:</span>{" "}
                    <span className="text-base text-zinc-300">{person.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(bundle?.similar || []).length > 0 && (
            <SimilarRow items={bundle.similar} onCardClick={onOpenMovie} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
