import React from 'react'

import SimpleDisplayCard from '@/components/cards/SimpleDisplay';
import RatingCard from '@/components/cards/RatingCard';


const Suggestions = () => {
  return (
    <>
    <div className='w-full px-20 pt-32 flex flex-col justify-center items-center'>
      {/* Latest */}
      <div className='w-full'>
        <div className='h-full w-full'>
          <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
            <p className='font-inter '>Latest on The</p>
            <p className='font-inter '>Property Listing</p>
            <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-5'></div>
          </div>
          <div className="cards flex justify-between items-center flex-wrap my-20">
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
          </div>
        </div>
      </div>

      {/* Nearby */}
      <div className='w-full mt-16'>
        <div className='h-full w-full'>
          <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
            <p className='font-inter '>Nearby</p>
            <p className='font-inter '>Listed Properties</p>
            <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-5'></div>
          </div>
          <div className="cards flex justify-between items-center flex-wrap my-20">
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
              <SimpleDisplayCard/>
          </div>
        </div>
      </div>

      {/* Top rated */}
      <div className='w-full mt-16'>
        <div className='h-full w-full'>
          <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
            <p className='font-inter '>Top Rated</p>
            <p className='font-inter '>Properties</p>
            <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-5'></div>
          </div>
          <div className="cards flex justify-between items-center flex-wrap my-20">
              <RatingCard/>
              <RatingCard/>
              <RatingCard/>
              <RatingCard/>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Suggestions
