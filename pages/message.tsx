import React, { useState, useEffect } from "react";
import localStorage from "localStorage";
import { useSelector ,useDispatch} from "react-redux";

import { useRouter } from "next/router";
import { createUserMessageDocumentFromAuth,queryToGetMessagesFromDb ,queryToGetReceiverMailMessagesFromDb,getRealTimeMessages,signOutUser} from "../firebase/firebase";
import { setLogOut ,setMessages,setReceiverMessages} from "../state/state";




function Message() {
  const token=useSelector((state:any)=>state.token )
  const user=useSelector((state:any)=>state.user )
  const receiverMail=useSelector((state:any)=>state.receiverMail)
  const stateMessages=useSelector((state:any)=>state.messages)
  const receiverMessages=useSelector((state:any)=>state.receiverMessages)
  let router=useRouter()
  let msgArray:any
  let receiverMsgArray:any
  const [message, setMessage] = useState("");
  const dispatch=useDispatch()


  const fetchMessages= async()=>{
    const data=await queryToGetMessagesFromDb(user,receiverMail)
    const receiverData= await queryToGetReceiverMailMessagesFromDb(user,receiverMail)

    const strigifiedData=JSON.stringify(data)
    const stringifiedRecieverData=JSON.stringify(receiverData)
    dispatch(setMessages({
      messages:JSON.parse(strigifiedData)
    }))
    dispatch(setReceiverMessages({
      receiverMessages:JSON.parse(stringifiedRecieverData)
    }))
  }

  const getRealTimeMessagesFromDB=async()=>{
    const unsubscribe = await getRealTimeMessages(user.email,receiverMail, (updatedMessages:any) => {
      // Dispatch updated messages to state
      dispatch(setMessages({
        messages: updatedMessages,
      }));
    });

    return unsubscribe
  }

  useEffect(()=>{
    if(!token){
      router.replace("/login")
    }
    let unsubscribe:any
    let interval:any
    const mainFunctions=async()=>{
      fetchMessages()
  
        interval = setInterval(fetchMessages, 1000)
      
      unsubscribe= await getRealTimeMessagesFromDB()

    }
    mainFunctions()
   return () => {
      clearInterval(interval)
      unsubscribe
    };
    
  },[])
  

 

  if (!receiverMessages || receiverMessages.length === 0) return null;
  if (!stateMessages || stateMessages.length === 0) return null;
  
//  console.log(stateMessages)
 
 if(stateMessages==="No Such Document"){
   msgArray="No Such Document"
 }
 
 else{
    console.log(stateMessages)
    msgArray=stateMessages[0].messagesArray
 }
 if(receiverMessages==="No Such Document"){
  receiverMsgArray="No Such Document"
}else{

  receiverMsgArray=receiverMessages[0].messagesArray
}


const logOut=async()=>{
  await  signOutUser()
  router.replace("/login")
  dispatch(setLogOut())

}
  

const sendMessage =async (e: any) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      createdAt: new Date(),
      email: user.email,
      receiverMail:receiverMail
        };
      
    await createUserMessageDocumentFromAuth(user,newMessage)

   
    setMessage("");
    const data=await queryToGetMessagesFromDb(user,receiverMail)
    // console.log("line 48 executed")
    // console.log(data)
    const strigifiedData=JSON.stringify(data)
    dispatch(setMessages({
      messages:JSON.parse(strigifiedData)
    }))
    
  };

 



 const filteredArray=(msgArray!=="No Such Document"&&  msgArray.filter((each:any)=>each.receiverMail===receiverMail))
 
 
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% overflow-auto h-screen w-full">
    <div className="flex justify-between items-center px-4 py-2">
      <h1 className="text-white hover:text-red-700 hover:my-8 text-center font-serif font-extrabold relative">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Welcome to Srujan's Chatting App
      </h1>
      <button
        className="bg-transparent border-2 ml-1 border-red-950 text-white px-4 py-1 rounded-md"
        onClick={logOut}
      >
        Logout
      </button>
    </div>
    <div className="flex justify-between h-full">
  
      <div className="flex flex-col justify-start w-2/5 border-r-2 border-white">
        {msgArray === "No Such Document" ? (
          <p>No Messages are present</p>
        ) : (
          <ul className="w-full overflow-y-auto">
            {filteredArray.map((each: any, index: any) => (
              <li key={index}>
                <div className="text-white break-words font-bold hover:text-red-950 hover:px-10 bg-transparent border-2 hover:border-black rounded-lg mx-4 hover:border-dotted border-white px-2 my-1">
                  {each.text}
                </div>
                <p className="text-xs text-blue-950 ml-10">
                  sent to {each.receiverMail}
                </p>
               
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col w-3/5">
  
        {receiverMsgArray === "No Such Document" ? (
          <p>No Messages are present</p>
        ) : (
          <ul className="w-full overflow-y-auto">
            {receiverMsgArray.map((each: any, index: any) => (
              <li key={index}>
                <div className="text-white break-words font-bold hover:text-red-950 hover:px-10 bg-transparent border-2 hover:border-black rounded-lg mx-4 hover:border-dotted border-white px-2 my-1 mr-0">
                  {each.text}
                </div>
                <p className="text-xs text-blue-950 ml-10">
                  received from {each.email}
                </p>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  
    <form
      className="fixed bottom-2 w-full bg-white flex justify-center items-center"
      onSubmit={sendMessage}
    >
      <input
        className="block p-2 w-3/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Type a message"
        value={message}
        required
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="w-16 bg-indigo-600 text-white px-3 py-1.5 rounded-md ml-2"
        type="submit"
      >
        Send
      </button>
    </form>
  </div>


  );
}

export default Message;
