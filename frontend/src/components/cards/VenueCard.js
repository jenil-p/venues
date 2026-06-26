"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { FaStar } from "react-icons/fa";

import { venueService } from '@/api/venue.service.js';

const VenueCard = ({ venue, wishlist }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const id = venue.id; 
  const imageSrc = venue.photos?.[0]?.image || '/placeholder.jpg';
  const price = venue.pricing?.[0]?.price || 0;
  const priceUnit = venue.pricing?.[0]?.unit || "DAILY";
  const rating = venue.rating || 0;
  const name = venue.venuename || "Untitled Venue";
  const location = venue.address.location;
  const city = venue.address.city.name;

  const handleCardClick = () => {
    if (id) {
      router.push(`/properties/${id}`);
    } else {
      console.error("Venue ID is missing");
    }
  };

  useEffect(() => {
    const isInWishlist = wishlist.some(item => 
      item.venueId === id || item.venue?.id === id
    );
    setIsLiked(isInWishlist);
  }, [wishlist, id]);

  const toggleWishListVenue = async (e, venueId) => {
    e.stopPropagation();
    if (isLoading) return;

    const newState = !isLiked;
    setIsLiked(newState);
    setIsLoading(true);

    try {
      await venueService.toggleWishlist(venueId);
    } catch (error) {
      console.error("Toggle wishlist failed:", error);
      setIsLiked(!newState);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col gap-2 w-full"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={imageSrc}
          alt={name}
          fill
          unoptimized={true}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Like Button */}
        <button
          onClick={(e) => toggleWishListVenue(e, id)}
          className="absolute top-3 right-3 transition-transform active:scale-90 cursor-pointer"
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className={`h-7 w-7 block ${isLiked ? 'fill-[#BF4A1A] stroke-white' : 'fill-black/50 stroke-white'} stroke-[2px] overflow-visible`}
            style={{ paintOrder: 'stroke' }}
          >
            <path d="M16 28c-1.139 0-2.185-.436-3.08-1.284L4.85 18.575C3.395 17.065 2.5 15.01 2.5 12.822c0-4.755 3.515-8.322 8.167-8.322 2.47 0 4.75 1.258 6.133 3.322C18.25 5.758 20.53 4.5 23 4.5c4.652 0 8.167 3.567 8.167 8.322 0 2.188-.895 4.243-2.35 5.753L20.08 26.716c-.895.848-1.94 1.284-3.08 1.284z"></path>
          </svg>
        </button>

        {rating >= 4.5 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            <span className="text-xs font-bold text-gray-800">Guest favorite</span>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 truncate text-[15px]">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-[14px] shrink-0">
            <FaStar className="h-3 w-3 text-black" />
            <span>{rating > 0 ? rating : "New"}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-[15px] truncate">
           {location}, {city}
        </p>

        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="font-semibold text-gray-900 text-[15px]">
            {formatPrice(price)}
          </span>
          <span className="text-gray-900 font-light text-[15px]">{(priceUnit == "DAILY")? "day" : "hour"}</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;