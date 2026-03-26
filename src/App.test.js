import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

jest.mock("./pages/Home", () => () => <div>Home Page</div>);
jest.mock("./pages/Search", () => () => <div>Search Page</div>);
jest.mock("./pages/Watch", () => () => <div>Watch Page</div>);

jest.mock("./services/api", () => ({
  getTrending: jest.fn().mockResolvedValue([]),
  getPopularMovies: jest.fn().mockResolvedValue([]),
  getTopRatedMovies: jest.fn().mockResolvedValue([]),
  getTrendingTv: jest.fn().mockResolvedValue([]),
  getMovieGenres: jest.fn().mockResolvedValue([]),
  searchMedia: jest.fn().mockResolvedValue([]),
  config: {
    VIKING_BASE_URL: "https://example-viking.test"
  }
}));

test("renders streamify navbar", () => {
  render(<App />);
  const headingElement = screen.getByText(/streamify/i);
  expect(headingElement).toBeInTheDocument();
});
