import React, { useState ,useEffect} from "react";
import { useSelector ,useDispatch} from "react-redux";
import { setLogin, setMessages, setReceiverMail,setReceiverMessages } from "../state/state";
import { queryToGetMessagesFromDb,getMailsFromDb,queryToGetReceiverMailMessagesFromDb } from "../firebase/firebase";


import { useRouter } from "next/router";
import CopyButton from "../components/CopyButton";

const Receiver = () => {
     const user= useSelector((state:any)=>state.user)
    //  const receiverEmail=useSelector((state:any)=>state.receiverMail)
     const token=useSelector((state:any)=>state.token )
  const [email, setEmail] = useState("");
  const [mailAddresses,setMailAddresses]=useState([])
  
  const router=useRouter()
  const dispatch=useDispatch()
  useEffect(()=>{
    if(!token){
      router.replace("/login")
    }
  },[])
  const letsGo = async (e:any) => {
    e.preventDefault();
    try {
      if (email==="") {
        alert("Enter the receiver's mail address")
        
      }else{
        dispatch(setReceiverMail({
            email:email
        }))
      }
        const data=await queryToGetMessagesFromDb(user,email)
        const receiverData= await queryToGetReceiverMailMessagesFromDb(user,email)
  
        const strigifiedData=JSON.stringify(data)
        const stringifiedRecieverData=JSON.stringify(receiverData)
        dispatch(setMessages({
          messages:JSON.parse(strigifiedData)
        }))
        dispatch(setReceiverMessages({
          receiverMessages:JSON.parse(stringifiedRecieverData)
        }))

        router.push("/message")
      
      //console.log(user.email);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect Email or Password ");
      } else if (error.code === "auth/user-not-found") {
        alert("Email does not exits");
      }
      console.log("user creation encountered error", error.message);
    }
  
  };
  const getMails=async()=>{
    const data= await getMailsFromDb()
    setMailAddresses(data)
  }

 
  return (
    <div data-testid="lets-go" className="min-h-screen ">
      <form onSubmit={letsGo} className="border-2 w-full  h-screen flex justify-center flex-col items-center">
        <div className="w-4/12 border-2 p-4 rounded-lg ">

        <h1 className="mt-4 mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">To Whom you want to send messages</h1>
        <div className="mb-4 ml-8">
          <label htmlFor="login-email"className="block text-sm font-medium leading-6 text-gray-900 mb-4">
           {/* eslint-disable-next-line react/no-unescaped-entities */}
            Enter the receiver's email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            id="login-email"
            required
            value={email}
            className="block  p-2 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="flex ">
          <button type="submit" className="w-20  mb-2 ml-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Lets Go{" "}
          </button>
          <button type="submit" onClick={getMails} className="w-20  mb-2 ml-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Fetch Mails
          </button>
        
        </div>
        </div>
      <div className="mt-4 border-2 p-4 w-1/2 rounded-lg flex justify-center">
      
      {mailAddresses.length===0?(<li>No Mail Addresses are found</li>):(
        <ul className="list-decimal">
          <h1 className="text-2xl mb-4 font-bold underline" > All Mail Addresses</h1>
          {mailAddresses.map((each,index)=>(
            <li key={index} className="flex"><span>{each}</span> <CopyButton text={each}/></li>
          ))}
      </ul>
      )}
      </div>
      </form>
    </div>
  );
};

export default Receiver;