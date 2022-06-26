/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { storage } from "../../../../utils/firebase";
import { addPur } from "../../../../utils/Purchase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useRouter } from "next/router";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PurchaseInvoice = ({ data, Sdata }) => {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor((prevState) =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (items.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (items.length && enterPress) {
      setSelected(items[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);

  useEffect(() => {
    document
      .getElementById("container")
      .querySelectorAll("input")
      .forEach((node) => {
        window.addEventListener(
          "keydown",
          function (e) {
            if (e.key === "Enter") {
              document
                .getElementById("container")
                .querySelector(".actives")
                .focus();
            }
          },
          true
        );
      });
  }, []);

  const imageListRef = ref(storage, "images/");
  const [image, setimage] = useState(null);
  const [imageArr, setimageArr] = useState([]);

  const [billDate, setbillDate] = useState("");
  const [billNo, setbillNo] = useState("");
  const [partyName, setpartyName] = useState("");
  const [partygst, setpartygst] = useState("");
  const [taxAmt, settaxAmt] = useState(0);
  const [cgst, setcgst] = useState(0);
  const [sgst, setsgst] = useState(0);
  const [igst, setigst] = useState(0);
  const [shipChg, setshipChg] = useState(0);
  const route = useRouter().query.data;

  function uploadImage1() {
    if (image === null) return;
    const imageRef = ref(storage, `images/${image.name}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      alert("added Successfully");
      getDownloadURL(snapshot.ref).then((url) => {
        setimageArr((prev) => [...prev, url]);
      });
    });
  }

  function deleteImage1() {
    if (image === null) return;
    const deleteRef = ref(storage, `images/${image.name}`);
    deleteObject(deleteRef)
      .then(() => {
        console.log("successfully deleted");
      })
      .catch((err) => console.log(err));
  }

  async function handleAdd() {
    await addPur(
      billNo,
      billDate,
      partyName.toLowerCase().replace(/ /g, '-'),
      partygst,
      taxAmt,
      cgst,
      sgst,
      igst,
      shipChg,
      route
    )
      .then(() => {
        window.location.reload();
        console.log("successfully Added");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      id="container"
      className="lg:h-[100vh] min-h-screen lg:overflow-hidden w-full"
    >
      <div className="flex justify-between w-[90%] mx-auto mt-12">
        <h1 className="text-2xl font-bold uppercase text-[#000080]">
          Purchase Entry
        </h1>
        <div className="mb-2 md:mb-1 md:flex items-center">
          <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
            Add Entry
          </label>
          <span className="mr-4 inline-block hidden md:block">:</span>
          <div className="flex-1">
            <button
              onClick={handleAdd}
              className=" text-white bg-slate-400 p-2 rounded-[50%]"
            >
              <AddIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="md:flex justify-between w-[90%] mx-auto mt-12">
        <div>
          <div className="mb-2 md:mb-1 md:flex items-center">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Invoice No.
            </label>
            <span className="mr-4 inline-block hidden md:block">:</span>
            <div className="flex-1">
              <input
                className={`items ${cursor === 0 ? "actives" : ""
                  }  bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500`}
                onClick={() => setSelected(0)}
                onMouseEnter={() => setHovered(0)}
                onMouseLeave={() => setHovered(undefined)}
                onChange={(e) => setbillNo(e.target.value)}
                type="text"
                placeholder="eg. #INV-100001"
              />
            </div>
          </div>

          <div className="mb-2 md:mb-1 md:flex items-center">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Invoice Date
            </label>
            <span className="mr-4 inline-block hidden md:block">:</span>
            <div className="flex-1">
              <input
                type="text"
                className={`items ${cursor === 1 ? "actives" : ""
                  }  bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker`}
                onClick={() => setSelected(1)}
                onMouseEnter={() => setHovered(1)}
                onMouseLeave={() => setHovered(undefined)}
                onChange={(e) => setbillDate(e.target.value)}
                placeholder="eg. 17 Feb, 2020"
              />
            </div>
          </div>
        </div>
        <div className="md:flex">
          <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
            Upload Bill Photo
          </label>
          <div className="flex">
            <div className="w-32 h-20 mb-1 border rounded-md border-dotted bg-gray-100 items-center flex justify-center">
              <label htmlFor="imageUpload" className="btn btn-large">
                <AddIcon />
              </label>
              <input
                name="photo"
                id="imageUpload"
                type="file"
                className="overflow-hidden"
                style={{ display: "none" }}
                onChange={(e) => setimage(e.target.files[0])}
              />
            </div>
            <div className="flex flex-col justify-between ml-4">
              <button
                className="w-32 h-10 mb-1 border rounded-md bg-gray-200"
                onClick={uploadImage1}
              >
                Add
              </button>
              <button
                className="w-32 h-10 mb-1 border rounded-md bg-gray-200"
                onClick={deleteImage1}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="lg:grid w-[90%] mx-auto mt-24"
        style={{ gridTemplateColumns: "50% 25% 25%" }}
      >
        <div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Supplier Name:
            </label>
            <input
              className={`items ${cursor === 2 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(2)}
              onMouseEnter={() => setHovered(2)}
              onChange={(e) => setpartyName(e.target.value)}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Taxable Amt:
            </label>
            <input
              className={`items ${cursor === 3 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(3)}
              onMouseEnter={() => setHovered(3)}
              onChange={(e) => settaxAmt(Number(e.target.value))}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Supplier GST:
            </label>
            <input
              className={`items ${cursor === 4 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(4)}
              onMouseEnter={() => setHovered(4)}
              onChange={(e) => setpartygst(e.target.value)}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
        </div>

        <div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              CGST:
            </label>
            <input
              className={`items ${cursor === 5 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(5)}
              onMouseEnter={() => setHovered(5)}
              onChange={(e) => setcgst(Number(e.target.value))}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              SGST:
            </label>
            <input
              className={`items ${cursor === 6 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(6)}
              onMouseEnter={() => setHovered(6)}
              onChange={(e) => setsgst(Number(e.target.value))}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              IGST:
            </label>
            <input
              className={`items ${cursor === 7 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(7)}
              onChange={(e) => setigst(Number(e.target.value))}
              onMouseEnter={() => setHovered(7)}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
        </div>

        <div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Shipping Chrg:
            </label>
            <input
              className={`items ${cursor === 8 ? "actives" : ""
                } bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto`}
              onClick={() => setSelected(8)}
              onMouseEnter={() => setHovered(8)}
              onChange={(e) => setshipChg(Number(e.target.value))}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="h-24">
            <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
              Total Amt:
            </label>
            <p className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-[90%] mx-auto">
              {taxAmt + cgst + sgst + igst + shipChg}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoice;
