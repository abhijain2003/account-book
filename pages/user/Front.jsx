import React from 'react'
import Link from 'next/link'
import ListExample from "./Keypress";

function Front() {

    const date = new Date();
    let year = date.getFullYear();
    let day = date.getDate();
    let month = date.getMonth();

    return (
        <div className='h-[100vh] overflow-y-hidden' >
            <div className='w-full bg-blue-400 flex justify-between text-white font-bold px-4 py-2' >
                <h1 className='text-xl py-auto' >Welcome user</h1>
                <Link href={"/user/Sign"}><p className='bg-white text-blue-500 p-2 rounded-[10px]' >Sign-in</p></Link>
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
                        <h2 className='font-bold text-blue-400'>User.com</h2>
                    </div>;
                </div>
                <div style={{ borderLeft: '1px solid black' }} className='min-h-screen flex justify-center items-center'>
                    <ListExample />
                </div>
            </div>
        </div>
    )
}

export default Front