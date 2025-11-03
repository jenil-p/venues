"use client";

import React from 'react'

import { IoSearch } from "react-icons/io5";

const Hero = () => {

  return (
    <>
      <div className='h-screen flex justify-center' data-section>
        <img src="home.jpeg" alt="bg" className='w-full h-auto' />
        <div className='text-[#484848] rounded-2xl z-10 absolute bottom-32 space-y-3'>
          <div className="type flex items-center gap-5 Navbar-font">
            <div className='text-3xl font-bold font-stretch-expanded'>FIND</div>
            <div className='font-semibold'>Hotel</div>
            <div className='font-semibold'>Banquet Hall</div>
            <div className='font-semibold'>Party Plot</div>
            <div className='font-semibold'>Villa</div>
            <div className='font-semibold'>Resort</div>
            <div className='font-semibold'>All</div>
          </div>
          <div className="filter backdrop-blur-2xl w-full rounded-full flex justify-center items-center gap-2 p-4 shadow-md">
            <div className="location px-4 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-500">Location</p>
              <p className="text-sm text-gray-400">Which city or area?</p>
            </div>
            <div className="event-type px-4 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-500">Event Type</p>
              <p className="text-sm text-gray-400">Wedding, Seminar, Party...</p>
            </div>
            <div className="date px-4 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-500">Event Date</p>
              <p className="text-sm text-gray-400">Select a date</p>
            </div>
            <div className="people px-4">
              <p className="text-xs font-semibold text-gray-500">Guests</p>
              <p className="text-sm text-gray-400">No. of attendees</p>
            </div>
            <button className="bg-[#484848] text-white rounded-full p-3 ml-2">
              <a href="/search"><IoSearch/></a>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Hero
