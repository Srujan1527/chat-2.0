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
    <div data-testid="sign-up" className="sign-up-container">
      <form className="sign-up-form-container">
        <div className="heading-container">
          <h2 className="heading">Don't have an account</h2>
          <span className="span-heading">Sign up with your email</span>
        </div>
        <div className="input-container">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            className="input"
           
            type="text"
            id="name"
            required
            onChange={handleChange}
            name="displayName"
            placeholder="Enter your Name"
            value={displayName}
          />
        </div>
        <div className="input-container">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            
            className="input"
            type="email"
            required
            id="email"
            onChange={handleChange}
            name="email"
            placeholder="Enter your Email"
            value={email}
          />
        </div>

        <div className="input-container">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            className="input"
            
            type="password"
            required
            id="password"
            onChange={handleChange}
            name="password"
            placeholder="Enter your password"
            value={password}
          />
        </div>
        <div className="input-container">
          <label htmlFor="c-password" className="label">
            Confirm Password
          </label>
          <input
          
            className="input"
            type="password"
            required
            id="c-password"
            onChange={handleChange}
            name="confirmPassword"
            placeholder="Enter your confirm password"
            value={confirmPassword}
          />
        </div>
        <div className="input-container">
          <label htmlFor="phoneNumber" className="label">
            PhoneNumber
          </label>
          <input
        
            className="input"
            type="number"
            required
            id="phoneNumber"
            onChange={handleChange}
            name="phoneNumber"
            placeholder="Enter your phoneNumber"
            value={phoneNumber}
          />
        </div>
        <div className="input-container">
          <label htmlFor="profession" className="label">
            Profession
          </label>
          <input
      
            className="input"
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
        <button type="submit" onClick={signUp} className="button">
          SignUp
        </button>
      </form>
    </div>
  );
};

export default SignUp;