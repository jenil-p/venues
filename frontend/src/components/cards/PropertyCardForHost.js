import React from 'react'

const PropertyCardForHost = () => {
  return (
    <div className='w-64 h-72 bg-[#9A9A9A] rounded-xl'>
        <div className='relative w-full h-full'>
            <img src="/image3.webp" alt="Hotel Image" className='h-full w-full object-cover rounded-xl'/>
            <div className="absolute bottom-3 left-5">
                <p className='small-bold-gray'>Hosted Venue 1</p>
                <p className='small-thin-gray'>Nr. Railway station, Gujarat</p>
            </div>
        </div>
        <div className='buttons flex justify-center items-center gap-4 my-3'>
            <button className='w-1/2 border border-[#484848] rounded-full py-2 text-[#484848] cursor-pointer'>Edit</button>
            <button className='w-1/2 bg-[#484848] rounded-full py-2 text-white cursor-pointer'>Delete</button>
        </div>
    </div>
  )
}

export default PropertyCardForHost
