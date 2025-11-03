"use client"

import React, { useState } from 'react'

import Navbar from '@/components/Navbar';

const page = () => {
    const [isPast, setisPast] = useState(false)
    return (
        <>
            <Navbar />
            <div className="message_part relative p-20 pt-36 w-full flex justify-center items-center h-screen ">
                <div className="main w-full h-full rounded-2xl ">
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>Add a Short Descripsion Of your Venue</p>
                    </div>

                    <div className='w-full flex justify-start items-center gap-5 flex-wrap py-10'>
                        Description field...
                    </div>
                </div>
            </div>
            <button className='text-white absolute left-20 bottom-20 font-semibold py-2 px-4 rounded-full bg-[#9A9A9A]'>Next</button>
        </>
    )
}

export default page
