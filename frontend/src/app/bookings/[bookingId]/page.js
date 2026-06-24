'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import { bookingService } from '@/api/booking.service';
import { venueService } from '@/api/venue.service';
import { FaClock, FaCalendarAlt, FaUsers, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BookingReviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.bookingId);

  const [booking, setBooking] = useState(null);
  const [venue, setVenue] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proceeding, setProceeding] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Fetch booking + venue
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!bookingId) {
        setError({ title: "Invalid Link", message: "No booking ID provided." });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const bookingRes = await bookingService.getBooking(bookingId);
        const bookingData = bookingRes?.data || bookingRes;

        if (!bookingData) throw new Error("Booking not found");

        if (!isMounted) return;

        setBooking(bookingData);

        const venueRes = await venueService.getVenue(bookingData.venueId);
        if (!isMounted) return;
        setVenue(venueRes?.data || venueRes);

      } catch (err) {
        if (!isMounted) return;

        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message || err?.message || "Failed to load booking";

        let errorPayload = {
          title: "Booking Not Found",
          message: serverMsg,
        };

        if (status === 404 || serverMsg.toLowerCase().includes("not found")) {
          errorPayload = {
            title: "Booking Not Found",
            message: "This booking no longer exists or you don't have access to it.",
          };
        } else if (status === 403 || serverMsg.toLowerCase().includes("permission") || serverMsg.toLowerCase().includes("unauthorized")) {
          errorPayload = {
            title: "Access Denied",
            message: "This booking belongs to another user.",
          };
        }

        setError(errorPayload);
        toast.error(errorPayload.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [bookingId]);

  // Countdown Timer
  useEffect(() => {
    if (!booking?.expiresAt) return;

    const interval = setInterval(() => {
      const expires = new Date(booking.expiresAt).getTime();
      const now = Date.now();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        toast.error('Payment window has expired.');
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

 useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onerror = () => console.error('Failed to load Razorpay SDK');
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }
}, []);

  const handleProceedToPayment = async () => {
    if (proceeding || timeLeft === 'Expired') return;
    setProceeding(true);

    try {
      const  data  = await bookingService.createPaymentOrder(bookingId);

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
            router.push(`/bookings/success/${bookingId}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center px-6">
          <div className="mx-auto mb-6 flex justify-center">
            {error.icon || <FaExclamationTriangle className="text-red-500 text-6xl" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{error.title}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error.message}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-black text-white rounded-2xl font-medium hover:bg-gray-800 transition"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-100 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!booking || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Booking not found</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-black underline"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const isHourly = booking.unit === 'HOURLY' || booking.pricePerUnit?.unit === 'HOURLY';

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 font-medium transition"
        >
          <FaArrowLeft /> Back to property
        </button>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Left Column - Details */}
          <div className="md:col-span-3 space-y-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🛎️</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Review your booking</h1>
                <p className="text-gray-600 mt-1">Confirm your details before proceeding to payment.</p>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-xl" /> {isHourly ? 'Date & Time' : 'Dates'}
              </h2>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Check-in</span>
                  <span>{startDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {isHourly ? (
                  <div className="flex justify-between">
                    <span className="font-medium">Time</span>
                    <span>
                      {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                      {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="font-medium">Check-out</span>
                    <span>{endDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guests */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaUsers className="text-xl" /> Guests
              </h2>
              <p className="text-3xl font-medium">{booking.numberOfGuestsExpected} guests</p>
            </div>

            {/* Venue Info */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Staying at</h3>
              <div className="flex gap-6 bg-white p-6 rounded-2xl border items-center">
                {venue.photos?.[0]?.url && (
                  <img
                    src={venue.photos[0].url}
                    alt={venue.venuename}
                    className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-xl leading-tight">{venue.venuename}</h4>
                  <p className="text-gray-600 mt-1">
                    {venue.address?.city?.name}, {venue.address?.city?.state?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-4xl font-bold">₹{Number(booking.totalCost).toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 block text-sm">Total</span>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-2 font-semibold ${timeLeft === 'Expired' ? 'text-red-600' : 'text-amber-600'}`}>
                    <FaClock /> {timeLeft || '--:--'}
                  </div>
                  <p className="text-xs text-gray-500">minutes remaining</p>
                </div>
              </div>

              <div className="border-t border-b py-6 space-y-3 text-sm mb-8">
                <div className="flex justify-between">
                  <span>₹{Number(booking.pricePerUnit).toLocaleString('en-IN')} × {isHourly ? 'hours' : 'nights'}</span>
                  <span>₹{Number(booking.totalCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Service fee</span>
                  <span>₹0</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={proceeding || timeLeft === 'Expired'}
                className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition mb-4"
              >
                {proceeding ? 'Processing...' : 'Proceed to payment'}
              </button>

              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full py-4 text-red-600 hover:bg-red-50 rounded-2xl font-medium transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel this booking'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-6">
                This booking is held temporarily. You can cancel anytime before payment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterDiv />
    </div>
  );
};

export default BookingReviewPage;