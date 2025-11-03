import React from 'react'

import { CiHeart } from "react-icons/ci";
import { IoBedOutline, IoCarOutline,IoPawOutline  } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";

const FeaturedCard = () => {
    return (
        <div className='mt-20'>
            <div className='h-[400px] w-[420px] rounded-xl bg-[#E0E2E6]'>
                <div className='w-full h-full p-4 box-border flex flex-col justify-between'>
                    <div className='wishlist flex justify-end items-center text-[#9A9A9A]'> <CiHeart className='h-10 w-auto' /> </div>
                    <div className='pricing-image flex items-center justify-between gap-3'>
                        <div className="semibold-medium-light-gray">$ 1000 - 5000 USD</div>
                        <div className="flex space-x-1">
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                            <div className="dot h-3 w-3 rounded-full bg-[#9A9A9A]"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start mt-5">
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

export default FeaturedCard
