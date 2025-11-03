"use client"

import React, { useState } from 'react'

import Navbar from '@/components/Navbar';


const page = () => {
    const [isPast, setisPast] = useState(false)
    return (
        <>
            <Navbar />
            <div className="message_part relative p-20 pt-36 w-full flex justify-center items-center h-screen min-h-screen ">
                <div className="main w-full h-full rounded-2xl ">
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>What type of Venue You will Host ?</p>
                    </div>

                    <div className='w-full flex justify-start items-center gap-5 flex-wrap py-10'>
                        <div className="type-card flex justify-center items-center rounded-xl w-52 h-20">
                            <div className="pic bg-[#9A9A9A] w-20 h-full rounded-l-xl"></div>
                            <div className='w-32 h-full border rounded-r-xl border-l-0 border-r-[#9A9A9A] border-b-[#9A9A9A] border-t-[#9A9A9A]'></div>
                        </div>
                        <div className="type-card flex justify-center items-center rounded-xl w-52 h-20">
                            <div className="pic bg-[#9A9A9A] w-20 h-full rounded-l-xl"></div>
                            <div className='w-32 h-full border rounded-r-xl border-l-0 border-r-[#9A9A9A] border-b-[#9A9A9A] border-t-[#9A9A9A]'></div>
                        </div>
                        <div className="type-card flex justify-center items-center rounded-xl w-52 h-20">
                            <div className="pic bg-[#9A9A9A] w-20 h-full rounded-l-xl"></div>
                            <div className='w-32 h-full border rounded-r-xl border-l-0 border-r-[#9A9A9A] border-b-[#9A9A9A] border-t-[#9A9A9A]'></div>
                        </div>
                    </div>
                </div>
                <button className='text-white absolute left-20 bottom-20 font-semibold py-2 px-4 rounded-full bg-[#9A9A9A]'>Next</button>
            </div>
        </>
    )
}

export default page
