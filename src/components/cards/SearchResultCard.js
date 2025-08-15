import React from 'react'

import { CiHeart } from "react-icons/ci";
import { IoBedOutline, IoCarOutline,IoPawOutline  } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";


const SearchResultCard = () => {
  return (
        <div className='mt-20 w-full'>
            <div className='h-[400px] w-full rounded-xl'>
                <div className='w-full h-full bg-[#E0E2E6] rounded-t-xl p-4 box-border flex flex-col justify-between'>
                    <div className='wishlist flex justify-end items-center text-[#9A9A9A]'> <CiHeart className='h-10 w-auto' /> </div>
                    <div className='pricing-image flex items-baseline justify-between gap-3'>
                        <div className="property-info flex justify-center items-center gap-2">
                            <div className="image h-20 w-20 rounded-full bg-gray-300"></div>
                            <div className="info">
                                <p className='smaller-thin-gray'>Listed By:</p>
                                <p className='small-semibold-gray'>John Doberman</p>
                                <p className='small-thin-dark'>For: $1000 - $5000</p>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                        </div>
                    </div>
                </div>
            </div>
                <div className="flex flex-col bg-white rounded-b-xl justify-center items-start pt-5">
                    <div className='small-semibold-gray'>Well Furnished Apartment</div>
                    <div className='small-thin-gray'>100 smart street, Gujarat, India.</div>
                    <div className='icons flex justify-between items-center gap-7'>
                        <div className="people font-semibold text-[#484848] text-lg flex justify-center items-center gap-0.5">
                            <IoBedOutline className='h-7 w-auto'/><span>3</span>
                        </div>
                        <div className="shower font-semibold text-[#484848] text-lg flex justify-center items-center gap-0.5">
                            <PiBathtub className='h-7 w-auto'/><span>1</span>
                        </div>
                        <div className="vehicle font-semibold text-[#484848] text-lg flex justify-center items-center gap-0.5">
                            <IoCarOutline className='h-7 w-auto'/><span>2</span>
                        </div>
                        <div className="pet font-semibold text-[#484848] text-lg flex justify-center items-center gap-0.5">
                            <IoPawOutline className='h-7 w-auto'/><span>1</span>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SearchResultCard;