import { imageFromPath } from "../services/api";
import React from "react";

const CastRow = ({ cast }) => {
  return (
    <section className="space-y-4">
      <h3 className="section-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">Actors</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cast.map((actor) => (
          <article
            key={actor.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/[0.02] p-3"
          >
            {actor.profile_path ? (
              <img
                src={imageFromPath(actor.profile_path)}
                alt={actor.name}
                loading="lazy"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-full bg-app-soft text-[10px] text-zinc-400">N/A</div>
            )}

            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-base sm:text-lg md:text-xl font-semibold text-zinc-100">{actor.name}</p>
              <p className="truncate text-sm text-zinc-400">{actor.character || "Unknown role"}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default React.memo(CastRow);
