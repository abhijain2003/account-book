/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getUser } from "../../../../utils/User";
import { addSale, getSales } from "../../../../utils/Sales";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import AddIcon from "@mui/icons-material/Add";

export async function getServerSideProps(context) {
  let data = await getUser().then((res) => {
    return res;
  });
  let Sdata = await getSales().then((res) => {
    return res;
  });
  return {
    props: { data, Sdata },
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

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SalesInvoice = ({ data, Sdata }) => {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  const router = useRouter();

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
    function resizable(el, factor) {
      var int = Number(factor) || 7.7;
      function resize() {
        el.style.width = (el.value.length + 10) * int + "px";
      }
      var e = "keyup,keypress,focus,blur,change".split(",");
      for (var i in e) el.addEventListener(e[i], resize, false);
      resize();
    }
    resizable(document.getElementById("CN"), 7);
    resizable(document.getElementById("CA"), 9);
    resizable(document.getElementById("CG"), 7);

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

  let foundUser = data.filter((com) => com.companyName === router.query.data);
  let ownerName = foundUser[0].companyName.toUpperCase().replace(/-/g, " ");
  let foundSale = Sdata.filter(
    (sale) => sale.user === foundUser[0].companyName
  );

  var date = new Date();

  const [clientName, setclientName] = useState("");
  const [clientAddress, setclientAddress] = useState("");
  const [clientGST, setclientGST] = useState("");
  const [cgst, setcgst] = useState(0);
  const [igst, setigst] = useState(0);
  const [sgst, setsgst] = useState(0);
  const [ship, setship] = useState(0);
  let taxableAmt = 0;

  let userTemplate = { descrip: "", qtn: "", amt: "" };
  const [times, settimes] = useState([userTemplate]);

  function handleForm() {
    settimes((prev) => [...prev, userTemplate]);
    items.push(
      items[items.length - 3] + 3,
      items[items.length - 2] + 2,
      items[items.length - 1] + 1
    );
  }

  function handleDelete(index) {
    let copytimes = [...times];
    copytimes.splice(index, 1);
    settimes(copytimes);
    items.pop();
    items.pop();
    items.pop();
  }

  function onChange(e, index) {
    const updateUserTemplate = times.map((temp, i) =>
      i === index
        ? Object.assign(temp, { [e.target.name]: e.target.value })
        : temp
    );
    settimes(updateUserTemplate);
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  async function handleAdd() {
    await addSale(
      clientName.toLowerCase().replace(/ /g, "-"),
      clientAddress.toLowerCase().replace(/ /g, "-"),
      foundUser[0].companyName,
      clientGST,
      times,
      cgst,
      sgst,
      igst,
      ship,
      date.toDateString()
    )
      .then(() => {
        window.location.reload();
        console.log("successfully addedd");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      className="lg:grid sm:flex sm:flex-reverse-col"
      style={{ gridTemplateColumns: "90% 10%" }}
    >
      <div
        ref={componentRef}
        id="container"
        style={{ border: "1px solid black" }}
        className="sm:w-full lg:w-[50%] mx-auto bg-[#fcfbf8] min-h-screen my-16"
      >
        <div className="flex justify-between w-[90%] mx-auto mt-4">
          <p>
            INVOICE NO.{" "}
            <span className="font-bold">{foundSale.length + 1}</span>
          </p>
          <p>{date.toDateString()}</p>
        </div>
        <div>
          <h1 className="text-center text-xl font-normal">Invoice</h1>
          <h1 className="text-center text-3xl my-8 font-normal">{ownerName}</h1>
        </div>
        {/* client information */}
        <div
          className="text-[12px] relative left-[20px] w-[80%]"
          style={{ border: "2px solid #3d976a" }}
        >
          <div className="flex text-center relative left-[20px]">
            <p className="my-auto">BILLED TO: </p>
            <input
              className={`items ${cursor === 0 ? "actives" : ""}`}
              onClick={() => setSelected(0)}
              id="CN"
              placeholder="Client Name"
              onChange={(e) => setclientName(e.target.value)}
              onMouseEnter={() => setHovered(0)}
              value={clientName}
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="relative left-[20px]">
            <input
              className={`items ${cursor === 1 ? "actives" : ""}`}
              onClick={() => setSelected(1)}
              onMouseEnter={() => setHovered(1)}
              id="CA"
              onChange={(e) => setclientAddress(e.target.value)}
              placeholder="client Address"
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
          <div className="flex relative left-[20px]">
            <p className="my-auto">CLIENT GST</p>
            <input
              className={`items ${cursor === 2 ? "actives" : ""}`}
              onClick={() => setSelected(2)}
              onMouseEnter={() => setHovered(2)}
              id="CG"
              onChange={(e) => setclientGST(e.target.value)}
              placeholder="Client GST"
              onMouseLeave={() => setHovered(undefined)}
            />
          </div>
        </div>
        {/* product menu */}
        <div
          className="grid my-4 mx-auto w-[90%] mx-auto font-medium p-2 text-white bg-[#3d976a]"
          style={{ gridTemplateColumns: "67% 10% 10% 10% 3%" }}
        >
          <div>
            <label htmlFor="PD">Product Description</label>
          </div>
          <div>
            <label htmlFor="PQ">QTN</label>
          </div>
          <div>
            <label htmlFor="PP">AMT</label>
          </div>
          <div className="w-[100px]">
            <label htmlFor="ST">Sub Total</label>
          </div>
        </div>

        {/* product description */}
        {times.map((data, i) => {
          let n = 3 + i + i;
          let subT = Number(data.qtn) * Number(data.amt);
          taxableAmt += subT;
          return (
            <div
              className="grid my-4 w-[90%] mx-auto"
              style={{
                gridTemplateColumns: "60% 10% 10% 15% 5%",
                borderBottom: "1px solid black",
              }}
            >
              <div className="flex flex-col">
                <input
                  className={`items ${cursor === i + n ? "actives" : ""}`}
                  onClick={() => setSelected(i + n)}
                  id="PD"
                  name="descrip"
                  onChange={(e) => onChange(e, i)}
                  placeholder="Product Description"
                  onMouseEnter={() => setHovered(i + n)}
                  onMouseLeave={() => setHovered(undefined)}
                />
              </div>
              <div className="flex flex-col">
                <input
                  className={`items ${cursor === i + 1 + n ? "actives" : ""}`}
                  onClick={() => setSelected(i + 1 + n)}
                  onMouseEnter={() => setHovered(i + 1 + n)}
                  id="PQ"
                  name="qtn"
                  placeholder="Qtn."
                  onChange={(e) => onChange(e, i)}
                  onMouseLeave={() => setHovered(undefined)}
                />
              </div>
              <div className="flex flex-col">
                <input
                  className={`items ${cursor === i + 2 + n ? "actives" : ""}`}
                  onClick={() => setSelected(i + 2 + n)}
                  name="amt"
                  onMouseEnter={() => setHovered(i + 2 + n)}
                  id="PP"
                  placeholder="Amt."
                  onChange={(e) => onChange(e, i)}
                  onMouseLeave={() => setHovered(undefined)}
                />
              </div>
              <div className="flex flex-col">
                <p
                  id="ST"
                  style={{ border: "1px solid black" }}
                  className=" px-2 py-auto h-[35px] my-auto"
                >
                  {subT.toFixed(2)}
                </p>
              </div>
              <div
                className="my-auto cursor-pointer"
                onClick={() => handleDelete(i)}
              >
                🗑️
              </div>
            </div>
          );
        })}
        <button
          onClick={handleForm}
          className="bg-[#3d867a] font-medium px-4 py-2 rounded-[5px] relative left-[10px] text-white"
        >
          Add+
        </button>

        <div className="grid pb-4" style={{ gridTemplateColumns: "60% 40%" }}>
          {/* invoice rules */}
          <div className="p-2 w-[90%] mx-auto flex flex-col justify-between">
            <div
              className="h-[30%] flex flex-col justify-evenly text-[12px] mt-4"
              style={{ border: "1px solid black" }}
            >
              <p>1. Payment should be made as per invoice.</p>
              <p>2. No discount allowed on invoice.</p>
              <p>3. No return will be accepted after billing.</p>
            </div>

            <div className="flex justify-between">
              <h1
                className="w-[150px] text-center"
                style={{ borderTop: "1px solid black" }}
              >
                {ownerName}
              </h1>
              <h1
                className="w-[150px] text-center"
                style={{ borderTop: "1px solid black" }}
              >
                {clientName}
              </h1>
            </div>
          </div>
          {/* price section */}
          <div className="w-[80%] mx-auto">
            {/* subtotal */}
            <div className="flex justify-between bg-[#3d876a] text-white p-2">
              <p>SubTotal</p>
              <p
                id="TBT"
                style={{ border: "1px solid black" }}
                className=" px-2 py-auto h-[35px] my-auto"
              >
                ₹ {taxableAmt.toFixed(2)}
              </p>
            </div>
            {/* cgst */}
            <div className="flex justify-between mt-4 bg-[#c1ded7] p-2">
              <p>Cgst</p>
              <select
                style={{ border: "1px solid black", width: "60px" }}
                onChange={(e) =>
                  setcgst((taxableAmt / 100) * Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={0.125}>0.125%</option>
                <option value={1.5}>1.5%</option>
                <option value={2.5}>2.5%</option>
                <option value={6}>6%</option>
                <option value={9}>9%</option>
                <option value={14}>14%</option>
              </select>
              <p
                id="CGST"
                style={{ border: "1px solid black" }}
                className=" px-2 py-auto h-[35px] my-auto"
              >
                {cgst.toFixed(2)}
              </p>
            </div>
            {/* sgst */}
            <div className="flex justify-between mt-4 bg-[#c1ded7] p-2">
              <p>Sgst</p>
              <select
                style={{ border: "1px solid black", width: "60px" }}
                onChange={(e) =>
                  setsgst((taxableAmt / 100) * Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={0.125}>0.125%</option>
                <option value={1.5}>1.5%</option>
                <option value={2.5}>2.5%</option>
                <option value={6}>6%</option>
                <option value={9}>9%</option>
                <option value={14}>14%</option>
              </select>
              <p
                id="SGST"
                style={{ border: "1px solid black" }}
                className=" px-2 py-auto h-[35px] my-auto"
              >
                {sgst.toFixed(2)}
              </p>
            </div>
            {/* igst */}
            <div className="flex justify-between mt-4 bg-[#c1ded7] p-2">
              <p>Igst</p>
              <select
                style={{ border: "1px solid black", width: "60px" }}
                onChange={(e) =>
                  setigst((taxableAmt / 100) * Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
              <p
                id="IGST"
                style={{ border: "1px solid black" }}
                className=" px-2 py-auto h-[35px] my-auto"
              >
                {igst.toFixed(2)}
              </p>
            </div>
            {/* shipping charge */}
            <div className="flex justify-between mt-4 bg-[#c1ded7] p-2">
              <p>Shipping Chrg.</p>
              <input
                onChange={(e) => setship(e.target.value)}
                id="SA"
                style={{ border: "1px solid black", background: "none" }}
                placeholder="₹0.0"
                className="placeholder:text-black px-2 py-auto w-[50px] h-[35px] my-auto"
              ></input>
            </div>
            {/* total amount */}
            <div className="flex justify-between mt-4 bg-[#3d876a] text-white p-2">
              <p className="text-white">Total Amt.</p>
              <p
                id="TAT"
                style={{ border: "1px solid black" }}
                className=" px-2 py-auto h-[35px] my-auto"
              >
                {(taxableAmt + cgst + sgst + igst).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex absolute right-10 lg:top-20 justify-evenly w-[200px]">
          <button
            onClick={handlePrint}
            className="text-white bg-slate-500 p-2 rounded-[50%]"
          >
            <LocalPrintshopIcon />
          </button>
          <button
            onClick={handleAdd}
            className=" text-white bg-blue-500 p-2 rounded-[50%]"
          >
            <AddIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoice;
