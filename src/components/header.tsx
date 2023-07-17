import React, { useState } from "react";
import Link from "next/link";
import Searchinput from "./searchinput";
import { useRouter } from "next/router";
import { auth } from "@/firebase/utils";
import firebase from "firebase/compat/app";
import { useGoogleAuth } from "@/firebase/utils";

const Header = ( {sendDataToParent}:any) => {
  const GoogleProvider = new firebase.auth.GoogleAuthProvider();
  GoogleProvider.setCustomParameters({ prompt: "select_account" });
  const { userId, user } = useGoogleAuth();
  // const [out,setOut]=useState(true)

 

  const handlesignOut = () => {
    location.reload()
    auth.signOut();
  };
  function setCookie(name: string, value: any, days: number) {
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + days * 24 * 60 * 60 * 1000
    );
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Example usage

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(GoogleProvider);
      
      setCookie("uid", result.user?.uid, 7);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const [receivedData, setReceivedData] = useState('');
  
  const handleDataReceived = (data:any) => {
    setReceivedData(data);
    sendDataToParent(data);
  };
  
  return (
    <>
      <div>
        <nav className="bg-blue-400 ">
          <div className="h-1 inline-flex mx-[250px] my-[50px] ">
            <Searchinput sendDataToParent={handleDataReceived} />

            <div>
              {!user ? (
                <div className="  text-black relative ">
                  <button
                    onClick={signInWithGoogle}
                    className="text-white underline underline-offset-8 font-semibold decoration-2 my-2 -mr-5 hover:no-underline "
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="  text-black relative ">
                  <button
                    onClick={handlesignOut}
                    className="text-white underline underline-offset-8 font-semibold decoration-2 my-2 -mr-5 hover:no-underline "
                  >
                    LogOut
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
