const Videotitlediv = ({ title, overview }) => {
  const handlevid=()=>{
      
  };
    return (
        <div className="z-20">
        <h1 className="absolute z-10 mt-32 ml-28 text-5xl font-bold text-white">
        {title}
      </h1>
      <div className="h-32">
        <h3 className="absolute w-56 h-32 mt-48 z-10  ml-28 text-xl font-bold text-white">
          {overview}
        </h3>
      </div>
      <div className="flex">
        <button
          type="submit"
          className="ml-28 mt-80 absolute h-14 w-32 p-4 bg-white text-black rounded-md hover:bg-gray-700"
          onClick={handlevid}
        >
           ▶Play
        </button>
        <button
          type="submit"
          className="ml-64 mt-80 absolute h-14 w-32 p-4 bg-slate-700 opacity-95 text-white rounded-md hover:bg-blue-600"
        >
          <h3>More info</h3>
        </button>
        </div></div>
    );
  };
  export default Videotitlediv;