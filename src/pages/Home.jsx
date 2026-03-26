import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import Modal from "../components/Modal";
import MovieRow from "../components/MovieRow";
import SectionHeader from "../components/SectionHeader";
import Top10Card from "../components/Top10Card";
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
    <main className="space-y-0 pb-10">
      <HeroBanner movie={featuredMovie} movies={rows.trending} onOpen={setSelectedMovie} />
      <div className="space-y-10">

      {!loading && rows.trending.length > 0 && (
        <section className="relative mx-auto w-full max-w-[1600px] px-4 md:px-10">
          <SectionHeader />

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={(e) => {
                const container = e.currentTarget.nextElementSibling;
                container?.scrollBy({ left: -window.innerWidth * 0.8, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full transition duration-300 opacity-0 hover:opacity-100 focus:opacity-100"
              style={{ transform: "translate(-50%, -50%)" }}
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="scroll-container no-scrollbar flex gap-8 overflow-x-auto px-4 pb-4">
              {rows.trending.slice(0, 10).map((movie, index) => (
                <Top10Card
                  key={`top10-${movie.id}`}
                  index={index + 1}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                const container = e.currentTarget.previousElementSibling;
                container?.scrollBy({ left: window.innerWidth * 0.8, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full transition duration-300 opacity-0 hover:opacity-100 focus:opacity-100"
              style={{ transform: "translate(50%, -50%)" }}
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
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
          <MovieRow
            title="Trending Now"
            category="trending"
            items={rows.trending}
            onCardClick={setSelectedMovie}
          />
          <MovieRow
            title="Popular on Streamify"
            category="popular"
            items={rows.popular}
            onCardClick={setSelectedMovie}
          />
          <MovieRow
            title="Top Rated"
            category="topRated"
            items={rows.topRated}
            onCardClick={setSelectedMovie}
          />

          {genreRows.map((genre) => (
            <MovieRow
              key={genre.id}
              title={genre.name}
              items={genre.items}
              onCardClick={setSelectedMovie}
              genreId={genre.id}
            />
          ))}

          {myList.length > 0 && <MovieRow title="My List" items={myList} onCardClick={setSelectedMovie} />}
        </div>
      )}

      </div>
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
