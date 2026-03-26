import { Link, useParams, useSearchParams } from "react-router-dom";
import Player from "../components/Player";

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Now Playing";

  return (
    <div className="pb-8">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8">
        <Link className="text-sm text-zinc-400 transition hover:text-white" to="/">
          ← Back to browse
        </Link>
      </div>
      <Player type={type} id={id} title={title} />
    </div>
  );
};

export default Watch;
