import React, { useState, useEffect } from "react";
import localStorage from "localStorage";
import { useSelector ,useDispatch} from "react-redux";

import { useRouter } from "next/router";
import { createUserMessageDocumentFromAuth,queryToGetMessagesFromDb } from "../firebase/firebase";
import { setLogOut ,setMessages} from "../state/state";



function Message() {
  const [message, setMessage] = useState("");
  const dispatch=useDispatch()
  

  const user=useSelector((state:any)=>state.user )
  const receiverMail=useSelector((state:any)=>state.receiverMail)
  const stateMessages=useSelector((state:any)=>state.messages)
 if(!stateMessages) return
 const msgArray=stateMessages[0].messages


  const router = useRouter();
  
  

  const sendMessage =async (e: any) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      createdAt: new Date(),
      email: user.email,
      receiverMail:receiverMail
        };
    await createUserMessageDocumentFromAuth(user,newMessage)
    console.log("message document created")
   
    setMessage("");
    const data=await queryToGetMessagesFromDb(user)
    const strigifiedData=JSON.stringify(data)
    dispatch(setMessages({
      messages:JSON.parse(strigifiedData)
    }))
    
  };

 
  console.log(msgArray)

 
 const filteredArray=msgArray.filter((each:any)=>each.receiverMail===receiverMail)
 console.log(filteredArray)
 const logOut=()=>{
  dispatch(setLogOut())
  router.replace("/login")


 }
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% overflow-auto h-screen w-full">
      <div className="flex justify-center items-center">
        <h1 className="text-white hover:text-red-700 hover:my-8 text-center font-serif font-extrabold relative">
          Welcome to Srujan's Chatting App
        </h1>
        <button
          className=" bg-transparent border-2 ml-1 border-red-950 text-white px-4 py-1 rounded-md "
          onClick={logOut}
        >
         Logout
        </button>
      </div>
      <ul className="w-full">
        {filteredArray.map((each: any, index: any) => (
          <li key={index}>
            <div className="text-white  w-fit break-words font-bold hover:text-red-950 hover:px-10 bg-transparent border-2 hover:border-black rounded-lg  mx-4  hover:border-dotted  border-white px-2 my-1">
              {each.text}
            </div>
            <p className="text-xs text-blue-950 ml-10">sent to {each.receiverMail}</p>
          </li>
        ))}
      </ul>
      <form className="absolute bottom-2 w-full flex justify-center items-center" onSubmit={sendMessage}>
        
        <input
          className="block p-2 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Enter Your Text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
         className="w-12 p-2 mb-2 ml-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="submit"
        >
          send
        </button>
      </form>
    </div>
  );
}

export default Message;
