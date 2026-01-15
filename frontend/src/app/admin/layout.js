"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/auth.service";
import { FaUserShield, FaBuilding, FaConciergeBell, FaUsersCog, FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function AdminLayout({ children }) {
    const { authStatus, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (authStatus === "logged_out") {
            router.push("/");
        }
        const checkAdmin = async () => {
            try {
                const data = await authService.checkIfAdmin();
                if (!data.isAdmin) router.push("/");
            } catch (e) {
                router.push("/");
            }
        };
        if (authStatus === "logged_in") checkAdmin();
    }, [authStatus, router]);

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <MdDashboard /> },
        { name: "Providers", href: "/admin/providers", icon: <FaUserShield /> },
        { name: "Venues", href: "/admin/venues", icon: <FaBuilding /> },
        { name: "Services", href: "/admin/services", icon: <FaConciergeBell /> },
        { name: "Roles", href: "/admin/roles", icon: <FaUsersCog /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:h-screen md:fixed z-40">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">Admin<span className="text-rose-500">Panel</span></h2>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-rose-50 text-rose-600 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}>
                                    <span className="text-lg">{item.icon}</span>
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}

                    <div className="my-4 border-t border-gray-100"></div>

                    <Link href="/">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
                            <FaHome className="text-lg" /> Back to Site
                        </div>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8">
                {children}
            </main>
        </div>
    );
}