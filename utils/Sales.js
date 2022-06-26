import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

const salesCollectionRef = collection(db, "sales");

export const addSale = async (
  CName,
  CAddress,
  company,
  clientgst,
  product,
  cgst,
  sgst,
  igst,
  ship,
  date
) => {
  await addDoc(salesCollectionRef, {
    buyer: CName,
    clientAddress: CAddress,
    CGST: cgst,
    SGST: sgst,
    IGST: igst,
    user: company,
    ClientGST: clientgst,
    product: product,
    shippingAmt: ship,
    billDate: date
  });
};

export const getSales = async () => {
  const data = await getDocs(salesCollectionRef);
  let salesArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return salesArr;
}

export const deleteSale = async (id) => {
  const saleDoc = doc(db, "sales", id);
  await deleteDoc(saleDoc);
}

