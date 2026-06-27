"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/api/booking.service.js";
import toast from "react-hot-toast";
import { FaEye, FaSearch } from "react-icons/fa";

const statusColors = {
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-red-100 text-red-700",
    PENDING: "bg-amber-100 text-amber-700",
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
};

const BookingsPage = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getBookings();
            const resData = res || {};
            const allBookings = resData.bookings || [];

            setBookings(allBookings || []);
            setFilteredBookings(allBookings || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = [...bookings];

        if (activeTab !== "All") {
            result = result.filter(b => b.bookingStatus === activeTab);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b =>
                b.user?.fullname?.toLowerCase().includes(term) ||
                b.venue?.venuename?.toLowerCase().includes(term) ||
                String(b.id).includes(term)
            );
        }

        setFilteredBookings(result);
    }, [bookings, activeTab, searchTerm]);

    const totalBookings = bookings.length;
    const confirmed = bookings.filter(b => b.bookingStatus === "CONFIRMED").length;
    const pending = bookings.filter(b => ["PENDING", "PENDING_PAYMENT"].includes(b.bookingStatus)).length;
    const completed = bookings.filter(b => b.bookingStatus === "COMPLETED").length;
    const cancelled = bookings.filter(b => b.bookingStatus === "CANCELLED").length;
    const totalEarned = bookings
        .filter(b => ["CONFIRMED", "COMPLETED"].includes(b.bookingStatus))
        .reduce((sum, b) => sum + Number(b.totalCost || 0), 0);

    const tabs = [
        { label: "All", count: totalBookings, key: "All" },
        { label: "Confirmed", count: confirmed, key: "CONFIRMED" },
        { label: "Pending", count: pending, key: "PENDING" },
        { label: "Completed", count: completed, key: "COMPLETED" },
        { label: "Cancelled", count: cancelled, key: "CANCELLED" },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    Host <span className="text-gray-300">›</span> Bookings
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                <p className="text-gray-500">All reservations made across your venues and services.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500">Total bookings</p>
                    <p className="text-4xl font-bold mt-2">{totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500">Confirmed</p>
                    <p className="text-4xl font-bold mt-2">{confirmed}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500">Pending review</p>
                    <p className="text-4xl font-bold mt-2">{pending}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500">Earned (filtered)</p>
                    <p className="text-4xl font-bold mt-2">₹{totalEarned.toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.key
                                ? "bg-gray-900 text-white"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label} <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{tab.count}</span>
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search guest, venue, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400"
                    />
                    <FaSearch className="absolute left-4 top-4 text-gray-400" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="px-8 py-5 font-medium">GUEST &amp; VENUE</th>
                                <th className="px-6 py-5 font-medium">DATE &amp; TIME</th>
                                <th className="px-6 py-5 font-medium">GUESTS</th>
                                <th className="px-6 py-5 font-medium">AMOUNT</th>
                                <th className="px-6 py-5 font-medium">STATUS</th>
                                <th className="px-6 py-5 font-medium text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                {booking.user?.fullname?.substring(0, 2).toUpperCase() || "???"}
                                            </div>
                                            <div>
                                                <p className="font-medium">{booking.user?.fullname}</p>
                                                <p className="text-sm text-gray-500">{booking.venue?.venuename}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm">
                                        {new Date(booking.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}<br />
                                        <span className="text-gray-500">
                                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                            {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-1.5">
                                            👥 {booking.numberOfGuestsExpected}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-semibold">
                                        ₹{Number(booking.totalCost).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${statusColors[booking.bookingStatus] || "bg-gray-100"}`}>
                                            {booking.bookingStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => router.push(`/host/bookings/${booking.id}`)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBookings.length === 0 && !loading && (
                    <div className="py-20 text-center text-gray-400">
                        No bookings found
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsPage;