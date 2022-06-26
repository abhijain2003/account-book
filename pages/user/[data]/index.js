/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import ListExample from "../Keypress";
import PersonIcon from '@mui/icons-material/Person';
import { getUser, deleteUser } from "../../../utils/User";
import { getSales, deleteSale } from '../../../utils/Sales';
import { getPur, deletePur } from "../../../utils/Purchase";
import { getReciept, deleteReciept } from "../../../utils/Reciept";

export async function getServerSideProps(context) {
    let data = await getUser().then((res) => { return res });
    let Sdata = await getSales().then((res) => { return res });
    let Pdata = await getPur().then((res) => { return res });
    let Rdata = await getReciept().then((res) => { return res });
    return {
        props: { data, Sdata, Pdata, Rdata }, // will be passed to the page component as props
    }
}

function Main({ data, Sdata, Pdata, Rdata }) {
    const route = useRouter();
    const name = route.query.data;
    var found = data.filter((com) => com.companyName === name);
    var foundSale = Sdata.filter((com) => com.user === found[0].companyName);
    var foundPur = Pdata.filter((com) => com.user === found[0].companyName);
    var foundRecp = Rdata.filter((com) => com.user === found[0].companyName);
    const [profile, setprofile] = useState(false);



    const date = new Date();
    let year = date.getFullYear();
    let day = date.getDate();
    let month = date.getMonth();


    async function handleDelete() {
        let confirmDel = confirm("Are you sure you want to delete account. as you can't access it again in future.")
        if (confirmDel) {
            await deleteUser(found[0].id).then((res) => console.log(res)).catch((err) => console.log(err));

            foundSale.map((sale) => {
                deleteSale(sale.id).then((res) => console.log(res)).catch((err) => console.log(err));
            })

            foundPur.map((pur) => {
                deletePur(pur.id).then((res) => console.log(res)).catch((err) => console.log(err));
            })
            foundRecp.map((rec) => {
                deleteReciept(rec.id).then((res) => console.log(res)).catch((err) => console.log(err));
            })
        }
        route.push('/user/Sign')
    }

    return (
        <div className='sm:flex flex flex-col'>
            <div className='h-[100vh] w-full sm:overflow-y-hidden' >
                <div className='w-full bg-blue-400 sm:flex sm:justify-between text-white font-bold px-4 py-2' >
                    <h1>Welcome <span className='text-blue-500 bg-white p-2 rounded-[10px]' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)}</span></h1>
                    <h1 onClick={() => setprofile(curr => !curr)} ><PersonIcon /></h1>
                </div>
                <div className='grid grid-rows-2 sm:grid sm:grid-rows-1 sm:grid-cols-2'>
                    <div>
                        <div className='flex justify-between px-4'>
                            <div>
                                <p className='font-medium'>Financial Year</p>
                                <p className='font-bold text-blue-400'><span>01/04/{year}</span> to 31/03/{year + 1}</p>
                            </div>
                            <div>
                                <p className='font-medium'>Current Date</p>
                                <p className='font-bold text-blue-400'>{day + "/" + month + "/" + year}</p>
                            </div>
                        </div>
                        <hr className='mt-4 border-1 border-blue-400' />
                        <hr className='mt-4 border-1 border-blue-400' />
                        <div className='text-center'>
                            <h1 className='font-medium'>Company Name</h1>
                            {/* first letter capitalize */}
                            <h2 className='font-bold text-blue-400'>{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)}</h2>
                          
                        </div>
                    </div>
                    <div style={{ borderLeft: '1px solid black' }} className='min-h-screen flex justify-center items-center'>
                        <ListExample />
                    </div>
                </div>
            </div>
            <div className='w-[300px] flex flex-col justify-evenly h-[94%]' style={{ position: 'absolute', right: '0', bottom: '0', background: profile ? 'rgb(96 165 250)' : 'none', transition: '0.5s ease-in' }} >
                <div className='justify-between p-2' >
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} >Company Name:</h1>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} className='float-right font-bold' >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)}</h1>
                </div>
                <div className='justify-between p-2'>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} >Contact Number</h1>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} className='float-right font-bold' >{found[0].companyNumber}</h1>
                </div>
                <div className='justify-between p-2'>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} >Company email address</h1>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} className='float-right font-bold' >{found[0].companyMail}</h1>
                </div>
                <div className='justify-between p-2'>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} >Your Address</h1>
                    <h1 style={{ color: profile ? 'white' : 'transparent', transition: '0.5s ease-in' }} className='float-right font-bold' >{found[0].companyAddress}</h1>
                </div>
                <div></div>
                <div>
                    <button onClick={profile ? handleDelete : null} style={{ background: profile ? 'rgb(239 68 68)' : 'none', transition: '0.5s ease-in', color: profile ? 'white' : 'transparent' }} className='mx-auto flex p-2 rounded-[10px]' >Delete Account</button>
                    <button onClick={profile ? () => route.push('/user/Sign') : null} style={{ background: profile ? '#198754' : 'none', transition: '0.5s ease-in', color: profile ? 'white' : 'transparent' }} className='mx-auto mt-4 flex p-2 rounded-[10px]' >Sign-out</button>
                </div>
            </div>
        </div>
    )
}

export default Main