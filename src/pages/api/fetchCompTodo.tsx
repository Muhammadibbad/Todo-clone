import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/utils";

export default async function handler(req: any, res: any) {
  const { userId } = req.query;
  try {
    let Todo: any = [];
    const collectionRef = collection(db, "Todo");
    const q = query(collectionRef, where("completed", "==", true));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      Todo.push(data);
    });

    res.status(200).json({ Todo });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
}
