import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchMedia } from "../services/api";
import useDebounce from "../hooks/useDebounce";

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("all"); // all, movie, tv
  const debouncedQuery = useDebounce(query, 350);
  const searchInputRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let active = true;

    const performSearch = async () => {
      setLoading(true);
      try {
        const data = await searchMedia(debouncedQuery);
        if (active) {
          setResults(data.slice(0, 12));
        }
      } catch (error) {
        if (active) {
          setResults([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    performSearch();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 landscape:pt-8">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl mx-1.5 sm:mx-4 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 bg-black/40 rounded-t-2xl backdrop-blur">
          <h2 className="text-lg sm:text-2xl font-bold text-white">Search</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="bg-zinc-800/70 text-white text-xs sm:text-sm font-medium px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg outline-none hover:bg-zinc-700 transition"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
            <button
              onClick={onClose}
              className="text-white text-xl sm:text-2xl hover:opacity-70 transition"
              aria-label="Close search"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-3 py-3 sm:px-6 sm:py-4 bg-black/40 backdrop-blur">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
              🔍
            </span>
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or TV shows..."
              className="w-full bg-zinc-800/70 text-white placeholder:text-zinc-500 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:bg-zinc-700 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-black/40 backdrop-blur rounded-b-2xl px-3 py-3 sm:px-6 sm:py-4 max-h-[72vh] sm:max-h-96 landscape:max-h-[78vh] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-20 bg-zinc-800/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    navigate(
                      `/watch/${item.type}/${item.id}?title=${encodeURIComponent(
                        item.title
                      )}`
                    );
                    onClose();
                  }}
                  className="w-full flex gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/60 transition group cursor-pointer"
                >
                  {/* Poster */}
                  <div className="w-14 h-20 sm:w-16 sm:h-24 flex-shrink-0">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x96?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left py-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-500 transition line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-2 space-y-1">
                      <p>
                        <span className="inline-block bg-zinc-800 px-2 py-0.5 rounded mr-2">
                          {item.type === "movie" ? "Movie" : "Series"}
                        </span>
                        <span>{item.releaseDate?.slice(0, 4) || "N/A"}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        ⭐ {Number(item.rating || 0).toFixed(1)}/10
                      </p>
                      {item.overview && (
                        <p className="line-clamp-2 text-zinc-500">
                          {item.overview}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8 text-zinc-400">
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-sm mt-2">Try searching for a different title</p>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">
              <p className="text-lg">Start typing to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
