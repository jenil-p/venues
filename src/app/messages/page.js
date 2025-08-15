import React from 'react'

import Navbar from '@/components/Navbar'
import { LuSendHorizontal } from "react-icons/lu";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="message_part p-20 w-full h-screen ">
        <div className="main w-full h-full rounded-2xl ">
          <p className='semibold-big-gray'>All Messages</p>
          <div className='w-full h-full pt-5 flex justify-center items-center gap-2'>
            <div className="all h-full w-1/3  overflow-y-scroll">
              <div className="ids flex justify-start border-b items-center p-5 gap-3">
                <div className="img w-12 h-12 rounded-full bg-[#898989]"></div>
                <div>
                  <p className='text-[#484848] text-lg font-semibold font-inter'>John Doe</p>
                  <p className='smaller-thin-gray'>send on 12 march 2025, 8:00AM </p>
                </div>
              </div>
            </div>
            <div className="focus h-full w-2/3 py-3 bg-[#E8EAEC] rounded-xl flex flex-col justify-between items-center">
              <div></div>
              <div className="type-message border rounded-full w-11/12 h-14 flex justify-between items-center px-1">
                <div className='px-4'>
                  <p>Type a message</p>
                </div>
                <div className='p-3 text-2xl rounded-full bg-[#484848] text-white '>
                  <LuSendHorizontal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
