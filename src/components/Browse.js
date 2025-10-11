import Header from "./Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import Videodiv from "./Videodiv";
import Videotitlediv from "./Videotitlediv";
import Secondarydiv from "./Secondarydiv";
import { API_OPTIONS } from "./constants";
import { buildTmdbUrl, getTmdbOptions } from "../utils/tmdb";
import { getMovieQueryFromGemini } from "../utils/gemini";

const Browse = () => {
  const dispatch = useDispatch();
  
  // State to manage search input and results
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false); // <-- loading state

  // Fetch now playing movies
  const getNowPlayingMovies = async () => {
    try {
      const url = buildTmdbUrl("https://api.themoviedb.org/3/movie/now_playing?page=1");
      const data = await fetch(url, getTmdbOptions());
      if (!data.ok) throw new Error(`HTTP error ${data.status}`);
      const json = await data.json();
      dispatch(addNowPlayingMovies(json.results || []));
    } catch (err) {
      console.error("Failed to fetch now playing", err);
      setError("Failed to load movies. Please try again later.");
    }
  };

  useEffect(() => {
    getNowPlayingMovies();
  }, []);

  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const mainMovie = movies && movies.length > 0 ? movies[0] : { original_title: "", overview: "", id: null };
  const { original_title, overview, id } = mainMovie;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsMuted(true);
    setError(null);
    setLoading(true); // start loading

    try {
      const parsed = await getMovieQueryFromGemini(searchQuery);
      console.debug("Gemini parsed:", parsed);

      const filterMoviesWithVideos = async (moviesArray, maxResults = 20) => {
        if (!Array.isArray(moviesArray) || moviesArray.length === 0) return [];
        const verified = [];
        for (const m of moviesArray) {
          if (!m || !m.id) continue;
          try {
            const vUrl = buildTmdbUrl(`https://api.themoviedb.org/3/movie/${m.id}/videos?language=en-US`);
            const vRes = await fetch(vUrl, getTmdbOptions());
            if (!vRes.ok) continue;
            const vJson = await vRes.json();
            if (vJson && Array.isArray(vJson.results) && vJson.results.length > 0) {
              const good = vJson.results.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
              if (good) verified.push(m);
            }
          } catch (err) {}
          if (verified.length >= maxResults) break;
        }
        return verified;
      };

      if (Array.isArray(parsed?.titles) && parsed.titles.length > 0) {
        const titles = Array.from(new Set(parsed.titles.map((t) => t && t.trim()).filter(Boolean)));
        const titleSearches = titles.map(async (t) => {
          const url = buildTmdbUrl(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(t)}&page=1`);
          const r = await fetch(url, getTmdbOptions());
          if (!r.ok) return [];
          const js = await r.json();
          return js.results || [];
        });

        const resultsArr = await Promise.all(titleSearches);
        const flat = resultsArr.flat();
        const seen = new Map();
        for (const item of flat) {
          if (item && item.id && !seen.has(item.id)) seen.set(item.id, item);
        }
        let final = Array.from(seen.values());
        try {
          final = await filterMoviesWithVideos(final);
        } catch (err) {
          console.warn("Error filtering movies by videos", err);
        }
        setSearchResults(final);
        setSelectedMovie(null);
        return;
      }

      // Fallback logic when Gemini doesn't return titles
      let titles = [];
      const supplement = [];

      const genre = parsed && Array.isArray(parsed.genres) && parsed.genres.length > 0 ? parsed.genres[0] : null;
      if (genre) {
        try {
          const url = buildTmdbUrl(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(genre)}&page=1`);
          const r = await fetch(url, getTmdbOptions());
          if (r.ok) {
            const js = await r.json();
            (js.results || []).forEach((m) => { if (m && m.title) supplement.push(m.title); });
          }
        } catch (e) {}
      }

      if (titles.length + supplement.length < 20) {
        const q = parsed && parsed.query ? parsed.query : searchQuery;
        try {
          const url = buildTmdbUrl(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&page=1`);
          const r = await fetch(url, getTmdbOptions());
          if (r.ok) {
            const js = await r.json();
            (js.results || []).forEach((m) => { if (m && m.title) supplement.push(m.title); });
          }
        } catch (e) {}
      }

      if (titles.length + supplement.length < 20) {
        try {
          const url = buildTmdbUrl(`https://api.themoviedb.org/3/movie/popular?page=1`);
          const r = await fetch(url, getTmdbOptions());
          if (r.ok) {
            const js = await r.json();
            (js.results || []).forEach((m) => { if (m && m.title) supplement.push(m.title); });
          }
        } catch (e) {}
      }

      for (const t of supplement) {
        if (titles.length >= 20) break;
        if (!t) continue;
        const tt = t.trim();
        if (!titles.includes(tt)) titles.push(tt);
      }

      if (!titles || titles.length === 0) {
        const refined = (parsed && parsed.query) ? parsed.query : searchQuery;
        console.debug("Refined query:", refined);
        const url = buildTmdbUrl(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(refined)}&page=1`);
        const res = await fetch(url, getTmdbOptions());
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setSelectedMovie(null);
        return;
      }

      const titleSearches = titles.map(async (t) => {
        const url = buildTmdbUrl(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(t)}&page=1`);
        const r = await fetch(url, getTmdbOptions());
        if (!r.ok) return [];
        const js = await r.json();
        return js.results || [];
      });

      const resultsArr = await Promise.all(titleSearches);
      const flat = resultsArr.flat();
      const seen = new Map();
      for (const item of flat) {
        if (item && item.id && !seen.has(item.id)) seen.set(item.id, item);
      }
      let final = Array.from(seen.values());
      try {
        final = await filterMoviesWithVideos(final);
      } catch (err) {
        console.warn("Error filtering movies by videos", err);
      }
      setSearchResults(final);
      setSelectedMovie(null);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again later.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleBackToHome = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMovie(null);
    setIsMuted(true);
    setError(null);
  };

  return (
    <div>
      <div className="h-full">
        {/* Search button and input */}
        <div className="flex">
          <form className="absolute z-10 top-7 right-48" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-56 h-8 pl-3 pr-10 rounded-md bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                aria-label="Search"
                title="Search"
                disabled={loading}
                className={`absolute right-1 top-1.5 h-5 w-15 flex items-center justify-center text-white bg-red-800 rounded p-0.5 hover:bg-red-700 ${loading ? "cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="text-sm">wait...</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>

        <Header />

        {error && (
          <div className="text-red-400 absolute top-20 right-48">{error}</div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="absolute top-20 right-48 z-50 bg-black p-4 w-96 rounded-md shadow-lg">
            <h2 className="text-xl text-white mb-2">Search Results</h2>
            <div className="overflow-y-auto max-h-72">
              {searchResults.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center space-x-2 py-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => {
                    setSelectedMovie(m);
                    setSearchResults([]);
                    setSearchQuery(m.title || m.original_title || "");
                  }}
                >
                  <img src={(m.poster_path && ("https://image.tmdb.org/t/p/w92" + m.poster_path)) || "/user.jpg"} alt={m.title} className="w-12 h-auto rounded" />
                  <div>
                    <div className="text-white">{m.title || m.original_title}</div>
                    <div className="text-gray-400 text-sm">{m.release_date}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-end">
              <button className="text-gray-300" onClick={handleBackToHome}>Close</button>
            </div>
          </div>
        )}

        <Videodiv movieId={(selectedMovie && selectedMovie.id) || id} isMuted={isMuted} />
        <Videotitlediv
          title={selectedMovie?.title || original_title}
          overview={selectedMovie?.overview || overview}
          onPlay={() => setIsMuted(false)}
          movieId={(selectedMovie && selectedMovie.id) || id}
        />
      </div>

      <div className="mt-96 bg-black">
        <Secondarydiv />
      </div>

      <div className="bg-black h-96 w-full">
        <div>
          <h3 className="text-gray-400 ml-48 absolute mt-44">
            {lang === "en" ? "Questions? Call 000-800-919-1743" : "प्रश्न? कॉल करें 000-800-919-1743"}
          </h3>
        </div>
        <div className="flex justify-around flex-wrap">
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">{lang === "en" ? "FAQ" : "सामान्य प्रश्न"}</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">{lang === "en" ? "Help Centre" : "सहायता केंद्र"}</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">{lang === "en" ? "Terms of Use" : "उपयोग की शर्तें"}</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">{lang === "en" ? "Privacy" : "गोपनीयता"}</h3>
          </div>
        </div>
        <div className="flex items-center ml-1 justify-evenly flex-wrap">
          <div>
            <h3 className="text-gray-400 underline absolute left-48 mt-64">{lang === "en" ? "Cookie Preferences" : "कुकी प्राथमिकताएँ"}</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute left-1/3 mt-64">{lang === "en" ? "Corporate Information" : "कॉर्पोरेट जानकारी"}</h3>
          </div>
        </div>
        <div className="ml-48 mt-80">
          <select
            className="bg-black text-white"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Browse;
