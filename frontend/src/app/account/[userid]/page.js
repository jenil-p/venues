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


        <div className='w-2/3 flex justify-start items-start'>

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
                <h1 className='semibold-big-gray mb-10'>John Doe</h1>
              <p className='small-thin-dark flex justify-center items-center gap-2'> <FaCheck /> Email</p>
              <p className='small-thin-dark flex justify-center items-center gap-2'> <FaCheck /> Phone</p>
            </div>

          </div>

          <div className='w-2/3 rounded-xl p-10'>
            <h1 className='semibold-big-gray'>Hello, John Doe</h1>
            <p className='smaller-thin-gray'>Joined in 2025</p>
            <div className="show-all my-7">
              <button className='border rounded-md text-[#484848] flex justify-center items-center h-12 w-48'>
                <a href="/account/JenilPatel/edit">Edit Profile</a>
                
              </button>
            </div>
            <div className='semibold-big-gray mb-7 flex justify-start items-center gap-2'>
              <FaStar />
              <p>0 Reviews</p>
            </div>
            <div className='bg-[#9A9A9A] h-px w-3/4 my-2 text-center'></div>
            
          </div>


        </div>

      </div>
    </div>
  )
}

export default page


