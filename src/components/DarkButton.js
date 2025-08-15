import React from 'react'

const DarkButton = ({params , btnName}) => {
  return (
    <div className='button text-center bg-[#484848] text-white px-10 py-4 rounded-full font-semibold'>
      {btnName}
    </div>
  )
}

export default DarkButton
