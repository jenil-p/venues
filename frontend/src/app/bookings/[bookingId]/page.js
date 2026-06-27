'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { bookingService } from '@/api/booking.service';
import { venueService } from '@/api/venue.service';
import { providerService } from '@/api/provider.service';
import { toast } from 'react-hot-toast';

import BookingDetailSkeleton from '@/components/booking/BookingDetailSkeleton.js';

import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { PiWarningCircle } from "react-icons/pi";
import { RxCrossCircled } from "react-icons/rx";
import { RxPeople } from "react-icons/rx";
import { WiTime4 } from "react-icons/wi";
import { FiShield } from 'react-icons/fi';


import PriceSummary from '@/components/booking/PriceSummary';
import AmenitiesList from '@/components/booking/AmenitiesList';
import HostDetails from '@/components/booking/HostDetails';

const BookingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.bookingId);

  const [booking, setBooking] = useState(null);
  const [venue, setVenue] = useState(null);
  const [provider, setProvider] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceeding, setProceeding] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch Data Sequence
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await bookingService.getBooking(bookingId);
        const bookingData = bookingRes?.data || bookingRes;
        setBooking(bookingData);

        const venueRes = await venueService.getVenue(bookingData.venueId);
        const venueData = venueRes?.data || venueRes;
        setVenue(venueData);

        // Fetch Host Provider data via API safely
        if (venueData?.providerId) {
          try {
            const providerRes = await providerService.getProvider(venueData.providerId);
            setProvider(providerRes?.provider || providerRes?.data || providerRes);
          } catch (pErr) {
            console.error("Provider data failed to load smoothly", pErr);
          }
        }
      } catch (err) {
        setError({
          title: "Booking Not Found",
          message: err?.response?.data?.message || "Unable to load booking details."
        });
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchData();
  }, [bookingId]);

  // Countdown timer logic
  useEffect(() => {
    if (!booking?.expiresAt || booking.bookingStatus !== 'PENDING_PAYMENT') return;

    const interval = setInterval(() => {
      const diff = new Date(booking.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        return;
      }
      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${min}:${sec.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  // Load Razorpay Script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleProceedToPayment = async () => {
    if (proceeding || timeLeft === 'Expired') return;
    setProceeding(true);

    try {
      const data = await bookingService.createPaymentOrder(bookingId);

      if (typeof window.Razorpay === 'undefined') {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: venue?.venuename || "Venue Booking",
        description: `Booking #${bookingId}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await bookingService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment Successful!");
            window.location.reload();
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: { color: "#122B1E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to initiate payment");
    } finally {
      setProceeding(false);
    }
  };

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      if (['CART', 'PENDING_PAYMENT'].includes(booking.bookingStatus)) {
        const ress = await bookingService.revertToCart(bookingId);
        toast.success('Booking moved back to cart');
      } else {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled');
      }
      router.push(`/properties/${booking?.venueId || ''}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <BookingDetailSkeleton/>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-serif mb-2">{error.title}</h1>
          <p className="text-zinc-500 mb-6">{error.message}</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-black text-white rounded-xl font-medium">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.startTime || '2025-07-12T09:00:00');
  const endDate = new Date(booking.endTime || '2025-07-13T22:00:00');

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-sans text-[#1C1917] antialiased">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8 mt-20">
        
        {/* Top Minimal Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-black transition font-medium"
          >
            <span>&larr;</span> Back
          </button>
        </div>

        {/* Global Dynamic Status State Banners */}
        {booking.bookingStatus === 'CONFIRMED' && (
          <div className="bg-[#1A3D2B] text-white p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full flex items-center justify-center text-[#6ebf8b] font-bold text-2xl"><IoCheckmarkCircleOutline/></div>
              <div>
                <h3 className="font-semibold text-base">Booking Confirmed</h3>
                <p className="text-xs text-zinc-300 font-mono mt-0.5">Booking id: BKG-{booking.id}-AH</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-[#1A3D2B] hover:bg-[#23533A] text-sm font-medium py-2 px-4 rounded-xl transition border border-[#2A6647]">
              <span><LuDownload/></span> Receipt
            </button>
          </div>
        )}

        {booking.bookingStatus === 'CANCELLED' && (
          <div className="bg-[#FDF2F2] border border-[#FDE8E8] text-[#9B1C1C] p-5 rounded-2xl flex items-center gap-3 shadow-sm">
            <span className="text-lg">✕</span>
            <div>
              <h3 className="font-semibold text-sm">Booking Cancelled</h3>
              <p className="text-xs text-[#C81E1E] mt-0.5">This booking has been cancelled. Any applicable refund will appear within 5-7 business days.</p>
            </div>
          </div>
        )}

        {/* 2-Column Dashboard Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Side */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Hero Feature */}
            <div className="relative rounded-3xl overflow-hidden group border border-[#EBE6DD]">
              <img
                src={venue?.photos?.[0]?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                alt={venue?.venuename}
                className="w-full h-[340px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono tracking-widest text-[#FAF8F5]/80 uppercase mb-1">CREATIVE STUDIO & EVENT SPACE</span>
                <h1 className="text-3xl font-serif text-white font-medium tracking-wide">{venue?.venuename || "The Meridian Loft"}</h1>
                <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1">
                  <span> <SlLocationPin/> </span> {venue?.address?.location || "Hayes Valley, San Francisco, CA"}
                </p>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-[#1C1917] flex items-center gap-1">
                  ★ 4.9 <span className="text-[#78716C] font-normal font-sans text-[10px]">({venue?.reviews?.length || 127})</span>
                </div>
              </div>
            </div>

            {/* Structured Core Details Card */}
            <div className="bg-white rounded-3xl border border-[#EBE6DD] p-8 space-y-8 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-medium text-[#1C1917]">Booking Details</h2>
                {booking.bookingStatus === 'PENDING_PAYMENT' && (
                  <span className="bg-[#FFF8E6] text-[#B27B00] px-3 py-1 rounded-full text-sm font-medium border border-[#FFE099] flex items-center gap-1">
                    <PiWarningCircle/> Awaiting Payment
                  </span>
                )}
                {booking.bookingStatus === 'CONFIRMED' && (
                  <span className="bg-[#E6F4EA] text-[#1e402e] px-3 py-1 rounded-full text-sm font-medium border border-[#CEEAD6] flex items-center gap-1">
                    <IoCheckmarkCircleOutline/> Confirmed
                  </span>
                )}
                {booking.bookingStatus === 'CANCELLED' && (
                  <span className="bg-[#FCE8E6] text-[#C5221F] px-3 py-1 rounded-full text-sm font-medium border border-[#FAD2CF] flex items-center gap-1">
                    <RxCrossCircled/> Cancelled
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6 bg-[#FAF8F5] rounded-2xl p-5 border border-[#EBE6DD]">
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-[#A8A29E] mb-1">CHECK-IN</p>
                  <p className="text-base font-semibold text-[#1C1917]">
                    {startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-[#78716C] mt-0.5">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-[#A8A29E] mb-1">CHECK-OUT</p>
                  <p className="text-base font-semibold text-[#1C1917]">
                    {endDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-[#78716C] mt-0.5">
                    {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Yet to make this dynamic....................................................... */}

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-[#A8A29E] mb-1">GUESTS</p>
                  <p className="text-base font-medium text-[#1C1917] flex items-center gap-2">
                    <span className="text-lg"> <RxPeople/> </span> {booking.numberOfGuestsExpected || 24} attendees
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-[#A8A29E] mb-1">DURATION</p>
                  <p className="text-base font-medium text-[#1C1917] flex items-center gap-2">
                    <span className="text-lg"> <WiTime4/> </span> {booking.durationHours || 13} hours
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-mono tracking-wider text-[#A8A29E]">EVENT PURPOSE</p>
                <p className="text-base text-[#44403C] font-medium bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DD]">
                  {booking.purpose || "Corporate team offsite & product strategy workshop"}
                </p>
              </div>

              {/* till here................................................................................ */}

              {/* Dynamic Managed Amenities Module */}
              <AmenitiesList features={venue?.features} />
            </div>

            {/* Conditional Cancellation Policy Segment */}
            {booking.bookingStatus !== 'CANCELLED' && (
              <div className="bg-white rounded-3xl border border-[#EBE6DD] p-6 flex gap-4 items-start shadow-sm">
                <div className="font-bold text-2xl pt-2 text-zinc-400">
                  <FiShield/>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#1C1917]">Cancellation Policy</h4>
                  <p className="text-sm text-[#57534E] mt-0.5">Free cancellation until Jul 5, 2025. After that, 50% refund only.</p>
                </div>
              </div>
            )}

            {/* Condition: Render Host below main section for Confirmed / Cancelled status views */}
            {booking.bookingStatus !== 'PENDING_PAYMENT' && (
              <HostDetails provider={provider} />
            )}

          </div>

          {/* Pricing Actions Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <PriceSummary
              booking={booking}
              isPendingPayment={booking.bookingStatus === 'PENDING_PAYMENT'}
              proceeding={proceeding}
              timeLeft={timeLeft}
              handleProceedToPayment={handleProceedToPayment}
              handleCancel={handleCancel}
              cancelling={cancelling}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default BookingDetailPage;