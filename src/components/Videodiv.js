import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "./constants";
import { addTrailerVideo } from "../utils/moviesSlice";

const Videodiv = ({movieId }) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);


  const getMovieVideos = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" +
      movieId +
      "/videos?language=en-US",
      API_OPTIONS
    );
    const json = await data.json();
 const filterData = json.results.filter((video) => video.type === "Trailer");
    const trailer = filterData.length ? filterData[0] : json.results[0];
    dispatch(addTrailerVideo(trailer));
  };

  useEffect(() => {
     getMovieVideos();
  }, []);

  return (
    <div>
      {/* YouTube Embed with autoplay, muted, and no suggestions or branding */}
      <div className="absolute w-full h-full top-0 left-0">
        <iframe
          className="w-screen bg-black aspect-video"
          src={
            "https://www.youtube.com/embed/" +
            trailerVideo?.key +
            "?&autoplay=1&mute=1&rel=0&modestbranding=1&controls=0"
          }
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
  );
};

export default Videodiv;
