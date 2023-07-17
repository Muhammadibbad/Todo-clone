import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/utils";
import { useGoogleAuth } from "@/firebase/utils";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const {id} = req.query
  const cookies = req.cookies.uid;
  console.log("cookie id",cookies)
  console.log("query id",req.query)
  // if( cookies === id) {
     try {
      
      if( cookies  === id) { 
        
        console.log("try")

        let Todo: any = [];
        const collectionRef = collection(db, "Todo");
   
        const q = query(
          collectionRef,
          where("userId", "==", id),
          where("completed", "==", false)
        );
        const querySnapshot = await getDocs(q);
       
        const users = querySnapshot.docs.map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          Todo.push(data);
        });
   
        res.status(200).json({ Todo });
      }
        
       
      
      
      
      
      

   } catch (error) {
     console.error("Error fetching documents: ", error);
     res.status(500).json({ error: "Error fetching documents" });
   }

  // }
  // else{
  //   // res.status(403).json({ error: 'Forbidden' });
  //   console.log("catch")
  // }
  
}
