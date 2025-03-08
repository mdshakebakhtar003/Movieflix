import { useState, useRef } from "react";
import { checkvaliddata } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Header from "./Header";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

function Login() {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const handleButtonClick = () => {
    const message = checkvaliddata(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: "/user.jpg", // Fixed photoURL
          }).then(() => {
            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(
              addUser({
                uid: uid,
                email: email,
                displayName: displayName,
                photoURL: photoURL,
               
              })
            );
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + " - " + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + " - " + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div>
     
      <div className="flex absolute justify-between w-full">
        {/* Netflix Logo */}
        <Header />
      </div>

      <div>
        <img className="h-screen w-screen bg-black opacity-95" src="/ntflxbg.jpg" alt="background" />

        {/* Grey background div with centered form */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-black opacity-85 p-8 rounded-md mt-28 w-1/3">
            <form className="space-y-4 w-full" onSubmit={(e) => e.preventDefault()}>
              <h1 className="text-white shadow-black text-3xl mb-4 font-bold">{isSignInForm ? "Sign In" : "Sign Up"}</h1>
              {!isSignInForm && (
                <input
                  ref={name}
                  type="text"
                  placeholder="Name"
                  className="w-full p-4 rounded-md bg-gray-700 text-white"
                />
              )}
              <input
                ref={email}
                type="email"
                placeholder="Email"
                className="w-full p-4 rounded-md bg-gray-700 text-white"
              />
              <input
                ref={password}
                type="password"
                placeholder="Password"
                className="w-full p-4 rounded-md bg-gray-700 text-white"
              />
              <button
                type="submit"
                onClick={handleButtonClick}
                className="w-full p-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {isSignInForm ? "Sign In" : "Sign Up"}
              </button>

              {errorMessage && (
                <div className="text-red-500 text-center">{errorMessage}</div>
              )}

              {/* "OR" text below the Sign In button */}
              <div className="flex justify-center mt-4">
                <h3 className="text-white">OR</h3>
              </div>

              {/* Use a Sign-in Code Button */}
              <button type="submit" className="w-full p-2 bg-gray-300 text-white rounded-md hover:bg-gray-500">
                Use a Sign-in code
              </button>

              {/* Forgot Password link */}
              <div className="flex justify-center mt-2">
                <h3 className="text-white hover:underline">Forgot Password?</h3>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 border-solid border-white hover:border-red-600"
                />
                <h3 className="text-white ml-2">Remember me</h3>
              </div>

              {/* New to Netflix sign-up */}
              <div className="flex mt-4 py-4 cursor-pointer" onClick={toggleSignInForm}>
                {isSignInForm ? (
                  <>
                    <h3 className="text-white">New to Netflix? </h3>
                    <h2 className="text-white font-bold hover:underline ml-2">Sign up now</h2>
                  </>
                ) : (
                  <h2 className="text-white font-bold hover:underline ml-2">Already registered? Sign In Now.</h2>
                )}
              </div>

              {/* reCAPTCHA note */}
              <h6 className="text-white text-sm mt-4">
                This page is protected by Google reCAPTCHA to ensure you're not a bot.
              </h6>

              {/* Learn more link */}
              <h6 className="text-xs hover:underline text-blue-600 mt-2">Learn more.</h6>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black h-96 w-full">
        <div>
          <h3 className="text-gray-400 ml-48 absolute mt-44">Questions? Call 000-800-919-1743</h3>
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
            <h3 className="text-gray-400 underline left-48 absolute mt-64">Cookie Preferences</h3>
          </div>
          <div>
            <h3 className="text-gray-400 underline left-1/3 absolute mt-64">Corporate Information</h3>
          </div>
        </div>
        <div className="ml-48 mt-80">
          <select className="bg-black text-white">
            <option value="volvo">English</option>
            <option value="saab" selected>Hindi</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Login;
