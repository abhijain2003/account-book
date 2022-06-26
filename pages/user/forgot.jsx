/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
var bcrypt = require('bcryptjs');
import "react-phone-number-input/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase";
import PhoneInput from "react-phone-number-input";
import { getUser, updateUser } from "../../utils/User";

export async function getServerSideProps(context) {
  let data = await getUser().then((res) => {
    return res;
  });
  return {
    props: { data },
  };
}

function forgot({ data }) {
  const [value, setValue] = useState("");  //number
  const [otp, setotp] = useState(0);       //otp
  const [flag, setflag] = useState(false); //show otp block or not
  const [confirmation, setconfirmation] = useState({});  //confirm object response
  const [confirmOTP, setconfirmOTP] = useState(false);  //confirm otp
  const [comName, setcomName] = useState('');   //asking company name
  const [newid, setnewid] = useState(""); //asking new id
  const [showidBlock, setshowidBlock] = useState(false);

  //setting up recaptcha
  function setupRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  //getting otp
  const getOTP = async (e) => {
    e.preventDefault();
    if (value === "" || value === undefined) {
      alert("enter a valid phone number");
    }
    const res = await setupRecaptcha(value);;
    setflag(true);
    setconfirmation(res);
  };

  //verifying otp
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (otp === "" || otp === null){
      alert("otp is not valid")
      return 
    }

    await confirmation
      .confirm(otp)
      .then((result) => {
        const user = result.user;
        setconfirmOTP(true);
        console.log("user" + user);
        setshowidBlock(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let foundUser = data.filter((com) => com.companyName === comName);
  const router = useRouter();
  //updating content
  
  const handleUpdate = async(e) => {
    e.preventDefault();
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newid, salt, function(err, hash) {
        updateUser(foundUser[0].id, hash);
      });
  });
    router.push("/")
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-center px-6 my-12">
        {/* <!-- Row --> */}
        <div className="w-full xl:w-3/4 lg:w-11/12 flex">
          {/* <!-- Col --> */}
          <div
            className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
            style={{
              backgroundImage:
                "url('https://source.unsplash.com/Mv9hjnEUHR4/600x800')",
            }}
          ></div>
          {/* <!-- Col --> */}
          <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
            <h3 className="pt-4 text-2xl text-center">forgot your LoginId</h3>

            {/* sending otp */}
            <form
              style={{ display: !flag ? "block" : "none" }}
              onSubmit={getOTP}
              className="px-8 pt-6 pb-8  mb-4 bg-white rounded"
            >
              <div id="recaptcha-container"></div>
              <PhoneInput
                placeholder="Enter phone number"
                value={value}
                className="mb-4"
                defaultCountry={"IN"}
                onChange={setValue}
              />
              <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                Request OTP
              </button>
            </form>

            {/* recieving otp */}
            <form
              onSubmit={verifyOTP}
              className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
              style={{ display: flag ? "block" : "none" }}
            >
              <div className="mb-4 md:grid md:grid-cols-2">
                <div className="md:mr-2 md:mb-0">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="companyName"
                  >
                    Enter otp
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="companyName"
                    type="text"
                    name="otp"
                    onChange={(e) => setotp(Number(e.target.value))}
                    placeholder="enter otp"
                  />
                </div>
                <div className="md:ml-2">
                  <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline">
                    check otp
                  </button>
                </div>
              </div>
            </form>

{/* asking new id */}
            <form style={{display: showidBlock ? "block" : "none"}} onSubmit={handleUpdate} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
              <div className="mb-4 md:grid md:grid-cols-2">
                <div className="md:mr-2 md:mb-0">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="companyid"
                  >
                    Enter newId
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="companyid"
                    type="text"
                    onChange={(e) => setnewid(e.target.value)}
                    placeholder="new id"
                  />
                </div>
                <div className="md:mr-2 md:mb-0">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="companyName"
                  >
                    Enter company Name
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="companyName"
                    type="text"
                    onChange={(e) => setcomName(e.target.value.replace(/ /g, '-').toLowerCase())}
                    placeholder="company name"
                  />
                </div>
                <div className="md:ml-2">
                  <button
                    onClick={() => console.log("otp " + confirmOTP)}
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  >
                    update loginId
                  </button>
                </div>
              </div>
            </form>
            <hr className="mb-6 border-t" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default forgot;
