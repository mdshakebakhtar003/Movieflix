import { useSelector } from "react-redux";
import Videodiv from "./Videodiv";
import Videotitlediv from "./Videotitlediv";

const Maindiv = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);

  if (!movies) return;

  const mainMovie = movies[0];

  const { original_title, overview, id } = mainMovie;
  

  return (
    <div className="pt-[30%] bg-black md:pt-0">
      <Videotitlediv title={original_title} overview={overview} />
      <Videodiv movieId={id} />
    </div>
  );
};
export default Maindiv;