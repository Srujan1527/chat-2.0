import React, { useState } from "react";
import { useSelector ,useDispatch} from "react-redux";
import { setLogin } from "../state/state";
// import "./SignIn.css";
// import { useNavigate } from "react-router-dom";
import {
 
  signInAuthUserEmailAndPassword,
} from "../firebase/firebase";
import { useRouter } from "next/router";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router=useRouter()
  const dispatch=useDispatch()


  const signIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signInAuthUserEmailAndPassword(email, password);
      const { user } = response;
      const newUser=JSON.stringify(user)
      const newAccessToken=await user.getIdToken()
      dispatch(setLogin({user:JSON.parse(newUser),token:newAccessToken}))

     

      console.log(user);
      if (user) {
        router.push("/receiver")
      }
    
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect Email or Password ");
      } else if (error.code === "auth/user-not-found") {
        alert("Email does not exits");
      }
      console.log("user creation encountered error", error.message);
    }
  };

  const registerUser = () => {
    router.push("/signup")
  };
  return (
    // <div data-testid="sign-in" className="min-h-screen ">
    //   <form onSubmit={signIn} className="border-2 w-full sm:w-100 h-screen flex justify-center flex-col items-center">
    //     <div className="md:w-4/12  sm:w-screen border-2 p-4 rounded-lg ">

    //     <h1 className="sm: sm:text-3xl  mt-4 mb-10 text-center md:text-2xl font-bold leading-9 tracking-tight text-gray-900">Login</h1>
    //     <div className="mb-4 ml-8">
    //       <label htmlFor="login-email" className="block text-sm font-medium leading-6 text-gray-900">
    //         Email
    //       </label>
    //       <input
    //         type="email"
    //         placeholder="Enter your email"
    //         id="login-email"
    //         required
    //         value={email}
    //         className="block  p-2 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //     </div>
    //     <div className="mb-4 ml-8">
    //       <label htmlFor="login-password" className="block text-sm font-medium leading-6 text-gray-900">
    //         Password
    //       </label>
    //       <input
    //         type="password"
    //         id="login-password"
    //         required
    //         placeholder="Enter your password"
    //         value={password}
    //         className="block p-2 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>
    //     <div className="flex ml-10 m-4 justify-start ">
    //       <button type="submit" className=" w-20 mb-2 mr-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    //         Log in{" "}
    //       </button>
    //       <button type="button" onClick={registerUser} className="w-20  mb-2 ml-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
    //         Sign Up
    //       </button>
    //     </div>
    //     </div>
    //   </form>
    // </div>
    <div data-testid="sign-in" className="min-h-screen">
  <form onSubmit={signIn} className="border-2 w-full sm:w-full h-screen flex justify-center items-center">
    <div className="md:w-4/12 sm:w-full border-2 p-4 rounded-lg">

      <h1 className="sm:text-3xl mt-4 mb-10 text-center md:text-2xl font-bold leading-9 tracking-tight text-gray-900">Login</h1>
      <div className="mb-4 mx-8">
        <label htmlFor="login-email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          id="login-email"
          required
          value={email}
          className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4 mx-8">
        <label htmlFor="login-password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          required
          placeholder="Enter your password"
          value={password}
          className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex mx-10 my-4 justify-start">
        <button type="submit" className="w-24 mb-2 mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Log in
        </button>
        <button type="button" onClick={registerUser} className="w-24 mb-2 ml-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Sign Up
        </button>
      </div>
    </div>
  </form>
</div>

  );
};

export default SignIn;