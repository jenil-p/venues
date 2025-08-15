import React from 'react'

import DarkButton from '@/components/DarkButton'

const MoreProperties = () => {
    return (
        <div className='h-[450px] w-full px-20 pt-10'>
            <div className='h-full w-full bg-[#E0E2E6] relative flex items-center justify-center rounded-2xl overflow-hidden'>
                {/* <img src="home.jpeg" alt="bg" className='w-full h-auto object-cover' /> */}
                <div className="flex flex-col justify-center items-start gap-7 absolute left-10 py-20">
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>Browse For</p>
                        <p className='font-inter '>More Properties</p>
                    </div>
                    <div className="small-thin-gray">Explore properties by their categories.types.</div>
                    <DarkButton btnName={"Find A Property"}/>
                </div>
            </div>
        </div>
    )
}

export default MoreProperties;
