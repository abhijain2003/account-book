import React from "react";
import { getUser, addUser } from "../../utils/User";
import { useState } from "react";
import { useRouter } from "next/router";
var bcrypt = require('bcryptjs');

function Sign() {
  const router = useRouter();
  //setting all values of user data
  const [Name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [number, setnumber] = useState(0);
  const [Mail, setMail] = useState("");
  const [LoginId, setLoginId] = useState("");
  const [GST, setGST] = useState("");
  const [signinId, setsigninId] = useState("");


  //handle sign-up
  async function handleUserSign() {
    let data = await getUser().then((res) => { return res });
    var found = data.filter((com) => com.companyNumber === Number(number));
    var foundId = data.filter((com) => com.loginId === LoginId);

    if (found.length === 0 && foundId.length !== 0) {
      alert("Login id should be unique try something new.")
    }

    let date = new Date();

    if (found.length === 0 && foundId.length === 0) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(LoginId, salt, function (err, hash) {
          addUser(Name, Number(number), Mail, Address, hash, GST, date.toLocaleDateString())
        });
      });
      router.push(`/user/${Name}`);
    } else {
      alert("company is already registered try to login.")
    }
  }

  //handling user login
  async function handleUserLogin() {
    let data = await getUser().then((res) => { return res });
    let foundUserId = [];
    data.map((com) => {
      bcrypt.compare(signinId, com.loginId, function (err, res) {
        if (res === true) {
          foundUserId.push(com)
        }
        if (foundUserId.length !== 0) {
          router.push(`/user/${com.companyName}`);
        } else {
          alert("invalid login id.")
        }
      });
    });
  }


  return (
    <div className="container mx-auto">
      <div className="flex justify-center px-6 my-12">
        {/* <!-- Row --> */}
        <div className="w-full xl:w-3/4 lg:w-11/12 flex">
          {/* <!-- Col --> */}
          <div
            className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
            style={{ backgroundImage: "url('https://source.unsplash.com/Mv9hjnEUHR4/600x800')" }}
          ></div>
          {/* <!-- Col --> */}
          <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
            <h3 className="pt-4 text-2xl text-center">Register Your Company</h3>
            <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
              <div className="mb-4 md:flex md:justify-between">
                <div className="mb-4 md:mr-2 md:mb-0">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="companyName"
                    type="text"
                    onChange={(e) => setName(e.target.value.toLowerCase().replace(/ /g, '-'))}
                    placeholder="Company Name"
                  />
                </div>
                <div className="md:ml-2">
                  <label className="block; mb-2 text-sm font-bold text-gray-700" htmlFor="companyNumber">
                    Company Contact Number
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="companyNumber"
                    type="text"
                    onChange={(e) => setnumber(e.target.value)}
                    placeholder="company Number"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                  Company Email
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="companyAddress">
                  Company Address
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="companyAddress"
                  type="text"
                  onChange={(e) => setAddress(e.target.value.toLowerCase().replace(/ /g, '-'))}
                  placeholder="company Address"
                />
              </div>
              <div className="mb-4 md:flex md:justify-between">
                <div className="md:ml-2">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="loginId">
                    Login Id
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="loginId"
                    type="password"
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Login Id"
                  />
                </div>
                <div className="md:ml-2">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="gst">
                    GST NUMBER
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="gst"
                    type="text"
                    onChange={(e) => setGST(e.target.value)}
                    placeholder="GST number"
                  />
                </div>
              </div>
              <div className="mb-6 text-center">
                <button
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleUserSign}
                >
                  Register Account
                </button>
              </div>
              <hr className="mb-6 border-t" />
              <div className="text-center">
                <h3 className="pt-4 text-xl text-center">Already Registered</h3>
                <div className="md:ml-2">
                  <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="loginId">
                    Enter Your Login Id
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="loginId"
                    onChange={(e) => setsigninId(e.target.value)}
                    type="password"
                    placeholder="Login Id"
                  />
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleUserLogin}
                  >
                    login
                  </button>
                  <p onClick={() => { router.push("/user/forgot") }} className="text-blue-500 underline" >forgot password?</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sign;
