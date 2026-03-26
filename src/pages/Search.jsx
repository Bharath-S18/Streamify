import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Modal from "../components/Modal";
import { searchMedia } from "../services/api";

const Search = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMedia(query);
        if (active) {
          setResults(data);
        }
      } catch {
        if (active) {
          setResults([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-5 md:px-8 md:py-7">
      <h1 className="text-2xl font-bold text-white md:text-3xl">Search Results</h1>
      <p className="text-sm text-zinc-400">
        Query: <span className="text-zinc-200">{query || "-"}</span>
      </p>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="h-[290px] animate-pulse rounded-xl bg-app-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {results.map((item) => (
            <MovieCard key={`${item.type}-${item.id}`} item={item} compact onClick={setSelected} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="rounded-lg border border-white/10 bg-app-card p-4 text-sm text-zinc-400">
          No results found. Try another title.
        </div>
      )}

      <Modal movie={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default Search;
