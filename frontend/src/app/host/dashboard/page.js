"use client";
import React from "react";
import { FaBuilding, FaWallet, FaStar, FaCalendarCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}-200`}>
                {icon}
            </div>
        </div>
        {subtext && <p className="text-xs text-gray-400 mt-4">{subtext}</p>}
    </div>
);

const HostDashboard = () => {
    const router = useRouter();

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with your listings.</p>
                </div>
                <button
                    onClick={() => router.push('/host/venues/create')}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-black transition transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Create New Listing
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹0"
                    icon={<FaWallet />}
                    color="bg-green-500"
                    subtext="+0% from last month"
                />
                <StatCard
                    title="Active Bookings"
                    value="0"
                    icon={<FaCalendarCheck />}
                    color="bg-rose-500"
                    subtext="0 pending approval"
                />
                <StatCard
                    title="Total Listings"
                    value="0"
                    icon={<FaBuilding />}
                    color="bg-blue-500"
                    subtext="Venues & Services"
                />
                <StatCard
                    title="Average Rating"
                    value="0.0"
                    icon={<FaStar />}
                    color="bg-yellow-400"
                    subtext="Based on 0 reviews"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
                <img src="/empty-state.svg" alt="" className="w-48 h-48 opacity-50 mb-4 grayscale" />
                <h3 className="text-lg font-bold text-gray-800">No Recent Activity</h3>
                <p className="text-gray-500 max-w-sm mt-2">Your dashboard is looking a bit empty. Start by listing your first venue or service to see bookings roll in.</p>
                <button
                    onClick={() => router.push('/host/venues/create')}
                    className="mt-6 text-rose-600 font-semibold hover:text-rose-700 hover:underline"
                >
                    List your first venue &rarr;
                </button>
            </div>
        </div>
    );
};

export default HostDashboard;