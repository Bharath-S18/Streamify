# Streamify

Streamify is a modern movie and TV discovery web app built with React + Vite. It uses TMDB data to let users browse trending content, search titles, and watch trailers in a clean streaming-style UI.

## ✨ Features

- Hero banner with featured content
- Movie/show rows by category
- Reusable cards and modal previews
- Search experience with debounced input
- Watch page with an embedded player (always starts from the beginning).
- "My List" feature to save favorite movies and shows.
- Dynamic content rows that fall back to popular content if a specific category is empty.
- Responsive layout for desktop and mobile.

## 🧱 Tech Stack

- React (Vite)
- React Router
- Tailwind CSS + PostCSS
- TMDB API

## 📁 Project Structure

```text
/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── HeroBanner.jsx
│   │   ├── Modal.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieRow.jsx
│   │   └── Navbar.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   └── Watch.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── tmdb.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### 1) Clone

Clone this repository to your machine.

### 2) Install dependencies

Install packages with npm.

### 3) Configure environment variables

Create a `.env` file at the project root (if not already present):

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> Vite exposes only variables prefixed with `VITE_` to client code.

### 4) Run in development

Start the Vite dev server and open the local URL shown in terminal.

## 📦 Build for Production

Generate an optimized production build. Output goes to the `build/` folder in this project.

## 🧪 Lint / Quality

Run linting to catch common code issues before pushing changes.

## 🖼️ Screenshots

Add screenshots here after hosting assets, for example:

- Home page
- Search page
- Watch page

## 🌍 Deployment

This app can be deployed to any static hosting platform (for example Vercel, Netlify, GitHub Pages, or Azure Static Web Apps).

Typical flow:

1. Build the app
2. Deploy the build output directory
3. Add `VITE_TMDB_API_KEY` in host environment variables

## 🛣️ Roadmap Ideas

- Authentication and user profiles
- Watchlist / favorites sync
- Genre and language filters
- Infinite scroll / pagination
- Better accessibility and keyboard navigation

## 🤝 Contributing

Contributions are welcome! Open an issue for ideas/bugs or submit a pull request.

