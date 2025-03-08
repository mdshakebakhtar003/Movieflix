import { useSelector } from "react-redux";
import MovieList from "./MovieList";
function Secondarydiv() {
  const movies = useSelector((store) => store.movies);

  return (
    movies.nowPlayingMovies && (
     
        <div className="mt-0 bg-black md:mt-20 pl-4 md:pl-12 relative z-20">
          <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
          <MovieList title={"Trending"} movies={movies.nowPlayingMovies} />
          <MovieList title={"Popular"} movies={movies.nowPlayingMovies} />
          <MovieList
            title={"Upcoming Movies"}
            movies={movies.nowPlayingMovies}
          />
          <MovieList title={"Horror"} movies={movies.nowPlayingMovies} />
        </div>
      )
    );
  }
  export default Secondarydiv;