import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Player from "../components/Player";

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Now Playing";
  const [progress, setProgress] = useState(() => Number(searchParams.get("progress") || 0));

  const storageKey = useMemo(() => `watch-progress:${type}:${id}`, [type, id]);

  useEffect(() => {
    const saved = Number(localStorage.getItem(storageKey) || 0);
    if (saved > 0) {
      setProgress(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    const onMessage = (event) => {
      if (typeof event.data !== "string") {
        return;
      }

      try {
        const payload = JSON.parse(event.data);
        if (payload?.type !== "PLAYER_EVENT") {
          return;
        }

        const seconds = Math.floor(Number(payload?.data?.currentTime || 0));
        if (Number.isFinite(seconds) && seconds >= 0) {
          setProgress(seconds);
          localStorage.setItem(storageKey, String(seconds));
        }
      } catch {
        // Ignore invalid postMessage payloads.
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [storageKey]);

  return (
    <div className="pb-8 pt-20">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 pt-6 md:px-8">
        <Link className="text-sm text-zinc-400 transition hover:text-white" to="/">
          ← Back to browse
        </Link>
        {progress > 0 && (
          <span className="rounded bg-white/10 px-3 py-1 text-xs text-zinc-300">
            Resume from {progress}s
          </span>
        )}
      </div>
      <Player type={type} id={id} title={title} progress={progress} />
    </div>
  );
};

export default Watch;
