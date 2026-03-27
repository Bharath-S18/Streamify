import React, { useEffect, useMemo, useState } from "react";
import { config } from "../services/api";

const Player = ({
  type,
  id,
  title,
  season = 1,
  episode = 1,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retrySeed, setRetrySeed] = useState(0);

  const safeProgress = 0;

  // 🎬 Build Vidking URL
  const iframeSrc = useMemo(() => {
    let base =
      type === "tv"
        ? `${config.PLAYER_BASE_URL}/tv/${id}/${season}/${episode}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
        : `${config.PLAYER_BASE_URL}/movie/${id}?color=e50914&autoPlay=true`;

    if (safeProgress > 0) {
      base += `&progress=${safeProgress}`;
    }

    return base;
  }, [type, id, season, episode, safeProgress]);

  // ⏱️ Timeout logic
  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);

    const timeout = setTimeout(() => {
      setTimedOut(true);
    }, 9000);

    return () => clearTimeout(timeout);
  }, [iframeSrc, retrySeed]);

  const handleRetry = () => {
    setRetrySeed((v) => v + 1);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white md:text-2xl">
          {title || "Now Playing"}
        </h1>
      </div>

      {/* 🎥 Player Container */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/40">

        {/* 🔄 Loading Overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-white animate-pulse">
              Loading Player...
            </div>
          </div>
        )}

        {/* IMPORTANT: Vidking API player iframe only */}
        <iframe
          key={`${iframeSrc}-${retrySeed}`}
          src={iframeSrc}
          title={title || "Vidking Player"}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>

      {/* ⚠️ Timeout UI */}
      {timedOut && !loaded && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          <span>Player taking too long to load.</span>

          <button
            onClick={handleRetry}
            className="rounded border border-amber-300/50 bg-amber-300/10 px-2.5 py-1 hover:bg-amber-300/20"
          >
            Retry
          </button>

          <a
            href={iframeSrc}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-white/30 bg-white/10 px-2.5 py-1 hover:bg-white/20"
          >
            Open Directly
          </a>
        </div>
      )}
    </section>
  );
};

export default React.memo(Player);
