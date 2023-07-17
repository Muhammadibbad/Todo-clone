import firebase from "firebase/compat/app";
import { firebaseConfig } from "./config";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { ReactNode } from "react";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {useState,useEffect} from "react"
import React from "react";
import { useRouter } from "next/router";


import 'firebase/compat/storage'
import Result from "postcss/lib/result";


firebase.initializeApp(firebaseConfig);
 const app = initializeApp(firebaseConfig);

export const auth=firebase.app().auth();
export const firestore=firebase.app().firestore();
export const storage=firebase.app().storage()
 export const db = getFirestore(app);
 
 

//  const GoogleProvider=new firebase.auth.GoogleAuthProvider(); 
//  GoogleProvider.setCustomParameters({prompt:"select_account"})

// export const signInWithGoogle=async ()=>auth.signInWithPopup(GoogleProvider).then(function(result) {
//     console.log(result);
   
    
// })
// .catch(function(error){
//     console.log(error);
// });;

 





// export const handleUserProfile=async(userAuth:any)=>{
//     if(!userAuth)return;
//     const {uid}=userAuth
//     console.log(uid)
//     return uid
    // const userRef=firestore.doc(`users/${uid}`)
    // const snapshot=await userRef.get();
    // const {displayName,email,photoURL}=userAuth
    // const timestamp=new Date();

    // if(!snapshot.exists){
    //     try{
    //     await userRef.set({
    //     displayName,
    //     email,
    //     photoURL,
    //     })
    //     }catch(err){

    //     }
    // }
    // return userRef;
// }



export const useGoogleAuth = () => {
    const [userId, setUserId] = useState<any>(null);
    const [user,setUser]=useState<any>({})
    
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log({useriii: user?.uid, userId})
        if (user) {
         
          setUserId(user.uid);
          setUser(user)
          console.log("user10==>",user)
          // router.push("/")
           
        } 
        else {
          setUserId(null);
          setUser(null)
          
        }
        
      });
     
      return () => {
        
        unsubscribe();
        
      };
      
    }, []);
   
    return { userId,user };
  };
  
  