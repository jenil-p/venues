import React from 'react'

import { IoCallOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";

const ReserveCard = () => {
  return (
    <div className='h-96 w-96 flex justify-center items-center flex-col gap-5 rounded-xl shadow-lg shadow-gray-200 px-10'>
      <div className="prise-tag w-full text-2xl font-bold text-[#484848]">
          $1000 - $2000
      </div>
      <div className="pricing flex items-start w-full justify-between flex-col">
        <p className='small-thin-gray'>Short Period: $1000</p>
        <p className='small-thin-gray'>Medium Period: $2000</p>
        <p className='small-thin-gray'>Long Period: $2000</p>
      </div>
      <div className='w-full'>
        <button className='bg-[#484848] w-full py-4 rounded-full text-white font-bold text-md font-inter'>
          Reserve Now
        </button>
      </div>
      <div className='flex justify-between items-center w-full text-[#484848]'>
        <div className='flex justify-center items-center gap-2'>
          <FaRegBuilding/>
          <p className='font-inter'>Property Inquiry</p>
        </div>
        <div className='flex justify-center items-center gap-2'>
          <IoCallOutline/>
          <p className='font-inter'>Contact Host</p>
        </div>
      </div>
    </div>
  )
}

export default ReserveCard
