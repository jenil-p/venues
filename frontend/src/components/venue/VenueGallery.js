"use client";
import React from 'react';
import Image from 'next/image';
import { BsGrid3X3Gap } from "react-icons/bs";

const VenueGallery = ({ photos }) => {
  const displayPhotos = photos?.length > 0 ? photos : [{ image: '/placeholder.jpg' }];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden my-6">
      
      <div className="md:col-span-2 md:row-span-2 relative cursor-pointer hover:opacity-95 transition">
        <Image 
          src={displayPhotos[0]?.image} 
          alt="Main Venue" 
          fill 
          className="object-cover"
          unoptimized 
        />
      </div>

      {displayPhotos.slice(1, 5).map((photo, index) => (
        <div key={index} className="hidden md:block relative cursor-pointer hover:opacity-95 transition">
          <Image 
            src={photo.image} 
            alt={`Venue shot ${index + 1}`} 
            fill 
            className="object-cover"
            unoptimized 
          />
        </div>
      ))}

      <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 transition">
        <BsGrid3X3Gap />
        Show all photos
      </button>
    </div>
  );
};

export default VenueGallery;