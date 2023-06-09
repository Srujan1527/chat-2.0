// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import Cookies from "js-cookie";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  doc, 
  
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRDSwMYBIFIyIELRx7m1OUYqPQ5euJqHM",
  authDomain: "chatting-app-1a437.firebaseapp.com",
  projectId: "chatting-app-1a437",
  storageBucket: "chatting-app-1a437.appspot.com",
  messagingSenderId: "925716544190",
  appId: "1:925716544190:web:597b9cc2e8ed5081253cef"
}
// Initialize Firebase
console.log(process.env)
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const storage = getStorage(app);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const createdAt = new Date();
    const { displayName, email, phoneNumber, profession } =
      additionalInformation;
    try {
      await setDoc(userDocRef, {
        createdAt,
        displayName,
        email,
        phoneNumber,
        profession,
      });
    } catch (e) {
      console.log("error creating the user", e.message);
    }
  }
  return userDocRef;
};

export const createUserMessageDocumentFromAuth = async (
    userAuth,
    message
  ) => {
   
    
    if (!userAuth) return;
    
   
    
    const collectionDocRef= doc(db,"messages",userAuth.email)
    const collectionDocSnapsot= await getDoc(collectionDocRef)
    // console.log(collectionDocSnapsot.exists())
    if (!collectionDocSnapsot.exists()) {
     const participants=[userAuth.email,message.receiverMail]
     const createdAt=new Date()
   
      try {
        await setDoc(collectionDocRef, {
          createdAt,
          participants
        
        });
        const userMessagesCollectionRef=collection(collectionDocRef,"usermessages")
        const userMessagesDocRef= doc(userMessagesCollectionRef,message.receiverMail)
        const userMessageSnapshot= await getDoc(userMessagesDocRef)
        if(!userMessageSnapshot.exists()){

          await setDoc(userMessagesDocRef,{messagesArray:arrayUnion( message)})
          console.log("new user Document created")
        }else{
          await updateDoc(userMessagesDocRef, {
            messagesArray: arrayUnion(message),
          });
          console.log("user document updated")
        }
    } catch (e) {
        console.log("error creating the user", e.message);
      }
    } else if (collectionDocSnapsot.exists()){
      const userMessagesCollectionRef=collection(collectionDocRef,"usermessages")
        const userMessagesDocRef= doc(userMessagesCollectionRef,message.receiverMail)
        const userMessageSnapshot= await getDoc(userMessagesDocRef)
        if(!userMessageSnapshot.exists()){

          await setDoc(userMessagesDocRef,{messagesArray:arrayUnion( message)})
          console.log("new user Document created")
        }else{
          await updateDoc(userMessagesDocRef, {
            messagesArray: arrayUnion(message),
          });
          console.log("user document updated")
        }
    }
    
    return collectionDocRef;
  };
  
  export const queryToGetMessagesFromDb=async(userAuth,receiverEmail)=>{
    if(!userAuth) return 
    const email= userAuth.email


     const collectionDocRef=doc(db,"messages",email,"usermessages",receiverEmail)
     
    // const collectionRef= collection(db,"messages")

    
    try{
      const userSnapshot= await getDoc(collectionDocRef)
     
  
      if(userSnapshot.exists()){
       
        const messageData = userSnapshot.data();
        const messages = [messageData];
          return messages
      }else{
        return "No Such Document"
      }

    }catch(err){
      console.log("Error querying messages:", error);
    return null;
    }
    
  }


  export const queryToGetReceiverMailMessagesFromDb=async(userAuth,receiverEmail)=>{
    if(!userAuth) return 
    const email= userAuth.email


     const collectionDocRef=doc(db,"messages",receiverEmail,"usermessages",email)
     
    // const collectionRef= collection(db,"messages")

    
    try{
      const userSnapshot= await getDoc(collectionDocRef)
     
  
      if(userSnapshot.exists()){
       
        const messageData = userSnapshot.data();
        const messages = [messageData];
          return messages
      }else{
        return "No Such Document"
      }

    }catch(err){
      console.log("Error querying messages:", error);
    return null;
    }
    
  }

export const getMailsFromDb=async()=>{
  try {
    const collectionRef = collection(db, "users");
    const usersSnapshot= await getDocs(collectionRef)
    let userMails=[]
    if(!usersSnapshot.empty){
      usersSnapshot.forEach((eachDoc)=>
       userMails.push(eachDoc.data().email) )
    }
    return userMails

  }catch(err){
    return err
  }
}

export const getRealTimeMessages=async(email,receiverMail,callback)=>{
    const q= query(collection(db,"messages"),where("receiverMail","==",receiverMail),orderBy("createdAt","asc"))

    const unsubscribe= onSnapshot(q,(snapshot)=>{
      const updatedMessages=snapshot.docs.map((doc)=>doc.data())
      callback(updatedMessages)
    })
    return unsubscribe
}


export const createContentDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userContentDocRef = doc(db, "users", userAuth.uid);

  const userContentSnapshot = await getDoc(userContentDocRef);

  if (!userContentSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userContentDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (e) {
      console.log("error creating the user", e.message);
    }
  }
};

export const createAuthUserEmailAndPassword = async (email, password) => {
  // guard clause
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserEmailAndPassword = async (email, password) => {
  // guard clause
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);







export const auth = getAuth(app);