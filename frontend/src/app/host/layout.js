"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { providerService } from "@/api/provider.service";
import {
    LuArrowUpRight,
    LuBuilding2,
    LuCalendarDays,
    LuLayoutDashboard,
    LuMenu,
    LuSparkles,
    LuWrench,
} from "react-icons/lu";
import { FaRegChartBar } from "react-icons/fa";


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
        { name: "Overview", href: "/host/dashboard", icon: <LuLayoutDashboard /> },
        { name: "My Venues", href: "/host/venues", icon: <LuBuilding2 /> },
        { name: "My Services", href: "/host/services", icon: <LuWrench />, badge: "Soon" },
        { name: "Bookings", href: "/host/bookings", icon: <LuCalendarDays />, badge: "2", notification: true },
        { name: "Insights", href: "/host/insights", icon: <FaRegChartBar /> },
    ];

    return (
        <div className="min-h-screen bg-[#f8f6f2] flex flex-col md:flex-row font-sans">
            <aside className="w-full md:w-[250px] bg-[#1a3d2b] text-[#88978b] md:h-screen md:fixed z-40 flex flex-col justify-between">
                <div>
                    <div className="h-[94px] px-6 border-b border-white/10 flex items-center justify-between">
                        <Link href="/host/dashboard" className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#315c49] flex items-center justify-center">
                                <LuBuilding2 className="text-xl text-[#f7f6f1]" />
                            </div>
                            <h2 className="font-serif text-lg font-semibold tracking-[-0.03em] text-[#f8f6f1]">
                                Host<span className="text-[#e3572d]">Panel</span>
                            </h2>
                        </Link>
                    </div>

                    <nav className="px-3 py-5 space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex mb-1 min-h-[40px] items-center gap-4 px-5 rounded-lg text-sm font-semibold transition-colors duration-200 ${isActive
                                        ? "bg-[#3c6754] text-[#fbfaf7]"
                                        : "text-[#a2b4ab] hover:bg-[#244e3a] hover:text-[#f8f6f1]"
                                        }`}>
                                        <span className="text-md leading-none">{item.icon}</span>
                                        <span>{item.name}</span>
                                        {item.badge && (
                                            <span className={`ml-auto inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${item.notification
                                                ? "min-w-7 bg-[#ffbe0b] text-[#26402f]"
                                                : "bg-[#665126] text-[#f7f0df]"
                                                }`}>
                                                {item.badge === "Soon" && <LuSparkles className="mr-1 text-[11px]" />}
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-2 py-2 border-t border-white/10">
                    <Link href="/">
                        <div className="flex min-h-[40px] items-center gap-4 px-5 rounded-lg text-[18px] font-semibold text-[#88978b] hover:bg-[#244e3a] hover:text-[#f8f6f1] transition-colors">
                            <LuArrowUpRight className="text-[23px]" /> Back to Home
                        </div>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 md:ml-[250px] p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
