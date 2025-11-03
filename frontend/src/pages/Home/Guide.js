import React from 'react'

import BlogCard from '@/components/cards/BlogCard';
import DarkButton from '@/components/DarkButton';

const GuidesAndTips = () => {
    return (
        <div className='w-full px-20 pt-32 flex flex-col justify-center items-center'>
            {/* <div className='w-full'> */}
                <div className='h-full w-full'>
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>Property Rental</p>
                        <p className='font-inter '>Guides & Tips</p>
                        <div className='bg-[#484848] h-1.5 w-40 rounded-full mt-5'></div>
                    </div>
                    <div className="cards w-full flex justify-between items-center flex-wrap mb-20">
                        <BlogCard />
                        <BlogCard />
                        <BlogCard />
                    </div>
                {/* </div> */}
            </div>
            <DarkButton btnName={'View All Blogs'} />
        </div>
    )
}

export default GuidesAndTips
