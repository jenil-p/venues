"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "../../../api/booking.service.js"
import { getAllVenues, providerService } from "../../../api/provider.service.js"
import toast from "react-hot-toast";
import { FaWallet, FaCalendarCheck, FaBuilding, FaStar } from "react-icons/fa";

const StatCard = ({ title, value, subtext, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} text-white`}>
                {icon}
            </div>
        </div>
        {subtext && <p className="text-xs text-gray-400 mt-4">{subtext}</p>}
        {trend && <p className="text-xs text-green-600 mt-1">↑ {trend}</p>}
    </div>
);

const HostDashboard = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await bookingService.getDashboardOverview();
                const venues = await providerService.getAllVenues();
                console.log(res);
                setData(res);
                setVenues(venues);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    const stats = data?.stats || {};
    const upcoming = data?.upcoming || [];
    const recent = data?.recentBookings || [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back! Here's what's happening with your listings.</p>
                </div>
                <button 
                    onClick={() => router.push('/host/venues/create')}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
                >
                    + Create New Listing
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${Number(stats.totalRevenue || 0).toLocaleString()}`} subtext="All time earnings" icon={<FaWallet size={28}/>} color="bg-green-500" trend={stats.revenueGrowth} />
                <StatCard title="Active Bookings" value={stats.activeBookings || 0} subtext={`${stats.pendingBookings || 0} pending approval`} icon={<FaCalendarCheck size={28}/>} color="bg-rose-500" />
                <StatCard title="Total Listings" value={stats.totalListings || 0} subtext="Venues & Services" icon={<FaBuilding size={28}/>} color="bg-blue-500" />
                <StatCard title="Average Rating" value={stats.avgRating?.toFixed(1) || "0.0"} subtext={`Based on ${stats.totalReviews || 0} reviews`} icon={<FaStar size={28}/>} color="bg-yellow-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-gray-100">
                    <div className="flex justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-xl">Revenue Trend</h2>
                            <p className="text-sm text-gray-500">Monthly earnings • 2025</p>
                        </div>
                    </div>
                    {/* Yet to come ... */}
                    <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed">Revenue Trend Chart (Coming soon... ) </div>
                </div>

                {/* Upcoming */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-bold">Upcoming</h3>
                        <button onClick={() => router.push('/host/bookings')} className="text-sm text-rose-600 hover:underline">View all</button>
                    </div>
                    {upcoming.map(b => (
                        <div key={b.id} className="py-4 border-b last:border-0">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{b.user?.fullname}</p>
                                    <p className="text-sm text-gray-500">{b.venue?.venuename}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs ${b.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {b.bookingStatus}
                                </div>
                            </div>
                            <p className="text-sm mt-1">₹{Number(b.totalCost).toLocaleString()} • {new Date(b.startTime).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent + Venues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-bold">Recent Bookings</h3>
                        <button onClick={() => router.push('/host/bookings')} className="text-rose-600 text-sm hover:underline">All bookings →</button>
                    </div>
                    {recent.map(b => (
                        <div key={b.id} className="flex justify-between py-4 border-b last:border-0 items-center">
                            <div className="flex gap-4">
                                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm">
                                    {b.user?.fullname?.substring(0,2)}
                                </div>
                                <div>
                                    <p className="font-medium">{b.user?.fullname}</p>
                                    <p className="text-sm text-gray-500">{b.venue?.venuename}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{Number(b.totalCost).toLocaleString()}</p>
                                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">{b.bookingStatus}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* My Venues Summary */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-bold">My Venues</h3>
                        <button onClick={() => router.push('/host/venues')} className="text-rose-600 text-sm hover:underline">Manage →</button>
                    </div>
                    {venues.venues?.slice(0,3).map(v => (
                        <div key={v.id} className="flex gap-4 py-4 border-b last:border-0">
                            <img src={v.photos?.[0]?.image} className="w-16 h-16 object-cover rounded-lg" alt=""/>
                            <div className="flex-1">
                                <p className="font-medium">{v.venuename}</p>
                                <p className="text-sm text-gray-500">{v.address.location}, {v.address.city.name}</p>
                                <p className="text-sm text-gray-500">{v.capacity} Guests</p>
                            </div>
                            <div>
                                <p className="text-right">{v.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;