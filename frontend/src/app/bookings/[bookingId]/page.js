'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import { bookingService } from '@/api/booking.service';
import { venueService } from '@/api/venue.service';
import {
  FaClock, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaArrowLeft,
  FaCheckCircle, FaTimesCircle, FaCreditCard, FaExclamationTriangle 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BookingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.bookingId);

  const [booking, setBooking] = useState(null);
  const [venue, setVenue] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceeding, setProceeding] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await bookingService.getBooking(bookingId);
        const bookingData = bookingRes?.data || bookingRes;

        setBooking(bookingData);

        const venueRes = await venueService.getVenue(bookingData.venueId);
        setVenue(venueRes?.data || venueRes);
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

  // Countdown for PENDING_PAYMENT
  useEffect(() => {
    if (!booking?.expiresAt || booking.bookingStatus !== 'PENDING_PAYMENT') return;

    const interval = setInterval(() => {
      const diff = new Date(booking.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${min}:${sec.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  // Razorpay Script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const isPendingPayment = booking?.bookingStatus === 'PENDING_PAYMENT' || booking?.bookingStatus === 'CART';

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
            window.location.href = `/bookings/${bookingId}/`;
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("Razorpay modal closed by user");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to initiate payment";
      toast.error(msg);
    } finally {
      setProceeding(false);
    }
  };

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      router.push(`/properties/${booking?.venueId || ''}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="mx-auto text-7xl text-red-500 mb-6" />
          <h1 className="text-3xl font-semibold mb-3">{error.title}</h1>
          <p className="text-zinc-600 mb-8">{error.message}</p>
          <button onClick={() => router.push('/')} className="px-8 py-3.5 bg-black text-white rounded-2xl font-medium">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const isHourly = booking.pricePerUnit?.unit === 'HOURLY' || false;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-black transition"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                            ${booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'}`}>
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left - Main Content */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 mb-2">
                {venue?.venuename}
              </h1>
              <p className="flex items-center gap-2 text-zinc-600">
                <FaMapMarkerAlt />
                {venue?.address?.city?.name}, {venue?.address?.city?.state?.name}
              </p>
            </div>

            {/* Booking Info Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <FaCalendarAlt /> Reservation Details
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">CHECK-IN</p>
                  <p className="text-xl font-medium">
                    {startDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-zinc-600 mt-1">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500 text-sm mb-1">CHECK-OUT</p>
                  <p className="text-xl font-medium">
                    {endDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-zinc-600 mt-1">
                    {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex items-center gap-4">
                <FaUsers className="text-2xl text-zinc-400" />
                <div>
                  <p className="font-medium">{booking.numberOfGuestsExpected} Guests</p>
                </div>
              </div>
            </div>

            {/* Venue Photos / Gallery (Premium Touch) */}
            {venue?.photos?.length > 0 && (
              <div className="bg-white rounded-3xl overflow-hidden border border-zinc-100">
                <img
                  src={venue.photos[0].url || venue.photos[0].image}
                  alt={venue.venuename}
                  className="w-full h-[420px] object-cover"
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - Summary + Actions */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="text-5xl font-semibold tracking-tighter">₹{Number(booking.totalCost).toLocaleString('en-IN')}</span>
                  <p className="text-sm text-zinc-500 mt-1">Total Amount</p>
                </div>
                {isPendingPayment && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-amber-600 font-medium">
                      <FaClock /> {timeLeft || '--:--'}
                    </div>
                    <p className="text-xs text-zinc-500">minutes left</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-6 border-y text-sm">
                <div className="flex justify-between">
                  <span>₹{Number(booking.pricePerUnit).toLocaleString('en-IN')} × {isHourly ? 'hours' : 'days'}</span>
                  <span>₹{Number(booking.totalCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Service Fee</span>
                  <span>₹0</span>
                </div>
              </div>

              {/* Action Button */}
              {isPendingPayment ? (
                <button
                  onClick={handleProceedToPayment}
                  disabled={proceeding || timeLeft === 'Expired'}
                  className="w-full mt-8 bg-gradient-to-r from-black to-zinc-900 hover:from-zinc-900 hover:to-black text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985]"
                >
                  {proceeding ? 'Processing Payment...' : 'Proceed to Secure Payment'}
                </button>
              ) : (
                <div className="mt-8 flex items-center gap-3 text-emerald-600 justify-center py-4 bg-emerald-50 rounded-2xl">
                  <FaCheckCircle className="text-xl" />
                  <span className="font-medium">Booking Confirmed</span>
                </div>
              )}

              {/* Cancel Button (only for pending) */}
              {isPendingPayment && (
                <button
                  onClick={handleCancel}
                  className="w-full mt-4 text-red-600 hover:bg-red-50 py-4 rounded-2xl font-medium transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterDiv />
    </div>
  );
};

export default BookingDetailPage;