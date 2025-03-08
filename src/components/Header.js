import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";


function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const handleSignOut=()=>{
    signOut(auth)
    .then(() => {})
    .catch((error) => {
      navigate("/error");
    });
};
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, email, displayName, photoURL} = user;
      dispatch(
        addUser({
          uid: uid,
          email: email,
          displayName: displayName,
          photoURL: photoURL,
         
        })
      );
      navigate("/browse");
    } else {
      dispatch(removeUser());
      navigate("/");
    }
  });

  // Unsiubscribe when component unmounts
  return () => unsubscribe();
}, []);
  return (
  
      <div className="flex   justify-between">
        <div className="bg-gradient-to-b from to-black">
          <img
            className="absolute shadow-gray-300 h-12 w-36 ml-44 mt-4 pt-1 z-10"
            src="\red-netflix-logo-text-png-3.png"
            alt="logo"
          />
        </div>
        {user &&
        <div className="z-10 flex mt-4 mr-26">
          <img className="w-12 h-12 rounded-lg" src={user?.photoURL} alt="profile" />
          <button onClick={handleSignOut} className="font-bold text-white ">
            (Sign Out)
          </button>
        </div>}
      </div>

     
    
  );
}

export default Header;
