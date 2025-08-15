import React from 'react'

import Navbar from '@/components/Navbar'
import { IoClose } from "react-icons/io5";

const page = () => {
    return (
        <>
            <Navbar />
            <div className="message_part p-20 w-full flex justify-center items-center h-screen ">
                <div className="main w-2/3 h-full rounded-2xl ">
                    <p className='semibold-big-gray py-4 px-4 rounded-t-2xl bg-[#E8EAEC] text-[#484848]'>All Notifications</p>
                    <div className='w-full h-full border border-[#E8EAEC] flex flex-col'>
                        <div className="notification border-b border-[#E8EAEC] py-3 px-10 flex justify-between items-center">
                            <div>
                                <p className='text-[#484848] text-lg font-semibold font-inter'>Invite Your Friends</p>
                                <p className='smaller-thin-gray'>send on 12 march 2025, 8:00AM </p>
                            </div>
                            <div className='text-xl text-[#484848]'>
                                <IoClose />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
