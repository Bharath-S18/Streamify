import MovieCard from "./MovieCard";

const MovieRow = ({ title, items, onCardClick }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-wide text-zinc-100 md:text-xl">{title}</h2>
      <div className="row-fade relative">
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {items.map((item) => (
            <MovieCard key={`${item.type}-${item.id}`} item={item} onClick={onCardClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;
