import React from 'react'

import FeaturedCard from '@/components/cards/FeaturedCard'

const FeaturedProperties = () => {
  return (
    <div className='w-full px-20 pt-32 flex flex-col justify-center items-center'>
      <div className='w-full'>
        <div className='h-full w-full'>
          <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
            <p className='font-inter '>Featured Properties</p>
            <p className='font-inter '>on our Listing</p>
            <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-5'></div>
          </div>
          <div className="cards w-full flex justify-between items-center flex-wrap mb-20">
              <FeaturedCard/>
              <FeaturedCard/>
              <FeaturedCard/>
              <FeaturedCard/>
              <FeaturedCard/>
              <FeaturedCard/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProperties
