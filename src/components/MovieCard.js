import { IMG_CDN_URL } from "./constants";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ posterPath, movieId }) => {
  const navigate = useNavigate(); // Hook to programmatically navigate to another route

  const handleImageClick = () => {
    // Navigate to the movie page with the movieId as part of the URL
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="w-36 md:w-48 pr-4 hover:cursor-pointer">
      {/* Movie Poster */}
      <img
        alt="Movie Card"
        src={IMG_CDN_URL + posterPath}
        className="w-full h-auto object-cover transition-transform duration-300 transform hover:scale-110 hover:translate-y-[-15px] rounded-lg shadow-lg"
        onClick={handleImageClick} // When the image is clicked, navigate to movie page
      />
    </div>
  );
};

export default MovieCard;
