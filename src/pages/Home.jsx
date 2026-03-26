import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import Modal from "../components/Modal";
import MovieRow from "../components/MovieRow";
import {
  getMovieGenres,
  getPopularMovies,
  getTopRatedMovies,
  getTrending,
  getTrendingTv
} from "../services/api";

const LIST_KEY = "streamify-my-list-v1";

const readMyList = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIST_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState({
    trending: [],
    popular: [],
    topRated: [],
    tvTrending: []
  });
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState(readMyList);

  useEffect(() => {
    let mounted = true;

    const loadHome = async () => {
      setLoading(true);

      try {
        // TMDB API requests for core home rows
        const [trending, popular, topRated, tvTrending, movieGenres] = await Promise.all([
          getTrending("movie"),
          getPopularMovies(),
          getTopRatedMovies(),
          getTrendingTv(),
          getMovieGenres()
        ]);

        if (!mounted) {
          return;
        }

        setRows({
          trending: trending.slice(0, 20),
          popular: popular.slice(0, 20),
          topRated: topRated.slice(0, 20),
          tvTrending: tvTrending.slice(0, 20)
        });
        setGenres(movieGenres);
      } catch {
        if (mounted) {
          setRows({ trending: [], popular: [], topRated: [], tvTrending: [] });
          setGenres([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredMovie = useMemo(() => {
    if (!rows.trending.length) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * rows.trending.length);
    return rows.trending[randomIndex];
  }, [rows.trending]);

  const myListIds = useMemo(() => new Set(myList.map((item) => `${item.type}-${item.id}`)), [myList]);

  const toggleMyList = (movie) => {
    setMyList((prev) => {
      const key = `${movie.type}-${movie.id}`;
      const exists = prev.some((item) => `${item.type}-${item.id}` === key);
      const next = exists ? prev.filter((item) => `${item.type}-${item.id}` !== key) : [movie, ...prev];
      localStorage.setItem(LIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-7 px-4 py-5 md:px-8 md:py-7">
      <HeroBanner movie={featuredMovie} />

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-6 w-48 animate-pulse rounded bg-app-card" />
              <div className="no-scrollbar flex gap-4 overflow-x-auto">
                {Array.from({ length: 7 }).map((__, i) => (
                  <div key={i} className="h-[290px] w-[170px] animate-pulse rounded-xl bg-app-card" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <MovieRow title="Trending Now" items={rows.trending} onCardClick={setSelectedMovie} />
          <MovieRow title="Popular on Streamify" items={rows.popular} onCardClick={setSelectedMovie} />
          <MovieRow title="Top Rated" items={rows.topRated} onCardClick={setSelectedMovie} />
          <MovieRow title="Trending TV" items={rows.tvTrending} onCardClick={setSelectedMovie} />

          {myList.length > 0 && <MovieRow title="My List" items={myList} onCardClick={setSelectedMovie} />}

          {genres.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span key={genre.id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Modal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onToggleList={toggleMyList}
        isInList={selectedMovie ? myListIds.has(`${selectedMovie.type}-${selectedMovie.id}`) : false}
      />
    </main>
  );
};

export default Home;
