import React, { useState, useContext } from "react";

// import { useNavigate } from "react-router-dom";
// import "./SignUp.css";
// import { UserContext } from "../../context/userContext";
import {
  createAuthUserEmailAndPassword,
  createUserDocumentFromAuth,
} from "../firebase/firebase";
import { useRouter } from "next/router";


const defaultFormFields = {
  displayName: "",
  email: "",
  phoneNumber: "",
  profession: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
    
    const router=useRouter()
   const [user,setUser]=useState(null)
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {
    displayName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    profession,
  } = formFields;
//   const { currentUser, setCurrentUser } = useContext(UserContext);

//   const navigate = useNavigate();
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  const handleChange = (event:any) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };
  const signUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    }
    try {
      const response = await createAuthUserEmailAndPassword(email, password);
      const {user} = response;
    
      setUser(user)

      await createUserDocumentFromAuth(user, formFields);
      resetFormFields();
     router.push("/login")
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      }
      console.log("user creation encountered error", error.message);
    }
  };
  return (
    <div data-testid="sign-up" className="min-h-screen">
        <form className="border-2 w-full h-screen flex justify-center flex-col items-center">
            <div className="w-11/12 md:w-1/2 border-2 p-4 rounded-lg">

            <div className="heading-container">
              <h2 className="mt-4 mb-6 md:mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Do not have an account</h2>
              <span className="mt-4 ml-2 md:ml-8 mb-10 md:mb-14 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up with your email</span>
            </div>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <input
                className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                id="name"
                required
                onChange={handleChange}
                name="displayName"
                placeholder="Enter your Name"
                value={displayName}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email"
                required
                id="email"
                onChange={handleChange}
                name="email"
                placeholder="Enter your Email"
                value={email}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <input
                className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password"
                required
                id="password"
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
                value={password}
              />
            </div>
            <div className="mb-4">
        <label htmlFor="c-password" className="block text-sm font-medium leading-6 text-gray-900">
          Confirm Password
        </label>
        <input
          className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="password"
          required
          id="c-password"
          onChange={handleChange}
          name="confirmPassword"
          placeholder="Enter your confirm password"
          value={confirmPassword}
          />
          </div>
          <div className="mb-4">
    <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
      PhoneNumber
    </label>
    <input
      className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      type="number"
      required
      id="phoneNumber"
      onChange={handleChange}
      name="phoneNumber"
      placeholder="Enter your phoneNumber"
      value={phoneNumber}
    />
  </div>

  <div className="mb-4">
    <label htmlFor="profession" className="block text-sm font-medium leading-6 text-gray-900">
      Profession
    </label>
    <input
      className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      type="text"
      required
      id="profession"
      onChange={handleChange}
      name="profession"
      placeholder="Enter your profession"
      value={profession}
    />
  </div>

  {user && (
    <span className="message">User has been successfully Created</span>
  )}

  <div className="flex mt-6 justify-center items-center">
    <button type="submit" onClick={signUp} className="w-32 mb-2 md:mr-4 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      SignUp
    </button>
  </div>
  
</div>
</form>
</div>

  
  );
};

export default SignUp;