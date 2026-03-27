import React from "react";

const badgeText = (type) => (type === "tv" ? "TV SHOW" : "MOVIE");

const SimilarRow = ({ items, onCardClick }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h3 className="section-heading text-4xl font-semibold tracking-tight text-white">You may like</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            onClick={() => onCardClick?.(item)}
            className="group overflow-hidden rounded-xl border border-white/10 bg-[#131720] text-left transition hover:scale-[1.02] hover:border-red-500/40"
          >
            <div className="relative h-[190px] overflow-hidden">
              {item.backdropUrl || item.posterUrl ? (
                <img
                  src={item.backdropUrl || item.posterUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-app-soft text-sm text-zinc-500">No preview</div>
              )}

              <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-100">
                {badgeText(item.type)}
              </span>
              <span className="absolute right-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold text-red-400">
                ★ {item.rating}
              </span>
            </div>
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-semibold text-zinc-100">{item.title}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default React.memo(SimilarRow);
