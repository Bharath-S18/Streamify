const Top10Card = ({ index, movie, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(movie)}
      className="group relative flex-shrink-0"
    >
      <div className="relative flex items-end gap-2.5 sm:gap-5 md:gap-6 lg:gap-8 transition duration-300 cursor-pointer">
        {/* Ranking Number */}
        <div className="z-10 shrink-0">
          <span className="top10-rank text-zinc-700 group-hover:text-red-600 transition duration-300 leading-none">
            {index}
          </span>
        </div>

        {/* Poster Image */}
        <div className="relative z-0 -ml-1 sm:-ml-4 md:-ml-5 lg:-ml-8 w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-56 lg:w-48 lg:h-64">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
        </div>
      </div>
    </button>
  );
};

export default Top10Card;
