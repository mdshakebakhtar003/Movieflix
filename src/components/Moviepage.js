import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_OPTIONS } from "./constants";
// Assume this is the image URL base
import { useDispatch, useSelector } from "react-redux";
import { addTrailerVideo } from "../utils/moviesSlice";
import Videodiv from "./Videodiv";
const MoviePage = () => {
  const { id } = useParams(); 
  const navigate=useNavigate();
  const handleback = () => {
    // Navigate to the movie page with the movieId as part of the URL
    navigate(`/browse`);
  };

 
  return (
    <div className="movie-page-container">
      <button className="bg-white absolute h-8 w-8 ml-36 mt-12 z-10 rounded-xl" onClick={handleback}> <h2 className="text-black ">&larr;</h2></button>
    
     <Videodiv movieId={id} />
     
    </div>
  );
};

export default MoviePage;
