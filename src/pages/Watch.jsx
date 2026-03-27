import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Player from "../components/Player";

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Now Playing";

  return (
    <div className="pb-8 pt-20">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-3 sm:px-4 pt-4 sm:pt-6 md:px-8">
        <Link className="text-sm text-zinc-400 transition hover:text-white break-words" to="/">
          ← Back to browse
        </Link>
      </div>
      <Player type={type} id={id} title={title} progress={0} />
    </div>
  );
};

export default Watch;
