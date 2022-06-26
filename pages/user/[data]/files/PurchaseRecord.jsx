import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getUser } from "../../../../utils/User";
import { getPur,deletePur } from "../../../../utils/Purchase";
import DeleteIcon from '@mui/icons-material/Delete';
import { useReactToPrint } from "react-to-print";

export async function getServerSideProps(context) {
  let data = await getUser().then((res) => { return res });
  let Pdata = await getPur().then((res) => { return res });
  return {
    props: { data, Pdata }, // will be passed to the page component as props
  }
}

function PurchaseRecord({ data, Pdata }) {

  const name = useRouter().query.data;
  const found = data.filter((com) => com.companyName === name);
  const userPurData = Pdata.filter((rec) => rec.user === found[0].companyName);
  const [userPurchase, setuserPurchase] = useState(userPurData);
  const [searchVal, setsearchVal] = useState("");
  const [monthVal, setmonthVal] = useState("");
  const [yearVal, setyearVal] = useState("");
  const [priceVal, setpriceVal] = useState(0);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let years = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  let price = [["Below 10000", 10000], ["Below 20000", 20000], ["Below 50000", 50000], ["Below 75000", 75000], ["Below 100000", 100000], ["Below 200000", 200000], ["Below 500000", 500000], ["Below 1000000", 1000000]];

  function handleReset() {
    setuserPurchase(userPurData)
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  function handleSearch() {
    setuserPurchase(userPurData.filter((val) => {
      let mon = new Date(val.billDate).getMonth();
      let yr = new Date(val.billDate).getFullYear();
      let finalSum = val.TaxAmt + val.CGST + val.SGST + val.IGST
      if (mon === Number(monthVal) && yearVal === "" && priceVal === 0) {
        return val
      } else if (monthVal === "" && yr === Number(yearVal) && priceVal === 0) {
        return val;
      } else if (monthVal === "" && yearVal === "" && Number(priceVal) > finalSum) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && priceVal === 0) {
        return val;
      } else if (mon === Number(monthVal) && yr === Number(yearVal) && Number(priceVal) > finalSum) {
        return val;
      }
    }))
  }
  
  async function handleDelete(index) {
    let confirmDel = confirm("are you sure you want to delete this record as after this you won't be able to recover this again.");

    if (confirmDel) {
      await deletePur(Pdata[index].id).then(() => {
        window.location.reload();
        console.log("successfully deleted");
      })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div>
      <div className='grid grid-rows-2 min-h-screen w-[90%] mx-auto'>
        {/* filters */}
        <div className="w-full md:w-2/3 shadow p-5 rounded-lg bg-white">
          <div className="relative">
            <div className="absolute flex items-center ml-2 h-full">
              <svg className="w-4 h-4 fill-current text-primary-gray-dark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
              </svg>
            </div>

            <input type="text" onChange={(e) => setsearchVal(e.target.value)} placeholder="Search by Party Name" className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm" />
          </div>

          <div className="flex items-center justify-evenly mt-4">
            <button onClick={handleSearch} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
              Search Filter
            </button>

            <button onClick={handlePrint} className="px-4 py-2 bg-green-400 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
              Print Record
            </button>

            <button onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
              Reset Filter
            </button>
          </div>

          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              <select onChange={(e) => setmonthVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">Month</option>
                {months.map((mon, i) => (
                  <option key={i} value={i}>{mon}</option>
                ))}
              </select>

              <select onChange={(e) => setyearVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value="">Year</option>
                {years.map((yer, i) => (
                  <option key={i} value={yer}>{yer}</option>
                ))}
              </select>

              <select onChange={(e) => setpriceVal(e.target.value)} className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
                <option value={0}>Below Price</option>
                {price.map((prc, i) => (
                  <option key={i} value={prc[1]}>{prc[0]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* filters */}
        <div ref={componentRef} className='text-center print lg:w-full'>
          <h1 className='font-bold uppercase text-2xl text-center mt-12 mb-8' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)} Purchase Record from {found[0].DateOfJoin} to today</h1>
          <div className="w-full grid" style={{ gridTemplateColumns: '10% 5% 25% 15% 10% 10% 10% 5% 10% 5%' }} >
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Bill Date</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Bill No.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Supplier Name</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Supplier GST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Taxable Amt.</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >CGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >SGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >IGST</p>
            <p style={{ border: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase' }} >Total Amount</p>
            <p style={{ border: '1px solid black' }} >Delete Record</p>
          </div>
          {userPurchase.filter((val) => {
            if (searchVal === "") {
              return val
            } else if (val.Supplier.split("-").join(" ").toLowerCase().includes(searchVal.toLowerCase())) {
              return val
            }
          }).map((pur, i) => {
            return (
              <div key={i} className="w-full grid" style={{ gridTemplateColumns: '10% 5% 25% 15% 10% 10% 10% 5% 10% 5%' }} >
                <p style={{ border: '1px solid black' }} >{pur.billDate}</p>
                <p style={{ border: '1px solid black' }} >{pur.billNo}</p>
                <p style={{ border: '1px solid black' }} >{pur.Supplier.split("-").join(" ").charAt(0).toUpperCase() + pur.Supplier.split("-").join(" ").slice(1)}</p>
                <p style={{ border: '1px solid black' }} >{pur.Suppliergst}</p>
                <p style={{ border: '1px solid black' }} >{pur.TaxAmt}</p>
                <p style={{ border: '1px solid black' }} >{pur.CGST}</p>
                <p style={{ border: '1px solid black' }} >{pur.SGST}</p>
                <p style={{ border: '1px solid black' }} >{pur.IGST}</p>
                <p style={{ border: '1px solid black' }} >{pur.TaxAmt + pur.CGST + pur.SGST + pur.IGST}</p>
                <p onClick={() => handleDelete(i)} style={{ border: '1px solid black' }} ><DeleteIcon /></p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default PurchaseRecord;