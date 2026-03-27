import React from "react";

const MovieCard = ({ item, onClick }) => {
  const poster = `https://image.tmdb.org/t/p/w300${item.posterPath}`;

  return (
    <div
      className="flex-shrink-0 w-44 h-64 px-2" // Use padding for spacing within the row
      onClick={() => onClick(item)}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer">
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
