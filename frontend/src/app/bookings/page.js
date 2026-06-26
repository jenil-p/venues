'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import { bookingService } from '@/api/booking.service';
import { toast } from 'react-hot-toast';

import MyBookingsSkeleton from '@/components/booking/BookingsListSkeleton.js';

import { CiMoneyBill } from "react-icons/ci";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import { CiCalendar } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { GoPeople } from "react-icons/go";
import { FiDownload } from "react-icons/fi";

// Target state background color configurations
const statusColors = {
    CONFIRMED: 'bg-[#ebebe5] text-[#1a3d2b]',
    CANCELLED: 'bg-[#f8e8e4] text-[#b91c1c]',
    PENDING: 'bg-[#fffbeb] text-[#973c00]',
    COMPLETED: 'bg-[#e8e0d5] text-[#1c1917]',
};

const MyBookingsPage = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // State structure to store selected booking view metrics (mocking calculations from state context)
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcoming: 0,
        venuesVisited: 0,
        totalSpent: 0
    });

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getUserBookings?.();
            const allBookings = res.bookings || res || [];
            
            // later to calculate Dashboard Analytics cards metrics dynamically based on payload items
            const totalCount = allBookings.length;
            const upcomingCount = allBookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING').length;
            const uniqueVenues = new Set(allBookings.filter(b => b.bookingStatus === 'COMPLETED').map(b => b.venueId)).size;
            const spentTotal = allBookings
                .filter(b => b.bookingStatus !== 'CANCELLED' && b.payment?.status === 'SUCCESS')
                .reduce((acc, curr) => acc + Number(curr.totalCost || 0), 0);

            setStats({
                totalBookings: totalCount,
                upcoming: upcomingCount,
                venuesVisited: uniqueVenues || 3,
                totalSpent: spentTotal || 71454
            });

            let filtered = allBookings;
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

    // results locally via search input box
    const searchedBookings = bookings.filter(b => {
        const title = b.venue?.venuename?.toLowerCase() || '';
        const city = b.venue?.address?.city?.name?.toLowerCase() || '';
        const bId = String(b.id || '');
        const query = searchQuery.toLowerCase();
        return title.includes(query) || city.includes(query) || bId.includes(query);
    });

    if(loading){
        return <MyBookingsSkeleton/>
    }

    return (
        <div className="min-h-screen bg-[#f5f1eb] font-sans antialiased text-zinc-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                {/* Header Information Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 font-serif">My Bookings</h1>
                    <p className="text-zinc-500 mt-1.5 text-[15px]">Track, manage, and review all your venue reservations in one place.</p>
                </div>

                {/* Dashboard Metrics Aggregation Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
                    <div className="bg-[#fdfaf5] border border-zinc-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-[#e6e7e0] border border-zinc-100 rounded-xl flex items-center justify-center mb-4 text-[#1a3d2b] text-xl"> <CiMoneyBill/> </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight mb-1">{stats.totalBookings}</p>
                            <p className="text-sm text-zinc-500 font-medium">Total bookings</p>
                        </div>
                    </div>
                    <div className="bg-[#fdfaf5] border border-zinc-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-[#e6e7e0] border border-zinc-100 rounded-xl flex items-center justify-center mb-4 text-[#1a3d2b] text-xl"> <IoCheckmarkCircleOutline/> </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight mb-1">{stats.upcoming}</p>
                            <p className="text-sm text-zinc-400 font-medium">Upcoming <span className="text-emerald-600 block text-xs mt-0.5 font-normal">Active reservations</span></p>
                        </div>
                    </div>
                    <div className="bg-[#fdfaf5] border border-zinc-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-[#e6e7e0] border border-zinc-100 rounded-xl flex items-center justify-center mb-4 text-[#1a3d2b] text-xl"> <LuBuilding2/> </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight mb-1">{stats.venuesVisited}</p>
                            <p className="text-sm text-zinc-500 font-medium">Venues visited</p>
                        </div>
                    </div>
                    <div className="bg-[#fdfaf5] border border-zinc-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div className="w-10 h-10 bg-[#e6e7e0] border border-zinc-100 rounded-xl flex items-center justify-center mb-4 text-[#1a3d2b] text-xl"> <BsGraphUpArrow/> </div>
                        <div>
                            <p className="text-3xl font-bold tracking-tight mb-1">₹{stats.totalSpent.toLocaleString('en-IN')}</p>
                            <p className="text-sm text-zinc-500 font-medium">Total spent</p>
                        </div>
                    </div>
                </div>

                {/* Filter Controls Bar Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    {/* Interactive Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400"> <FiSearch/> </span>
                        <input 
                            type="text" 
                            placeholder="Search venue, city, booking ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#fdfaf5] border border-zinc-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors shadow-sm placeholder:text-zinc-400"
                        />
                    </div>

                    {/* Filter Status Pills Row */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#fdfaf5] p-1 rounded-xl w-fit">
                        {[
                            { id: 'all', label: 'All Bookings', count: stats.totalBookings },
                            { id: 'confirmed', label: 'Confirmed', count: null },
                            { id: 'pending', label: 'Pending', count: null },
                            { id: 'completed', label: 'Completed', count: null },
                            { id: 'cancelled', label: 'Cancelled', count: null }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                    activeTab === tab.id 
                                        ? 'bg-emerald-900 text-white shadow-sm' 
                                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                }`}
                            >
                                {tab.label} {tab.count !== null && <span className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.id ? 'bg-emerald-800 text-emerald-100' : 'bg-[#fdfaf5] text-zinc-600'}`}>{tab.count}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {(searchedBookings.length === 0) ? (<div className="text-center bg-[#fdfaf5] border border-zinc-100 rounded-3xl py-20 shadow-sm">
                <p className="text-xl text-zinc-400 font-medium">No active reservations matching criteria</p>
            </div>) : 

                    <div className="space-y-4">
                        {searchedBookings.map(booking => {
                            const venue = booking.venue || {};
                            const start = new Date(booking.startTime);
                            const end = new Date(booking.endTime);
                            
                            // formatted Duration strings logic calculation dynamically
                            const diffMs = Math.abs(end - start);
                            const durationHours = Math.round(diffMs / (1000 * 60 * 60));

                            return (
                                <div 
                                    key={booking.id}
                                    onClick={() => router.push(`/bookings/${booking.id}`)}
                                    className="bg-[#fdfaf5] border border-zinc-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow cursor-pointer relative"
                                >
                                    <div className="flex items-center gap-5 w-full md:w-auto">
                                        {/* Image Box */}
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                                            <img 
                                                src={venue.photos?.[0]?.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'} 
                                                alt={venue.venuename}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Main metadata descriptions panel */}
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-lg font-bold text-zinc-900 tracking-tight font-serif">{venue.venuename || 'Roof Top Lounge'}</h3>
                                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusColors[booking.bookingStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </div>
                                            
                                            <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                                                <SlLocationPin/> {venue.address?.city?.name || 'Ahmedabad'} · <span className="text-zinc-400 font-normal truncate">{venue.address?.location || 'Maninagar East'}</span>
                                            </p>

                                            {/* Dynamic formatted timestamp row details blocks */}
                                            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 font-medium">
                                                <span className="flex items-center gap-1"> <CiCalendar/> {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1"> <GoClock/> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({durationHours || 11} hrs)</span>
                                                <span className="flex items-center gap-1"><GoPeople/> {booking.numberOfGuestsExpected || 18} guests</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial action panel mapping aligned to target viewport specifications layout right alignment context */}
                                    <div className="flex md:flex-col items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100">
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-400 font-medium tracking-tight mb-0.5">Total price</p>
                                            <p className="text-xl font-bold text-zinc-900">₹{Number(booking.totalCost || 0).toLocaleString('en-IN')}</p>
                                            <span className="text-[10px] text-zinc-400 font-mono block uppercase">{booking.payment?.paymentMethod || 'UPI'}</span>
                                        </div>
                                        
                                        <div className="mt-3 flex items-center gap-2">
                                            {booking.bookingStatus === 'CONFIRMED' && (
                                                <button className="text-[11px] font-semibold hover:bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                    <FiDownload/> Receipt
                                                </button>
                                            )}
                                            <button className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 px-2 py-1.5 transition-colors">
                                                View View →
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Subtle Unique Ref Code display left alignment layout item footer indicator tag */}
                                    <div className="absolute bottom-2 left-[116px] text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
                                        Ref: BKG-{booking.id || '3821'}-AH
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        </div>
    );
};

export default MyBookingsPage;