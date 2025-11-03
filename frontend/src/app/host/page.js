"use client";

import React from 'react'

import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import DarkButton from '@/components/DarkButton';
import BlogCard from '@/components/cards/BlogCard';

import { IoSearch } from "react-icons/io5";

const page = () => {

    return (
        <>
            <Navbar />
            <div className='h-screen flex' data-section>
                <img src="home.jpeg" alt="bg" className='w-full h-auto' />
                <div className='text-[#484848] rounded-2xl z-10 absolute bottom-48 left-40 space-y-3'>
                    <p className='text-5xl font-bold'>Try Hosting With Us</p>
                    <p className='small-thin-gray'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, voluptatem!</p>
                    <div className='w-60'>
                        <DarkButton btnName={'Get Started'}/>
                    </div>
                </div>
            </div>
            <div className='h-96 flex px-20 items-center justify-center gap-2 my-20'>
                <div className="img h-full w-1/2 rounded-xl bg-[#9A9A9A]"></div>
                <div className='w-1/2 h-full p-10 flex flex-col justify-start items-start gap-4'>
                    <p className='text-4xl text-[#484848]'>Some Title</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A eum laboriosam nostrum quaerat ratione eos sit molestias. Velit recusandae, quia corrupti labore delectus repudiandae voluptates libero asperiores deserunt nostrum, voluptatibus perferendis minus esse! Soluta!</p>
                </div>
            </div>
            <div className='my-20 mx-20'>
                <p>Hosting Tips And Guides</p>
                <div className="blogs w-full flex justify-start mt-10 items-center gap-4">
                    <div className="box bg-[#9A9A9A] rounded-xl w-40 h-40"></div>
                    <div className="box bg-[#9A9A9A] rounded-xl w-40 h-40"></div>
                    <div className="box bg-[#9A9A9A] rounded-xl w-40 h-40"></div>
                </div>
            </div>
            <FooterDiv/>
        </>
    )
}

export default page
