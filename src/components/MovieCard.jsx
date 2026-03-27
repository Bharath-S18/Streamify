import React from "react";

const MovieCard = ({ item, onClick, compact = false }) => {
  const poster = `https://image.tmdb.org/t/p/w300${item.posterPath}`;
  const wrapperClass = compact
    ? "w-full"
    : "flex-shrink-0 w-32 h-48 px-1.5 sm:w-40 sm:h-60 sm:px-2 md:w-44 md:h-64";
  const cardClass = compact
    ? "relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
    : "relative w-full h-full rounded-lg overflow-hidden cursor-pointer";

  return (
    <div
      className={wrapperClass}
      onClick={() => onClick(item)}
    >
      <div className={cardClass}>
        <img
          src={poster}
          alt={item.title || item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {item.vote_average > 0 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
            {item.vote_average.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MovieCard);
