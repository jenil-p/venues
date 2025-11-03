"use client";
import React from 'react'
import { useEffect } from 'react';

import Navbar from '@/components/Navbar'
import FooterDiv from '@/components/Footer';

import { GoDotFill } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";

import FeaturedCard from '@/components/cards/FeaturedCard';

import Lenis from "lenis";

const types = ['Houses', 'Apartments', 'Villas', 'Farm Houses'];

const page = () => {
    useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
    return (
        <>
            <Navbar />
            <div className="menu text-[#484848] w-full px-20 mt-32 h-20 z-50 flex justify-between items-center">
                <div className='options flex justify-center items-center gap-4'>
                    {types.map((type, index) => {
                        return (<div key={index} className='flex justify-center items-center gap-4'>
                            <div className='small-semibold-gray'>{type}</div>
                            <GoDotFill className=' text-[#C2C6CC] ' />
                        </div>)
                    })}
                    <div className='small-semibold-gray'>More</div>
                </div>
                <div className='px-7 py-2 border-2 border-[#C2C6CC] text-[#484848] rounded-full flex justify-center items-center gap-2'>
                    <div> <VscSettings /> </div>
                    <div> Filters </div>
                </div>
            </div>
            <div className="cards w-full px-20 flex justify-between items-center flex-wrap mb-20">
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
                <FeaturedCard />
            </div>

            <FooterDiv />
        </>
    )
}

export default page
