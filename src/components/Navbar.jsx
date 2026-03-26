import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchModal from "./SearchModal";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition duration-200 ${
    isActive ? "text-white" : "text-zinc-300 hover:text-white"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Check if current page needs back button
  const showBackButton = location.pathname.startsWith("/watch") || 
                         location.pathname.startsWith("/details");

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent pointer-events-none">
        <div className="pointer-events-auto mx-auto flex w-full max-w-full items-center justify-between px-4 py-4 md:px-10">
          
          {showBackButton ? (
            // Back Button for /watch and /details pages
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-2xl text-white transition duration-200 hover:opacity-75"
              aria-label="Go back"
            >
              ←
            </button>
          ) : (
            // Logo on LEFT
            <button onClick={() => navigate("/")} className="flex items-center gap-2 transition duration-200 hover:opacity-80">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-sm font-black text-white shadow-lg shadow-red-600/40">
                ▶
              </div>
              <span className="text-2xl font-bold tracking-tight text-white hidden sm:inline">Streamify</span>
            </button>
          )}

          {!showBackButton && (
            // Right Section: Home + Search
            <div className="flex items-center justify-end gap-8">
              <NavLink 
                to="/" 
                className={({ isActive }) =>
                  `text-base font-medium text-white transition duration-200 ${
                    isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`
                }
                end
              >
                Home
              </NavLink>
              
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="cursor-pointer transition duration-200 hover:opacity-75"
                aria-label="Search"
              >
                <img src="/search_icon.png" alt="Search" className="w-6 h-6 object-contain" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

export default Navbar;
