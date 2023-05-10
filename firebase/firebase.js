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
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDRDSwMYBIFIyIELRx7m1OUYqPQ5euJqHM",
    authDomain: "chatting-app-1a437.firebaseapp.com",
    projectId: "chatting-app-1a437",
    storageBucket: "chatting-app-1a437.appspot.com",
    messagingSenderId: "925716544190",
    appId: "1:925716544190:web:597b9cc2e8ed5081253cef"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const storage = getStorage(app);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation
) => {
  if (!userAuth) return;
  // lets write a  pseudo code of what we need to do now
  // 1) If user doesn't exits
  // 2) create/set the document with the data from userAuth in my collection
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
    console.log(userAuth.email)
    if (!userAuth) return;
    // lets write a  pseudo code of what we need to do now
    // 1) If user doesn't exits
    // 2) create/set the document with the data from userAuth in my collection
    const userDocRef = doc(db, "messages", userAuth.uid);
  
    const userSnapshot = await getDoc(userDocRef);
  
    if (!userSnapshot.exists()) {
      const createdAt = new Date();
   
      try {
        await setDoc(userDocRef, {
          createdAt,
         messages:[message]
        });
      } catch (e) {
        console.log("error creating the user", e.message);
      }
    } else{ 
        try {
            await updateDoc(userDocRef, {
              messages: arrayUnion(message),
            });
          } catch (e) {
            console.log("error updating the user", e.message);
          }
    }
    
    return userDocRef;
  };
  
  export const queryToGetMessagesFromDb=async(userAuth)=>{
    if(!userAuth) return 
    const uid= userAuth.uid


    const docRef=doc(db,"messages",uid)
    
    try{
      const userSnapshot= await getDoc(docRef)
     
  
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

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const getDocumentFromCollection = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return "No Such Document";
  }
};

export const getAllDocumentsFromCollection = async () => {
  const collectionRef = collection(db, "users");
  const docsSnap = await getDocs(collectionRef);
  
  return docsSnap;
};

export const auth = getAuth(app);