"use client"

import React, { useEffect } from 'react'

import { FaCheck, FaStar } from "react-icons/fa6";

import Navbar from '@/components/Navbar';

import Lenis from 'lenis';

const page = ({ params }) => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return (
    <div className='n'>
      <Navbar />
      <div className="account flex items-center justify-center w-full h-full px-20 mt-32">


        <div className='w-4/5 flex justify-start items-start'>

          <div className="side p-10 flex flex-col h-full justify-center items-center bg-[#EFF0F2] space-y-12 rounded-2xl">

            <div className='flex justify-center items-center flex-col'>
              <div className="photo w-40 h-40 rounded-full bg-[#484848]"></div>
              <p>Upoad A photo</p>
            </div>

            <div className='w-64'>
              <p className='small-semibold-gray'>Identity Verification</p>
              <p className='smaller-thin-gray overflow-y-scroll'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, lorem8000 similique!</p>
            </div>

            <div className="identityList flex justify-center items-start w-full flex-col">
              <p className='small-thin-dark flex justify-center items-center gap-2'> <FaCheck /> Email</p>
              <p className='small-thin-dark flex justify-center items-center gap-2'> <FaCheck /> Phone</p>
            </div>

          </div>

          <div className='w-2/3 rounded-xl p-10'>
            <h1 className='semibold-big-gray'>Hello, John Doe</h1>
            <p className='smaller-thin-gray'>Joined in 2025</p>
            <div className="edit my-10 text-[#484848]">
                <p>About</p>
                <div className='h-32 w-full border border-[#9A9A9A] rounded-xl mb-5'></div>
                <p>Location</p>
                <div className='h-10 w-full border border-[#9A9A9A] rounded-xl mb-5'></div>
                <p>Work</p>
                <div className='h-10 w-full border border-[#9A9A9A] rounded-xl mb-5'></div>
            </div>
            <div className='flex items-center justify-end'>
                <div className='buttons flex justify-center items-center gap-2'>
                    <button className='rounded-full border border-[#9a9a9a] w-20 h-10'>Cancel</button>
                    <button className='bg-[#EFF0F2] hover:bg-[#9A9A9A] rounded-full w-20 h-10'>Save</button>
                </div>            
            </div>
          </div>


        </div>

      </div>
    </div>
  )
}

export default page