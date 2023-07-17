import Header from "@/components/header";
import { db, useGoogleAuth } from "@/firebase/utils";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";

interface todoType {
  todo: string;
  description: string;
  daysleft:null|number
}

const initialState: todoType = {
  todo: "",
  description: "",
  daysleft:null
};

const Newtodo = () => {
  const [adtodo, setadTodo] = useState<any>(initialState);
  const { todo, description ,daysleft} = adtodo;
  console.log("mytodo", adtodo);
  const { user, userId } = useGoogleAuth();
  const router = useRouter();

  const handleChange = (e: any) => {
    setadTodo({ ...adtodo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const dbRef = doc(collection(db, "Todo"));

    try {
      const payload = {
        userId,
        completed: false,
        ...adtodo,
        timestamp: serverTimestamp(),
      };

      const userAdded = await setDoc(dbRef, payload);

      setadTodo(initialState);

      alert("Update Successfull");
      router.push("/");
    } catch (error) {}
  };

  return (
    <div>
      <Header />

      <div>
        <h1 className="flex flex-col items-center font-sans text-xl font-bold mt-[70px] text-[#2B5A5E]">
          ADD TODO
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border border-black w-[50%] h-auto ml-[25%] mt-[50px]">
          <div className="border-b border-[#002F345B]  h-auto ">
            <div className="ml-6 mt-3 flex flex-col items-center ">
              <label htmlFor="todo" className="text-sm font-sans ">
                Todo title
              </label>{" "}
              <br />
              <input
                type="text"
                id="todo"
                name="todo"
                value={todo}
                required={true}
                maxLength={20}
                onChange={handleChange}
                className="w-[60%] h-[40px] border border-black rounded-md p-2.5 focus:outline-none  focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="ml-6 mt-3 flex flex-col items-center">
              <label htmlFor="description" className="text-sm font-sans mt-4 ">
                Description
              </label>
              <br />
              <input
                type="text"
                id="description"
                name="description"
                onChange={handleChange}
                required={true}
                minLength={10}
                maxLength={100}
                value={description}
                className="w-[60%] h-[40px] border border-black rounded-md focus:outline-none p-2.5 focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
             
            <div className="ml-6 mt-3 flex flex-col items-center">
              <label htmlFor="daysleft" className="text-sm font-sans mt-4 ">
                Days to Complete this Task
              </label>
              <br />
              <input
                type="number"
                id="daysleft"
                name="daysleft"
                onChange={handleChange}
                required={true}
                min={0}
                max={365}
               placeholder="Enter Greater than 0"
                maxLength={100}
                value={daysleft}
                className="w-[60%] h-[40px] border border-black rounded-md focus:outline-none p-2.5 focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className=" mt-6 ml-6 flex flex-col items-center ">
              <button
                type="submit"
                className=" px-10 py-3 cursor-pointer text-[15px] font-semibold text-white bg-[#002f34] rounded-md   "
              >
                POST TODO
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Newtodo;
