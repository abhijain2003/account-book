/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getUser } from "../../../../utils/User";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import AddIcon from "@mui/icons-material/Add";
import numWords from "num-words";
import { getReciept, addReciept } from "../../../../utils/Reciept";

export async function getServerSideProps(context) {
  let data = await getUser().then((res) => {
    return res;
  });
  let Rdata = await getReciept().then((res) => {
    return res;
  });
  return {
    props: { data, Rdata },
  };
}

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

const items = [1, 2, 3];

const ReciptInvoice = ({ data, Rdata }) => {
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

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        router.back();
      }
    });

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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const router = useRouter();
  let foundUser = data.filter((com) => com.companyName === router.query.data);
  let ownerName = foundUser[0].companyName.toUpperCase().replace(/-/g, " ");
  var date = new Date();
  let foundReciept = Rdata.filter((rec) => rec.user === foundUser[0].companyName);

  const [Amount, setAmount] = useState(0);
  const [recievedFrom, setrecievedFrom] = useState("");
  const [recievedBy, setrecievedBy] = useState("");
  const recieptNo = foundReciept.length + 1;
  const recieptDate = date.toLocaleDateString();

  async function handleAdd() {
    await addReciept(recieptNo, recieptDate, recievedFrom.toLowerCase().replace(/ /g, "-"), recievedBy.toLowerCase().replace(/ /g, "-"), Amount, foundUser[0].companyName).then(() => {
      window.location.reload();
      console.log("successfully added");
    })
      .catch((err) => console.log(err));
  }

  return (
    <div className="lg:grid sm:flex sm:flex-col h-[100vh] parentReciept" style={{ gridTemplateColumns: "20%  60% 20%" }}>
      <div></div>

      <div
        id="container" ref={componentRef} style={{ border: "1px solid black", gridTemplateRows: '20% 60% 20%' }} className="p-2 reciept grid sm:w-full mx-auto h-[60%] my-auto">
        {/* main head */}
        <div className="flex justify-between w-[95%] mx-auto">
          <h1 className="uppercase font-bold text-xl text-[navy]" >Payment Receipt</h1>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p className="uppercase" style={{ borderBottom: '1px solid black' }} >reciept no.</p>
              <p className="font-bold" style={{ borderBottom: '1px solid black' }} >{foundReciept.length + 1}</p>
            </div>
            <div className="flex justify-between">
              <p className="uppercase" style={{ borderBottom: '1px solid black' }} >date:</p>
              <p className="font-bold" style={{ borderBottom: '1px solid black' }} >{recieptDate}</p>
            </div>
          </div>
        </div>

        {/* reciept details */}
        <div className="flex flex-col h-full">
          <input
            style={{ borderBottom: '1px solid navy', width: '95%' }}
            placeholder={"Recieved from"}
            className={`items ${cursor === 0 ? "actives" : ""}  mx-auto`}
            onClick={() => setSelected(0)}
            onMouseEnter={() => setHovered(0)}
            onChange={(e) => setrecievedFrom(e.target.value)}
            onMouseLeave={() => setHovered(undefined)}
          />
          <div className="grid h-[60%] w-[95%] mx-auto" style={{ gridTemplateColumns: '80% 20%' }}>
            {/* amount in nomenclature */}
            <div className="flex flex-col justify-evenly">
              <p style={{ borderBottom: '1px solid navy', width: '95%' }}
                className="h-[30px]"
                placeholder={"Amount in letters"}>{
                  "Rs. " + numWords(Amount) + " Only"
                }</p>
              <input
                style={{ borderBottom: '1px solid navy', width: '95%' }}
                placeholder={"Recieved By"}
                className={`items ${cursor === 2 ? "actives" : ""}  mx-auto`}
                onClick={() => setSelected(2)}
                onChange={(e) => setrecievedBy(e.target.value)}
                onMouseEnter={() => setHovered(2)}
                onMouseLeave={() => setHovered(undefined)}
              />
            </div>
            {/* amount in numbers and signature */}
            <div className="grid" style={{ gridTemplateRows: '45% 10% 45%' }}>
              <div style={{ border: '1px solid navy', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="bg-blue-200 h-full">
                <input
                  style={{ width: '95%' }}
                  placeholder={"$200"}
                  className={`items ${cursor === 1 ? "actives" : ""}  mx-auto bg-blue-200`}
                  onClick={() => setSelected(1)}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(undefined)}
                />
              </div>
              <div></div>
              <div style={{ border: '1px solid navy', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >Sign</div>
            </div>

          </div>
        </div>

        {/* company details */}
        <div className="text-center font-bold w-full bg-blue-500 text-white">
          <h1>{ownerName}</h1>
          <h1 className="uppercase" >{foundUser[0].companyAddress}</h1>
        </div>
      </div>

      <div className="flex justify-between w-[80%] mx-auto">
        <button
          onClick={handlePrint}
          className="h-[50px] w-[50px] text-white bg-slate-500 p-2 rounded-[50%]"
        >
          <LocalPrintshopIcon />
        </button>
        <button
          onClick={handleAdd}
          className="h-[50px] w-[50px] text-white bg-slate-500 p-2 rounded-[50%]"
        >
          <AddIcon />
        </button>
      </div>
    </div>
  );
};

export default ReciptInvoice;

