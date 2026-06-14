import React from 'react';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import VenueGallery from '@/components/venue/VenueGallery';
import BookingWidget from '@/components/venue/BookingWidget';

import { FaRegHeart, FaStar, FaShare, FaMapMarkerAlt } from "react-icons/fa";
import { BsDoorOpen, BsShieldCheck } from "react-icons/bs";
import { PiMedal } from "react-icons/pi";

import { venueService } from '@/api/venue.service';

const getVenueData = async (id) => {
  try {
    const response = await venueService.getVenue(id);
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch venue", error);
    return null;
  }
};

const PropertyPage = async ({ params }) => {
  const resolvedParams = await params;
  const venueId = Number(resolvedParams.propertyId);


  const venue = await getVenueData(venueId);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">Venue not found</h1>
      </div>
    );
  }

  const city = venue.address?.city?.name || "Unknown City";
  const state = venue.address?.city?.state?.name || "Unknown State";
  const country = venue.address?.city?.state?.country?.name || "India";
  const formattedAddress = `${city}, ${state}, ${country}`;
  
  const price = venue.pricing?.[0]?.price || 0;
  const features = venue.features || [];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto mt-20 px-6 py-6 sm:px-8 lg:px-12">
        
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {venue.venuename}
          </h1>
          <div className="flex justify-between items-center text-sm md:text-base">
            <div className="flex items-center gap-2 font-medium underline cursor-pointer">
              <FaStar className="text-black" />
              <span>{venue.rating ? venue.rating : "New"}</span>
              <span className="text-gray-600 no-underline mx-1">·</span>
              <span className="text-gray-800 underline">{venue.reviews?.length || 0} reviews</span>
              <span className="text-gray-600 no-underline mx-1">·</span>
              <span className="text-gray-600">{formattedAddress}</span>
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-md transition font-medium underline">
                <FaShare className="text-sm" /> Share
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-md transition font-medium underline">
                <FaRegHeart className="text-sm" /> Save
              </button>
            </div>
          </div>
        </div>

        <VenueGallery photos={venue.photos} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 relative">
          
          <div className="md:col-span-2 flex flex-col gap-8">
            
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-1">Entire venue hosted by Provider</h2>
              <p className="text-gray-500">
                {venue.capacity} guests · {venue.address?.postalcode} Postal Code
              </p>
            </div>

            <div className="flex flex-col gap-6 border-b pb-8 text-gray-600">
              <div className="flex gap-4 items-start">
                <BsDoorOpen className="text-2xl text-gray-800 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Self check-in</h3>
                  <p className="text-sm">Check yourself in with the lockbox.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <PiMedal className="text-2xl text-gray-800 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Great location</h3>
                  <p className="text-sm">90% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-8">
               <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                 {venue.description}
               </p>
               <button className="mt-4 font-semibold underline flex items-center gap-1">
                 Show more <span className="text-lg"></span>
               </button>
            </div>

            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-4">
                {features.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <BsShieldCheck className="text-xl" /> 
                    <span>{item.feature?.name || "Amenity"}</span>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 border border-black rounded-lg px-6 py-3 font-semibold hover:bg-gray-50 transition">
                Show all {features.length} amenities
              </button>
            </div>

          </div>

          <div className="md:col-span-1 relative">
            <div className="sticky top-24 w-full">
              <BookingWidget
                price={price}
                rating={venue.rating}
                venueId={venueId}
                unit={venue.pricing?.[0]?.unit ?? "DAILY"}
            />
            </div>
          </div>

        </div>

        <div className="py-12 border-t mt-12">
            <h2 className="text-2xl font-semibold mb-6">Where you'll be</h2>
            <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt /> {formattedAddress}
                </p>
            </div>
        </div>

      </main>

      <FooterDiv />
    </div>
  );
};

export default PropertyPage;