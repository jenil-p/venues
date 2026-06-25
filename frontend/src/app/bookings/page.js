'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import { bookingService } from '@/api/booking.service';
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const statusColors = {
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    REFUNDED: 'bg-amber-100 text-amber-700',
};

const MyBookingsPage = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getUserBookings?.()
            console.log(res);
            let filtered = res.bookings || res;

            if (activeTab !== 'all') {
                filtered = filtered.filter(b => b.bookingStatus === activeTab.toUpperCase());
            }

            setBookings(filtered);
        } catch (err) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 mt-24 my-12">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">My Bookings</h1>
                        <p className="text-zinc-600 mt-2">Manage your venue reservations</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b mb-8">
                    {['all', 'confirmed', 'cancelled', 'completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium transition-colors relative ${
                                activeTab === tab 
                                    ? 'text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black' 
                                    : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {tab === 'all' ? 'All Bookings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-zinc-400">No bookings found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map(booking => {
                            const venue = booking.venue;
                            const start = new Date(booking.startTime);
                            const end = new Date(booking.endTime);

                            return (
                                <div 
                                    key={booking.id}
                                    onClick={() => router.push(`/bookings/${booking.id}`)}
                                    className="bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-zinc-100 group"
                                >
                                    <div className="flex gap-8">
                                        {/* Image */}
                                        {venue.photos?.[0] && (
                                            <div className="w-48 h-36 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={venue.photos[0].image} 
                                                    alt={venue.venuename}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-semibold text-zinc-900">{venue.venuename}</h3>
                                                    <p className="text-zinc-500 mt-1 flex items-center gap-1.5">
                                                        <FaMapMarkerAlt className="text-sm" />
                                                        {venue.address?.city?.name}
                                                    </p>
                                                </div>
                                                {getStatusBadge(booking.bookingStatus)}
                                            </div>

                                            <div className="mt-6 grid grid-cols-2 gap-8 text-sm">
                                                <div>
                                                    <p className="text-zinc-500 mb-1">Date</p>
                                                    <p className="font-medium">{start.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-500 mb-1">Time</p>
                                                    <p className="font-medium">
                                                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — 
                                                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-center justify-between">
                                                <div className="text-3xl font-semibold">₹{Number(booking.totalCost).toLocaleString('en-IN')}</div>
                                                <button className="text-sm font-medium text-zinc-500 group-hover:text-black transition-colors">
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <FooterDiv />
        </div>
    );
};

export default MyBookingsPage;