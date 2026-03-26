const MovieCard = ({ item, onClick, compact = false }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className={`group relative overflow-hidden rounded-xl border border-white/5 bg-[#121a2b] text-left transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-white/20 ${
        compact ? "w-[155px] sm:w-[165px]" : "w-[165px] sm:w-[180px]"
      }`}
    >
      <div className="relative">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            loading="lazy"
            className="h-[230px] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-[230px] w-full items-center justify-center bg-app-soft text-sm text-app-muted">
            No poster
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-zinc-200 opacity-0 transition group-hover:opacity-100">
          Play
        </span>
      </div>

      <div className="space-y-1 p-2.5">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-white md:text-sm">{item.title}</h3>
        <p className="line-clamp-1 text-[11px] text-zinc-400">
          {item.overview || "Movie details unavailable"}
        </p>
        <p className="text-[11px] text-zinc-300">⭐ {item.rating}</p>
      </div>

      {!item.posterUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-xs text-zinc-300">
          Preview unavailable
        </div>
      )}
    </button>
  );
};

export default MovieCard;
