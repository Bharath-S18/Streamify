import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingSeries,
  getPopularSeries,
  getTopRatedSeries,
  getMoviesByGenre,
  getSeriesByGenre,
} from "../services/api";

const MovieRow = ({ title, items, onCardClick, category, genreId }) => {
  const [activeTab, setActiveTab] = useState("Movies");
  const [rowItems, setRowItems] = useState(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRowItems(items);
  }, [items]);

  const handleTabClick = async (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setLoading(true);
    try {
      let newItems = [];
      if (tab === "Movies") {
        if (category === "trending") newItems = await getTrending();
        else if (category === "popular") newItems = await getPopularMovies();
        else if (category === "topRated") newItems = await getTopRatedMovies();
        else if (genreId) newItems = await getMoviesByGenre(genreId);
      } else {
        if (category === "trending") newItems = await getTrendingSeries();
        else if (category === "popular") newItems = await getPopularSeries();
        else if (category === "topRated") newItems = await getTopRatedSeries();
        else if (genreId) newItems = await getSeriesByGenre(genreId);
      }
      // Filter out items that don't have a poster path
      const validItems = newItems.filter(item => item.posterPath);
      setRowItems(validItems);
    } catch (error) {
      console.error("Failed to fetch new items for row:", error);
      // Optionally reset to original items or show an error state
      setRowItems(items);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 bg-red-600"></div>
          <h2 className="section-heading text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => handleTabClick("Movies")}
            className={`px-3 py-1 relative ${
              activeTab === "Movies" ? "text-white" : "text-zinc-400"
            }`}
          >
            Movies
            {activeTab === "Movies" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
            )}
          </button>
          <button
            onClick={() => handleTabClick("Series")}
            className={`px-3 py-1 relative ${
              activeTab === "Series" ? "text-white" : "text-zinc-400"
            }`}
          >
            Series
            {activeTab === "Series" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
            )}
          </button>
        </div>
      </div>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={(e) => {
            const container = e.currentTarget.nextElementSibling;
            container?.scrollBy({ left: -window.innerWidth * 0.8, behavior: "smooth" });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full transition duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          style={{ transform: "translate(-50%, -50%)" }}
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div
          className="flex overflow-x-auto no-scrollbar -mx-2 px-2 py-4"
          id={`movie-row-${title}`}
        >
          {loading
            ? Array(10)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-44 h-64 m-2 bg-zinc-800 rounded-lg animate-pulse"
                  />
                ))
            : rowItems.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={() => onCardClick(item)}
                />
              ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={(e) => {
            const container = e.currentTarget.previousElementSibling;
            container?.scrollBy({ left: window.innerWidth * 0.8, behavior: "smooth" });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full transition duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          style={{ transform: "translate(50%, -50%)" }}
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
};

export default MovieRow;
