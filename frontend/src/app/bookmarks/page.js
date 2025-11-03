"use client"

import React, { useState } from 'react'

import Navbar from '@/components/Navbar';
import RatingCard from '@/components/cards/RatingCard';


const page = () => {
    const [isPast, setisPast] = useState(false)
    return (
        <>
            <Navbar />
            <div className="message_part p-20 pt-36 w-full flex justify-center items-center h-screen ">
                <div className="main w-full h-full rounded-2xl ">
                    {/* <p className='bold-x-big-gray mb-12'>Bookmarks</p> */}
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>Bookmarks</p>
                        <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-2'></div>
                    </div>

                    <div className='w-full flex justify-start items-center gap-3 flex-wrap py-10'>
                        <RatingCard />
                        <RatingCard />
                        <RatingCard />
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
