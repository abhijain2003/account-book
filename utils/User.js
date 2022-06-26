import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

const userCollectionRef = collection(db, "user");

export const addUser = async (Name, number, mail, address, id, gst, date) => {
  await addDoc(userCollectionRef, {
    companyName: Name,
    companyNumber: number,
    companyMail: mail,
    companyAddress: address,
    loginId: id,
    GST: gst,
    DateOfJoin: date,
  });
};

export const getUser = async () => {
  const data = await getDocs(userCollectionRef);
  let userArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return userArr;
};

export const updateUser = async (id, newId) => {
  const userDoc = doc(db, "user", id);
  const newField = { loginId: newId };

  await updateDoc(userDoc, newField);
};

export const deleteUser = async (id) => {
  const userDoc = doc(db, "user", id);
  await deleteDoc(userDoc);
}
