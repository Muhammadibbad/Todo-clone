import { useGoogleAuth } from "@/firebase/utils";
import axios from "axios";
import Header from "@/components/header";
import {
  Timestamp,
  deleteDoc,
  doc,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../firebase/utils";
import Loader from "./Loader";

const Altodo = () => {
  const { userId, user } = useGoogleAuth();
  const [userTodo, setUserTodo] = useState<any>([]);
  const [progress, setProgress] = useState<any>(true);
  const [delStatus, setdelStatus] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(true);
  //  const [updateTodo,setUpdateTodo]=useState(false)
  const [deadTodo, setDeadTodo] = useState<number[]>([]);
  const [receivedData, setReceivedData] = useState("");
 
  const [checkZero,setCheckZero]=useState<number|null>(null)
  const timezone: any = [];
  
  console.log("userTodo",userTodo)

  const handleDataReceived = (data: any) => {
    setReceivedData(data);
  };

  async function fetchTodo() {
    console.log("this is fetch")
    try {
      // Simulating data fetching delay
         await new Promise((resolve) => setTimeout(resolve, 2000));
   
      const response = await axios.get(`/api/fetchTodo?id=${user.uid}`);

      const documents = response.data.Todo;
      
      setProgress(false);
      setUserTodo(documents);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }

   
  }

  const sortQuery = () => {
    if (!receivedData) {
      fetchTodo();
    } else {
      const lowercaseString = receivedData.toLowerCase();

      const filteredTodo = userTodo.filter((item: any, index: any) => {
        return item.todo.toLowerCase().includes(lowercaseString);
      });

      setUserTodo(filteredTodo);
    }
  };

  const handleDaysLeft = () => {
    console.log("Days Left is running")
    const deadline: number[] = [];
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB");
    const day = formattedDate.split("/")[0];
    timezone.map((item: number) => {
      let dateline: number = item - Number(day);
      deadline.push(dateline);
    });
    const zeroDays=deadline.filter((item)=> item===0).length
    console.log("push",deadline)
    console.log("push zero",zeroDays)
    setCheckZero(zeroDays)
    setDeadTodo(deadline);
      
  };

  const convertTime = async() => {
    console.log("convert time is running",userTodo)
    console.log("convert time is running")
      userTodo.map((item: any, index: any) => {
      const seconds = item.timestamp.seconds;
      const nanoseconds = item.timestamp.nanoseconds;
      
      const firestoreTimestamp = new Timestamp(seconds, nanoseconds);
      const date = firestoreTimestamp.toDate();
      console.log("this", date);
      const datezone = new Date(date);

      const dayOfMonth = datezone.getDate();
      const totalDays = Number(dayOfMonth) + Number(item.daysleft);

      timezone.push(totalDays);
    });
  };

  const handleDelete = async (id: any) => {
    const documentRef = doc(db, "Todo", id);
    try {
      const delTodo = await deleteDoc(documentRef);
      console.log("delete", delTodo);
        const data = await fetchTodo();
      // setdelStatus(true);
       console.log({ data });
      alert("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleTodos = async (id: any) => {
    const docRef = doc(db, "Todo", id);
    const data = {
      completed: true,
    };
    try {
      const updatedDocRef = await updateDoc(docRef, data);
      setdelStatus(true);
      
       alert("Your Task is completed");
      console.log(
        "A New Document Field has been added to an existing document"
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodo();
     
  }, [user, delStatus, progress]);

  useEffect(() => {
  
    convertTime();
      handleDaysLeft();
    
    
  }, [userTodo,checkZero]);

 
  useEffect(() => {
    sortQuery();
    
    console.log("fetch effect is run");
  }, [receivedData, progress]);

  return (
    <div>
      <Header sendDataToParent={handleDataReceived} />
      <div>
        <div>
        <h1 className="flex flex-col items-center font-sans text-xl font-bold mt-10 text-[#2B5A5E]">
          All TODO
        </h1>
        </div>
        {user &&
         <div>
          
         <h1 className="flex flex-col items-center font-sans text-xl font-bold mt-10 text-red-500">
         {checkZero} Task have Deadline Today
         </h1>
         </div>
        }
       
        
      </div>

      <div className="space-y-4">
        {user && (
          <div className="flex justify-center mt-[60px] mb-5">
            <div className=" mt-6 ml-6 flex flex-col items-center ">
              <button className=" px-10 py-3 cursor-pointer text-[15px] font-semibold text-white bg-[#002f34] rounded-md   ">
               <a href={"/newtodo"}> ADD TODO</a>
              </button>
            </div>
            <div className=" mt-6 ml-5 flex flex-col items-center ">
              <button className=" px-9 py-3 cursor-pointer text-[15px] font-semibold text-white bg-[#002f34] rounded-md   ">
              <Link href={"/comptodo"}> COMPLETE TODO</Link>
              </button>
            </div>
            
          </div>
        )}

        {isLoading ? (
          !user ? (
            <div className="flex flex-col items-center ">
              <h2 className="mt-[100px] text-[20px] font-serif font-semibold">
                Please Login First
              </h2>
            </div>
          ) : (
            <Loader />
          )
        ) : (
          // <Loader/>
          <div className="h-auto w-[50%] border border-black bg-blue-300 ml-[25%] flex flex-col items-center">
            {userTodo.map((item: any, index: any) => (
              <div
                key={item.id}
                className="h-auto w-[60%] bg-white rounded-md mt-[30px] mb-5  "
              >
                <div className=" mt-3  mb-5 ">
                  <div className="font-serif font-semibold  flex space-x-5 ">
                    <div className="flex space-x-2 ml-3">
                    <div onClick={() => handleTodos(item.id)} className=" flex flex-col items-center justify-center border border-black h-[10px] mt-2 w-[10px]"> 
                      
                      
                      <div><input type="checkbox" className="bg-blue-500 "  /> </div>
                  
                       
                     </div>
                     <div> <h2>{item.todo}</h2></div>
                    

                    </div>
                    <div className="flex   !ml-auto">
                      <div className="">
                        <button onClick={() => handleDelete(item.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="  cursor-pointer w-6 h-6 hover:stroke-red-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      {/* <div className="">
                        <button onClick={() => handleTodos(item.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className=" ml-[10px] w-6 h-6 hover:stroke-red-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </button>
                      </div> */}
                    </div>
                  </div>
                  <div className="flex">
                    <div className=" font-sans ml-[10px] mr-[20px] ">
                      <p>{item.description} </p>
                    </div>
                    <div className=" font-sans ml-auto  ">
                      {deadTodo[index]===0 ? (<h2>Today</h2>) : <h2>{deadTodo[index]} days left</h2>}
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Altodo;
