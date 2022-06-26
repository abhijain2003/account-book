import {
    addDoc,
    collection,
    getDocs,
    deleteDoc,
    doc
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  const recieptCollectionRef = collection(db, "reciept");
  
  export const addReciept = async (
    recieptNo,
    recieptDate,
    recievedFrom,
    recievedBy,
    Amount,
    user
  ) => {
    await addDoc(recieptCollectionRef, {
      recieptNo: recieptNo,
      recieptDate: recieptDate,
      recievedFrom: recievedFrom,
      recievedBy: recievedBy,
      Amount: Amount,
      user: user
    });
  };
  
  export const getReciept = async () => {
    const data = await getDocs(recieptCollectionRef);
    let recieptArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
    return recieptArr;
  }
  
  export const deleteReciept = async (id) => {
    const recieptDoc = doc(db, "reciept", id);
    await deleteDoc(recieptDoc);
  }
  
  