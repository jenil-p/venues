"use client"

import React, { useState } from 'react'

import Navbar from '@/components/Navbar'

const page = () => {
    const [isPast, setisPast] = useState(false)
    return (
        <>
            <Navbar />
            <div className="message_part p-20 pt-36 w-full flex justify-center items-center h-screen ">
                <div className="main w-full h-full rounded-2xl ">
                    <p className='bold-x-big-gray mb-12'>Transaction History</p>
                    <div className='w-full h-10'>
                        <div className="past-coming w-full border-b flex justify-start items-center gap-4">
                            <div className='flex justify-between items-center gap-4'>
                                <p  className={`small-semibold-dark h-10 pb-2 cursor-pointer transition-all ${(!isPast ? 'border-b-2' : '')}`}
                                    onClick={()=>setisPast(false)}
                                >
                                    Completed
                                </p>
                                <p  className={`small-semibold-dark h-10 pb-2 cursor-pointer transition-all ${(!isPast ? 'border-b-2' : '')}`}
                                    onClick={()=>setisPast(false)}
                                >
                                    Upcoming
                                </p>
                                <p className={`small-semibold-dark h-10 pb-2 cursor-pointer transition-all ${(isPast ? 'border-b-2' : '')}`}
                                    onClick={() => setisPast(true)}
                                    >
                                    Past
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-full flex flex-col gap-4 pt-10'>
                        <div className="card w-full py-3 px-5 flex justify-between items-center rounded-xl bg-[#EFF0F2]">
                            <div className="infos flex justify-center items-center gap-4">
                                <div>
                                    <p className='small-semibold-dark'>Transaction Title</p>
                                    <p className='small-thin-gray'>Event date : 23/10/2025</p>
                                </div>
                            </div>
                            <p className='small-thin-dark'>$1000</p>
                        </div>
                        <div className="card w-full py-3 px-5 flex justify-between items-center rounded-xl bg-[#EFF0F2]">
                            <div className="infos flex justify-center items-center gap-4">
                                <div>
                                    <p className='small-semibold-dark'>Transaction Title</p>
                                    <p className='small-thin-gray'>Event date : 23/10/2025</p>
                                </div>
                            </div>
                            <p className='small-thin-dark'>$1000</p>
                        </div>
                        <div className="card w-full py-3 px-5 flex justify-between items-center rounded-xl bg-[#EFF0F2]">
                            <div className="infos flex justify-center items-center gap-4">
                                <div>
                                    <p className='small-semibold-dark'>Transaction Title</p>
                                    <p className='small-thin-gray'>Event date : 23/10/2025</p>
                                </div>
                            </div>
                            <p className='small-thin-dark'>$1000</p>
                        </div>
                        <div className="card w-full py-3 px-5 flex justify-between items-center rounded-xl bg-[#EFF0F2]">
                            <div className="infos flex justify-center items-center gap-4">
                                <div>
                                    <p className='small-semibold-dark'>Transaction Title</p>
                                    <p className='small-thin-gray'>Event date : 23/10/2025</p>
                                </div>
                            </div>
                            <p className='small-thin-dark'>$1000</p>
                        </div>
                        <div className="card w-full py-3 px-5 flex justify-between items-center rounded-xl bg-[#EFF0F2]">
                            <div className="infos flex justify-center items-center gap-4">
                                <div>
                                    <p className='small-semibold-dark'>Transaction Title</p>
                                    <p className='small-thin-gray'>Event date : 23/10/2025</p>
                                </div>
                            </div>
                            <p className='small-thin-dark'>$1000</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
