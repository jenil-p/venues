import React from 'react'

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const NearbyServices = () => {
    return (
        <div className='w-60 h-28 shadow-lg flex flex-col items-start justify-around px-4 py-4 rounded-xl'>
            <p className='small-semibold-gray'>Grill Resto & Bar</p>
            <p className='small-thin-gray'>100 meters away</p>
            <div className="stars text-[#484848] flex justify-center items-center gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
            </div>
        </div>
    )
}

export default NearbyServices
