import MovieCard from "./MovieCard";

// MovieList component
const MovieList = ({ title, movies }) => {
  return (
    <div className="bg-black">
      <h1 className="text-lg md:text-3xl py-2 text-white">{title}</h1>
      
      {/* Container for horizontal scrolling */}
      <div className="overflow-x-auto max-w-full"> {/* Ensure the container takes full width */}
        <div className="flex  space-x-4"> {/* Ensure space between cards */}
          {movies?.map((movie) => (
            <div className="flex-shrink-0" key={movie.id}> {/* Prevent shrinking */}
              {/* Each MovieCard has a fixed width */}
              <MovieCard posterPath={movie.poster_path}  movieId={movie.id}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
