import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const Search = lazy(() => import("./pages/Search"));
const Watch = lazy(() => import("./pages/Watch"));
const DetailsPage = lazy(() => import("./pages/DetailsPage"));

const App = () => {
  useEffect(() => {
    const prefetchRoutes = () => {
      import("./pages/DetailsPage");
      import("./pages/Watch");
      import("./pages/Search");
    };

    let idleId;
    let timeoutId;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(prefetchRoutes, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(prefetchRoutes, 1200);
    }

    return () => {
      if (typeof window !== "undefined" && idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-app-bg text-app-text">
        <Navbar />
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watch/:type/:id" element={<Watch />} />
            <Route path="/:type/:tmdbId" element={<DetailsPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
