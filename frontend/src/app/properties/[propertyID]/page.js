import React from 'react'

import Navbar from '@/components/Navbar'
import NearbyServices from '@/components/cards/NearbyServices';
import ReserveCard from '@/components/cards/ReserveCard';
import FooterDiv from '@/components/Footer';
import ReviewCard from '@/components/cards/ReviewCard';

import { FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { IoBedOutline, IoCarOutline, IoPawOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";

import { TbToolsKitchen } from "react-icons/tb";
import { IoTvOutline, IoWifiOutline } from "react-icons/io5";
import { IoIosSnow } from "react-icons/io";
import { PiWashingMachineLight } from "react-icons/pi";
import { MdBalcony } from "react-icons/md";

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";

import { FaArrowRight } from "react-icons/fa6";


const page = ({ params }) => {
  return (
    <>
      <Navbar />

      <div className="result-page py-20">
        <div className='image-section xl:h-[600px] max-xl:h-[500px] p-10 w-full flex justify-center items-center gap-4'>
          <div className="title-image w-1/2 h-full bg-[#C2C6CC] rounded-2xl"></div>
          <div className="other-images w-1/2 h-full flex flex-col justify-center items-center box-border gap-4">
            <div className='flex h-1/2 w-full gap-4'>
              <div className="image2 bg-[#C2C6CC] w-1/2 h-full rounded-lg"></div>
              <div className="image2 bg-[#C2C6CC] w-1/2 h-full rounded-lg"></div>
            </div>
            <div className='flex h-1/2 w-full gap-4'>
              <div className="image2 bg-[#C2C6CC] w-1/2 h-full rounded-lg"></div>
              <div className="image2 bg-[#C2C6CC] w-1/2 h-full rounded-lg flex justify-center items-center">
                <div className="flex justify-center items-center gap-4">
                  <div className="no-of-photoes semibold-x-big-gray">+2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-div flex justify-center items-center px-32 h-auto">
        <div className='w-3/5 '>
          <div className="address-like flex justify-between items-center">
            <div className="text-area">
              <p className='text-[#484848] font-inter text-3xl font-bold mb-1'>
                Well Furnished Apartment
              </p>
              <p className='small-thin-gray font-inter'>
                100 Smart Street, Gujarat, India.
              </p>
            </div>
            <div className="like-share flex justify-center items-center gap-4 text-4xl text-[#484848] font-bold">
              <FaRegHeart />
              <FiShare2 />
            </div>
          </div>
          <div className="capacity-cards flex justify-between items-center py-10 w-full">
            <div className='bg-[#EFF0F2] rounded-xl p-12 flex flex-col justify-center items-center font-bold text-6xl text-[#484848]'>
              <IoBedOutline /> <p className='small-thin-dark'>0 Allowed</p>
            </div>
            <div className='bg-[#EFF0F2] rounded-xl p-12 flex flex-col justify-center items-center-10 font-bold text-6xl text-[#484848]'>
              <PiBathtub /> <p className='small-thin-dark'>0 Allowed</p>
            </div>
            <div className='bg-[#EFF0F2] rounded-xl p-12 flex flex-col justify-center items-center font-bold text-6xl text-[#484848]'>
              <IoCarOutline /> <p className='small-thin-dark'>0 Allowed</p>
            </div>
            <div className='bg-[#EFF0F2] rounded-xl p-12 flex flex-col justify-center items-center font-bold text-6xl text-[#484848]'>
              <IoPawOutline /> <p className='small-thin-dark'>0 Allowed</p>
            </div>
          </div>
          <div className="descroption py-5 space-y-4">
            <p className="title semibold-big-gray">Apartment Description</p>
            <p className='small-thin-gray'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo sunt dignissimos dolore aspernatur fugiat a, quidem omnis mollitia rem quas at illo amet, nemo perferendis sit? Enim saepe laudantium reiciendis veritatis molestias ducimus odio.
            </p>
            <p className='small-thin-gray'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo sunt dignissimos dolore aspernatur fugiat a, quidem omnis mollitia rem quas at illo amet, nemo perferendis sit? Enim saepe laudantium reiciendis veritatis molestias ducimus odio.
            </p>
          </div>
        </div>
        <div className='w-2/5 flex justify-center items-start h-full'>
          <ReserveCard />
        </div>
      </div>

      <div className='w-4/5 px-32 my-10 title'>
        <p className='semibold-big-gray mb-7'>Offered Amenities</p>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <TbToolsKitchen className='w-7 h-auto' /> Kitchen
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <IoTvOutline className='w-7 h-auto' /> Television With Netflix
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <IoIosSnow className='w-7 h-auto' /> Air Conditioner
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <IoWifiOutline className='w-7 h-auto' /> Free Wireless Internet
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <PiWashingMachineLight className='w-7 h-auto' /> Washer
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <MdBalcony className='w-7 h-auto' /> Balcony
          </div>
        </div>
        <div className="show-all my-7">
          <button className='border rounded-md text-[#484848] flex justify-center items-center h-16 w-56'>Show All 10 Amenities</button>
        </div>
      </div>


      <div className='w-4/5 px-32 my-16 title '>
        <p className='semibold-big-gray mb-7'>Safety & Hygiene</p>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <BsClipboardCheck className='w-7 h-auto' /> Daily Cleaning
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <BsClipboardCheck className='w-7 h-auto' /> Fire Extinguishers
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <BsClipboardCheck className='w-7 h-auto' /> Disinfections and Sterilizations
          </div>
          <div className='flex justify-start items-center text-[#484848] text-lg gap-5'>
            <BsClipboardCheck className='w-7 h-auto' /> Smoke Detectors
          </div>
        </div>
      </div>

      <div className="map w-8/12 h-96 px-32 my-16">
        <div className='border bg-[#EFF0F2] w-full h-full'>

        </div>
      </div>

      <div className="near-by w-4/5 px-32 my-16">
        <p className='semibold-big-gray mb-7'>Nearby Services</p>
        <div className="services-list relative flex justify-start items-center gap-4 w-10/12">
          <div className="next-btn w-16 h-16 absolute -right-5 rounded-full flex justify-center items-center bg-[#9A9A9A] text-[#484848] text-2xl">
            <FaArrowRight />
          </div>
          <NearbyServices />
          <NearbyServices />
          <NearbyServices />
        </div>
        <div className="btn mt-7">
          <button className='w-44 h-14 flex justify-center items-center rounded-full bg-[#9A9A9A] text-white font-semibold'>Show On Map</button>
        </div>
      </div>

      <div className="reviews w-4/5 px-32 mt-16 mb-24 title">
        <div className='semibold-big-gray mb-7 flex justify-start items-center gap-2'>
          <p>Reviews</p>
          <FaStar />
          <p>5.0</p>
        </div>
        <div className="w-9/12 grid grid-cols-2 gap-x-10 gap-y-3">
          <div className='flex justify-between items-center text-[#484848] text-lg gap-5'>
            <p>Amenities</p>
            <div className='flex justify-center items-center gap-2'>
              <div className="progress-bar w-32 bg-[#9A9A9A] h-1 rounded-full"></div>
              <p>5.0</p>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#484848] text-lg gap-5'>
            <p>Hygiene</p>
            <div className='flex justify-center items-center gap-2'>
              <div className="progress-bar w-32 bg-[#9A9A9A] h-1 rounded-full"></div>
              <p>5.0</p>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#484848] text-lg gap-5'>
            <p>Communication</p>
            <div className='flex justify-center items-center gap-2'>
              <div className="progress-bar w-32 bg-[#9A9A9A] h-1 rounded-full"></div>
              <p>5.0</p>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#484848] text-lg gap-5'>
            <p>Location</p>
            <div className='flex justify-center items-center gap-2'>
              <div className="progress-bar w-32 bg-[#9A9A9A] h-1 rounded-full"></div>
              <p>5.0</p>
            </div>
          </div>
          <div className='flex justify-between items-center text-[#484848] text-lg gap-5'>
            <p>Value For Money</p>
            <div className='flex justify-center items-center gap-2'>
              <div className="progress-bar w-32 bg-[#9A9A9A] h-1 rounded-full"></div>
              <p>5.0</p>
            </div>
          </div>
        </div>
        <div className='w-11/12 grid grid-cols-2 gap-x-10 gap-y-12 my-10'>
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
        <div className="show-all my-7">
          <button className='border rounded-md text-[#484848] flex justify-center items-center h-16 w-56'>Show All 100 Reviews</button>
        </div>
      </div>

      <FooterDiv />
    </>
  )
}


export default page
