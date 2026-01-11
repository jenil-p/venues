"use client";
import React from 'react';
import { formatPrice } from '@/lib/utils';
import { FaStar } from "react-icons/fa";

const BookingWidget = ({ price, rating }) => {
  return (
    <div className="border border-gray-200 shadow-xl rounded-xl p-6 bg-white">
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
          <span className="text-gray-500 text-sm"> / day</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <FaStar className="text-black h-3 w-3" />
          <span>{rating || "New"}</span>
        </div>
      </div>

      <div className="border border-gray-400 rounded-lg overflow-hidden mb-4">
        <div className="grid grid-cols-2 border-b border-gray-400">
          <div className="p-3 border-r border-gray-400">
            <label className="block text-[10px] font-bold uppercase text-gray-800">Check-in</label>
            <span className="text-sm text-gray-600">Add date</span>
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase text-gray-800">Check-out</label>
            <span className="text-sm text-gray-600">Add date</span>
          </div>
        </div>
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase text-gray-800">Guests</label>
          <span className="text-sm text-gray-600">1 guest</span>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition active:scale-[0.98]">
        Reserve
      </button>

      <p className="text-center text-gray-500 text-sm mt-4">You won't be charged yet</p>
      
      <div className="mt-6 flex flex-col gap-3 text-gray-600">
        <div className="flex justify-between underline decoration-gray-300">
          <span>{formatPrice(price)} x 5 days</span>
          <span>{formatPrice(price * 5)}</span>
        </div>
        <div className="flex justify-between underline decoration-gray-300">
          <span>Service fee</span>
          <span>₹2,500</span>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-900 text-lg">
        <span>Total</span>
        <span>{formatPrice((price * 5) + 2500)}</span>
      </div>
    </div>
  );
};

export default BookingWidget;