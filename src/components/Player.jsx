import { config } from "../services/api";

const Player = ({ type, id, title }) => {
  const iframeSrc = `${config.VIKING_BASE_URL}/embed/${type}/${id}`;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white md:text-2xl">{title || "Now Playing"}</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/40">
        {/* IMPORTANT: Viking API player iframe only */}
        <iframe
          src={iframeSrc}
          title={title || "Viking Player"}
          allowFullScreen
          className="player-frame aspect-video w-full"
        />
      </div>
    </section>
  );
};

export default Player;
