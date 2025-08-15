"use client"
import React from 'react'
import { useEffect } from 'react';

import Navbar from '@/components/Navbar'
import SearchResultCard from '@/components/cards/SearchResultCard';

import { VscSettings } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";

import Lenis from "lenis";

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
      <div className="w-full flex">
        <div className="w-1/2 results-filters mt-32 px-20">
          <div className="found semibold-big-gray">
            10 Results found
          </div>
          <div className="flex justify-between items-baseline">
            <div className="filters flex justify-center items-center gap-1">
              <span className='bg-[#E0E2E6] px-3 py-1 rounded-full flex justify-center items-center gap-2'>
                <p className='x-smaller-thin-dark font-extralight'>100 smart street</p>
                <span className='text-lg text-[#484848]'> <IoClose /> </span>
              </span>
              <span className='bg-[#E0E2E6] px-3 py-1 rounded-full flex justify-center items-center gap-2'>
                <p className='x-smaller-thin-dark'>10 septempber</p>
                <span className='text-lg text-[#484848]'> <IoClose /> </span>
              </span>
              <span className='bg-[#E0E2E6] px-3 py-1 rounded-full flex justify-center items-center gap-2'>
                <p className='x-smaller-thin-dark'>Short term</p>
                <span className='text-lg text-[#484848]'> <IoClose /> </span>
              </span>
            </div>
            <div className="filter-btn">
              <div className='filters px-7 py-2 border-2 border-[#C2C6CC] text-[#484848] rounded-full flex justify-center items-center gap-2'>
                <div> <VscSettings /> </div>
                <div> Filters </div>
              </div>
            </div>
          </div>
          <div className="results flex flex-col justify-center items-center gap-10 mb-40">
            <SearchResultCard/>
            <SearchResultCard/>
            <SearchResultCard/>
            <SearchResultCard/>
            <SearchResultCard/>
            <SearchResultCard/>
            <button className='small-thin-dark hover:underline cursor-pointer mt-20'>
              See All 10 results
            </button>
          </div>
        </div>
        <div className='w-1/2 h-[500px] fixed right-0 overflow-y-scroll bg-gray-400 rounded-2xl results-filters mt-32 px-20'>
          <div className='font-extrabold text-9xl text-gray-300 flex justify-center items-center h-full'>
            Map
          </div>
        </div>
      </div>
    </>
  )
}

export default page
