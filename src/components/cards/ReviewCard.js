import React from 'react'

const ReviewCard = () => {
  return (
    <div className='review-card'>
      <div className='flex justify-start items-center gap-2'>
            <div className="image w-16 h-16 bg-[#9A9A9A] rounded-full">
              {/* <img src="/user.png" alt="User" className='rounded-full h-full w-full'/> */}
            </div>
            <div className="user-info">
                <p className='small-semibold-gray'>John Doberman</p>
                <p className='small-thin-gray'>12 March 2025.</p>
            </div>
      </div>
      <div className='small-thin-gray mt-2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, necessitatibus.</div>
    </div>
  )
}

export default ReviewCard
