import React from 'react'

import DarkButton from '@/components/DarkButton'

const HostingBanner = () => {
    return (
        <div className='h-[450px] w-full px-20 pt-10'>
            <div className='h-full w-full bg-[#E0E2E6] relative flex items-center justify-center rounded-2xl overflow-hidden'>
                {/* <img src="home.jpeg" alt="bg" className='w-full h-auto object-cover' /> */}
                <div className="flex flex-col justify-center items-start gap-7 absolute left-10">
                    <div className="text-[#484848] text-4xl font-bold flex flex-col gap-1.5">
                        <p className='font-inter '>Try Hosting</p>
                        <p className='font-inter '>With Us</p>
                    </div>
                    <div className="small-thin-gray">Earn extra by just renting your property.</div>
                    <DarkButton btnName={"Become A Host"}/>
                </div>
            </div>
        </div>
    )
}

export default HostingBanner
