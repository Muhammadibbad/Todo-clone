import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../firebase/utils";

const Comptodo = ({ props }: any) => {
  console.log("that props", props);
  const [userTodo, setUserTodo] = useState<any>([]);
  const [progress, setProgress] = useState<any>(true);
  console.log("dish", userTodo);

  async function fetchCompTodo() {
    try {
      const response = await axios.get(`/api/fetchCompTodo`);
      const documents = response.data.Todo;
      console.log("data ====>", documents);
      setProgress(false);
      setUserTodo(documents);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  }

  const handleDelete = async (id: any) => {
    const documentRef = doc(db, "Todo", id);
    try {
      const delTodo = await deleteDoc(documentRef);
      console.log("delete", delTodo);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    fetchCompTodo();
  }, [progress]);

  return (
    <div>
      <div>
        <h1 className="flex flex-col items-center font-sans text-xl font-bold mt-10 text-[#2B5A5E]">
          COMPLETE TODO
        </h1>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center mt-[60px]">
          <div className="  text-black">
            <button className="underline underline-offset-8 font-semibold decoration-2 my-2 ml-10">
              <Link href="/newtodo">Add Todo</Link>
            </button>
          </div>
          
          <div className="  text-black">
            <button className="underline underline-offset-8 font-semibold decoration-2 my-2 ml-10">
              <Link href="/">Pending Todo</Link>
            </button>
          </div>
        </div>

        <div className="h-auto mb-[20px]  w-[50%] border border-black bg-blue-300 ml-[25%] flex flex-col items-center">
          {userTodo.map((item: any, index: any) => (
            <div
              key={item.id}
              className="h-auto w-[60%] bg-white rounded-md mt-[20px]  mb-5 "
            >
              <div className="flex flex-col items-center mt-3 ">
                <div className="font-serif font-semibold  flex space-x-5 ">
                  <div>
                    <h2>{item.todo}</h2>
                  </div>
                  <div className="flex ">
                    <div>
                      <button onClick={() => handleDelete(item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className=" cursor-pointer w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className=" font-sans ml-[20px] mr-[20px] ">
                  <p>{item.description} </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const getServerSideProps=async()=> {
//     try {
//       const response = await axios.get('/api/fetchCompTodo');
//       const documents = response.data.Todo;
//       console.log('high ====>', documents);
//       return {
//         props: {
//           documents
//         }
//       };
//     } catch (error) {
//       console.error('Error fetching documents: ', error);
//       return {
//         props: {
//           documents: null // or handle the error case accordingly
//         }
//       };
//     }
//   }

export default Comptodo;
