import React, { useState, useEffect } from "react";
import localStorage from "localStorage";
import { useSelector ,useDispatch} from "react-redux";
// import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { createUserMessageDocumentFromAuth } from "../firebase/firebase";



function Message() {
  const [message, setMessage] = useState("");
  const [arrayData, setArrayData] = useState([] as any);
  const user=useSelector((state:any)=>state.user )
  // const token=useSelector((state:any)=>state.token)
  const [arrayData, setArrayData] = useState(
    JSON.parse(localStorage.getItem("message")) || []
  );
  // const localStorageData = localStorage.setItem("mainStorage", arrayData);
  // const getLocalStorageData = [
  //   JSON.stringify(localStorage.getItem("mainStorage")),
  // ];

  const router = useRouter();
  // const [resultArray,setResultArray]=useState([])
  useEffect(() => {
    const getResultFromStorage = () => {
      const storedMessages = JSON.parse(localStorage.getItem("message")) || [];
      setArrayData(storedMessages);
    };
    getResultFromStorage();
  }, []);

  const sendMessage =async (e: any) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      createdAt: new Date(),
      email: user.user.uid,
    };
    await createUserMessageDocumentFromAuth(user,newMessage)
    console.log("message document created")
    setArrayData([...arrayData, message]);
    const localData = localStorage.setItem(
      "message",
      JSON.stringify([...arrayData, message])
    );
    setMessage("");

    // const setLocalData = localStorage.setItem(e.tostring(), e);
    // const getLocalData = JSON.stringify(localStorage.getItem(e));
    // console.log(getLocalData);
  };

  const handleDelete = () => {
    localStorage.clear();
    router.reload();
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% overflow-auto h-screen w-full">
      <div className="flex justify-center items-center">
        <h1 className="text-white hover:text-red-700 hover:my-8 text-center font-serif font-extrabold relative">
          I ALWAYS LOVE YOU POTTI
        </h1>
        <button
          className=" bg-transparent border-2 ml-1 border-red-950 text-white px-4 py-1 rounded-md "
          onClick={handleDelete}
        >
          Clear Chat
        </button>
      </div>
      <ul className="w-full">
        {arrayData.map((each: any, index: any) => (
          <li key={index}>
            <div className="text-white   break-words font-bold hover:text-red-950 hover:px-10 bg-transparent border-2 hover:border-black rounded-lg  mx-4  hover:border-dotted  border-white px-2 my-1">
              {each}
            </div>
          </li>
        ))}
      </ul>
      <form className="absolute bottom-2 w-full" onSubmit={sendMessage}>
        <input
          className="py-2 bg-pink-800  hover:bg-blue-950   border-black border-2 text-white rounded-lg px-4 w-[75%] ml-5"
          placeholder="Enter Your Text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className=" font-bold hover:bg-green-950  bg-pink-800 rounded-lg text-black px-2 py-2"
          type="submit"
        >
          send
        </button>
      </form>
    </div>
  );
}

export default Message;
