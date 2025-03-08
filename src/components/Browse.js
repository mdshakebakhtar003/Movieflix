import Header from "./Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import Videodiv from "./Videodiv";
import Videotitlediv from "./Videotitlediv";
import Secondarydiv from "./Secondarydiv";
import { API_OPTIONS } from "./constants";

const Browse = () => {
  const dispatch = useDispatch();
  
  // State to manage search input
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch now playing movies
  const getNowPlayingMovies = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addNowPlayingMovies(json.results));
  };

  // Trigger the fetch when the component is mounted
  useEffect(() => {
    getNowPlayingMovies();
  }, []);

  // Redux selector for movies
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);

  // Return early if there are no movies
  if (!movies) return null;

  // Get the first movie for the main display
  const mainMovie = movies[0];
  const { original_title, overview, id } = mainMovie;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit (e.g., trigger API search if needed)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // Perform the search here, e.g., fetch search results from an API
  };

  return (
    <div>
      <div className="h-full">
        {/* Search button and input */}
        <div className="flex">
          <button
            className="bg-gray-700 absolute top-7 right-48 h-8 w-8 z-30 rounded-md"
            onClick={handleSearchSubmit} // Trigger search when button is clicked
          >
            <h2 className="text-black">🔍</h2>
          </button>
          <form 
            className="absolute z-10 top-7 right-48"
            onSubmit={handleSearchSubmit} // Handle form submission
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange} // Update the state with input value
              placeholder="Search"
              className="w-44 h-8 p-4 rounded-md bg-gray-700 text-white"
            />
          </form>
        </div>

        <Header />

        {/* Main content with video and title */}
        <Videodiv movieId={id} />
        <Videotitlediv title={original_title} overview={overview} />
      </div>

      {/* Secondarydiv appears below the content */}
      <div className="mt-96 bg-black">
        <Secondarydiv />
      </div>

      {/* Footer Section */}
      <div className="bg-black h-96 w-full">
        <div>
          <h3 className="text-gray-400 ml-48 absolute mt-44">
            Questions? Call 000-800-919-1743
          </h3>
        </div>
        <div className="flex justify-around flex-wrap">
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">FAQ</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">Help Centre</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">Terms of Use</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute mt-52">Privacy</h3>
          </div>
        </div>
        <div className="flex items-center ml-1 justify-evenly flex-wrap">
          <div>
            <h3 className="text-gray-400 underline absolute left-48 mt-64">Cookie Preferences</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline absolute left-1/3 mt-64">Corporate Information</h3>
          </div>
        </div>
        <div className="ml-48 mt-80">
          <select className="bg-black text-white">
            <option value="volvo">English</option>
            <option value="saab" selected>
              Hindi
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Browse;
