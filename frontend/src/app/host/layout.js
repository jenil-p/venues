"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { providerService } from "@/api/provider.service";
import { FaHome, FaBuilding, FaConciergeBell, FaCalendarAlt, FaChartPie, FaPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function HostLayout({ children }) {
    const { authStatus, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (authStatus === "logged_out") router.push("/");

        const checkStatus = async () => {
            try {
                const res = await providerService.getProviderRequestStatus();
                if (res?.profile?.status !== 'APPROVED') {
                    router.push('/host/status');
                }
            } catch (e) { console.error(e); }
        };
        if (authStatus === 'logged_in') checkStatus();
    }, [authStatus, router]);

    const navItems = [
        { name: "Overview", href: "/host/dashboard", icon: <MdDashboard /> },
        { name: "My Venues", href: "/host/venues", icon: <FaBuilding /> },
        // { name: "My Services", href: "/host/services", icon: <FaConciergeBell /> },
        { name: "Bookings", href: "/host/bookings", icon: <FaCalendarAlt /> },
        // { name: "Insights", href: "/host/stats", icon: <FaChartPie /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:h-screen md:fixed z-40 flex flex-col justify-between">
                <div>
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
                        <h2 className="text-xl font-bold text-gray-800">Host<span className="text-rose-500">Panel</span></h2>
                    </div>

                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-rose-50 text-rose-600 shadow-sm border border-rose-100"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}>
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <Link href="/">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <FaHome className="text-lg" /> Back to Home
                        </div>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}