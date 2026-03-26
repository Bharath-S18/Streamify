import MovieCard from "./MovieCard";

const MovieRow = ({ title, items, onCardClick }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="section-heading text-4xl font-semibold tracking-tight text-zinc-100 md:text-5xl">{title}</h2>
      <div className="row-fade relative">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
          {items.map((item) => (
            <MovieCard key={`${item.type}-${item.id}`} item={item} onClick={onCardClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;
