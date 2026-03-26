import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm transition ${
    isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const onSearch = (event) => {
    event.preventDefault();
    const q = term.trim();
    if (!q) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b1220]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-7 w-7 place-items-center rounded bg-app-accent text-[10px] font-black">S</div>
          <button onClick={() => navigate("/")} className="text-sm font-semibold tracking-wide md:text-base">
            Streamify
          </button>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Movies
          </NavLink>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
            onClick={() => navigate("/search?q=tv")}
          >
            TV Shows
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
            onClick={() => navigate("/search?q=people")}
          >
            People
          </button>
        </nav>

        <form
          onSubmit={onSearch}
          className="order-last flex w-full max-w-2xl items-center gap-2 rounded-md border border-white/10 bg-[#101929] px-3 py-2 md:order-none"
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for a movie, tv show, person"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <button className="text-xs font-medium text-zinc-300 transition hover:text-white" type="submit">
            Search
          </button>
        </form>

        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500" title="Profile" />
      </div>
    </header>
  );
};

export default Navbar;
