import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `rounded-md px-2 py-1.5 text-sm transition ${
    isActive ? "text-white" : "text-zinc-300 hover:text-white"
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
    <header className="sticky top-0 z-50 bg-black/25 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-4 md:px-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-sm font-black text-white shadow-lg shadow-red-600/30">
            ▶
          </div>
          <span className="text-3xl font-semibold tracking-tight text-white">Streamify</span>
        </button>

        <nav className="hidden items-center gap-4 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <button
            type="button"
            className="rounded-md px-2 py-1.5 text-sm text-zinc-300 transition hover:text-white"
            onClick={() => navigate("/search")}
          >
            Browse
          </button>
        </nav>

        <form onSubmit={onSearch} className="hidden items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 md:flex">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search"
            className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-zinc-400"
          />
          <button className="text-zinc-100" type="submit">
            ⌕
          </button>
        </form>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/search")} className="rounded-full border border-white/20 bg-black/30 p-2 text-white md:hidden">
            ⌕
          </button>
          <button type="button" className="rounded-full border border-white/20 bg-black/30 p-2 text-white">👤</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
