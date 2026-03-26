import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Modal from "../components/Modal";
import { searchMedia } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LIST_KEY = "streamify-my-list-v1";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const debouncedQuery = useDebounce(query, 350);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [myList, setMyList] = useLocalStorage(LIST_KEY, []);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMedia(debouncedQuery);
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
  }, [debouncedQuery]);

  const toggleMyList = (movie) => {
    setMyList((prev) => {
      const key = `${movie.type}-${movie.id}`;
      const exists = prev.some((item) => `${item.type}-${item.id}` === key);
      return exists ? prev.filter((item) => `${item.type}-${item.id}` !== key) : [movie, ...prev];
    });
  };

  const myListIds = new Set(myList.map((item) => `${item.type}-${item.id}`));

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-5 md:px-8 md:py-7 pt-20">
      <h1 className="text-2xl font-bold text-white md:text-3xl">Search Results</h1>
      <div className="rounded-lg border border-white/10 bg-app-card p-3">
        <input
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setParams(next ? { q: next } : {});
          }}
          placeholder="Search movies or TV shows..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </div>

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

      <Modal
        movie={selected}
        onClose={() => setSelected(null)}
        onToggleList={toggleMyList}
        isInList={selected ? myListIds.has(`${selected.type}-${selected.id}`) : false}
        onOpenMovie={setSelected}
      />
    </main>
  );
};

export default Search;
