import React from 'react'

import { CiHeart } from "react-icons/ci";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const RatingCard = () => {
  return (
    <div className='h-[360px] w-[320px] rounded-xl bg-[#E0E2E6]'>
      <div className='w-full h-full p-4 box-border flex flex-col justify-between'>
        <div className='wishlist flex justify-between items-center '>
          <div className="stars text-[#484848] flex justify-center items-center gap-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
            <FaRegStar />
          </div>
          <CiHeart className='h-10 w-auto text-[#9A9A9A]' />
        </div>
        <div className='id flex flex-col items-start justify-center gap-3'>
          <div className="profile-pic h-20 w-20 rounded-full bg-[#9A9A9A]">
            {/* <img src="user.png" className='h-full w-full rounded-full' alt="Photo" /> */}
          </div>
          <div className="info">
            <div className='small-bold-gray'>The new preperty</div>
            <div className='small-thin-gray'>100 smart street, Gujarat, India.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingCard
