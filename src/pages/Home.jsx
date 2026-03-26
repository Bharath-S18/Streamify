import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import Modal from "../components/Modal";
import MovieRow from "../components/MovieRow";
import {
  getMovieGenres,
  getMoviesByGenre,
  getPopularMovies,
  getTopRatedMovies,
  getTrending
} from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LIST_KEY = "streamify-my-list-v1";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState({
    trending: [],
    popular: [],
    topRated: []
  });
  const [genreRows, setGenreRows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useLocalStorage(LIST_KEY, []);

  useEffect(() => {
    let mounted = true;

    const loadHome = async () => {
      setLoading(true);

      try {
        const [trending, popular, topRated, genres] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getTopRatedMovies(),
          getMovieGenres()
        ]);

        const topGenres = genres.slice(0, 3);
        const byGenre = await Promise.all(
          topGenres.map(async (genre) => ({
            id: genre.id,
            name: genre.name,
            items: (await getMoviesByGenre(genre.id)).slice(0, 16)
          }))
        );

        if (!mounted) {
          return;
        }

        setRows({
          trending: trending.slice(0, 20),
          popular: popular.slice(0, 20),
          topRated: topRated.slice(0, 20)
        });
        setGenreRows(byGenre);
      } catch {
        if (mounted) {
          setRows({ trending: [], popular: [], topRated: [] });
          setGenreRows([]);
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
      return exists ? prev.filter((item) => `${item.type}-${item.id}` !== key) : [movie, ...prev];
    });
  };

  return (
    <main className="space-y-10 pb-10">
      <HeroBanner movie={featuredMovie} onOpen={setSelectedMovie} />

      {!loading && rows.trending.length > 0 && (
        <section className="relative mx-auto w-full max-w-[1600px] px-4 md:px-10">
          <div className="mb-4 flex items-end gap-4">
            <h2 className="top10-title">TOP 10</h2>
            <p className="pb-3 text-xl font-semibold tracking-[0.4em] text-zinc-100">CONTENT TODAY</p>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
            {rows.trending.slice(0, 10).map((movie, index) => (
              <button
                key={`top10-${movie.id}`}
                type="button"
                onClick={() => setSelectedMovie(movie)}
                className="top10-card group"
              >
                <span className="top10-rank">{index + 1}</span>
                <img src={movie.posterUrl} alt={movie.title} loading="lazy" className="relative z-10 h-[340px] w-[230px] rounded-2xl object-cover shadow-2xl transition duration-300 group-hover:-translate-y-1" />
              </button>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 md:px-10">
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
        <div className="mx-auto w-full max-w-[1600px] space-y-10 px-4 md:px-10">
          <MovieRow title="Trending Now" items={rows.trending} onCardClick={setSelectedMovie} />
          <MovieRow title="Popular on Streamify" items={rows.popular} onCardClick={setSelectedMovie} />
          <MovieRow title="Top Rated" items={rows.topRated} onCardClick={setSelectedMovie} />

          {genreRows.map((genre) => (
            <MovieRow key={genre.id} title={genre.name} items={genre.items} onCardClick={setSelectedMovie} />
          ))}

          {myList.length > 0 && <MovieRow title="My List" items={myList} onCardClick={setSelectedMovie} />}
        </div>
      )}

      <Modal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onToggleList={toggleMyList}
        isInList={selectedMovie ? myListIds.has(`${selectedMovie.type}-${selectedMovie.id}`) : false}
        onOpenMovie={setSelectedMovie}
      />
    </main>
  );
};

export default Home;
