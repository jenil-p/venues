"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/auth.service";
import { FaUserShield, FaBuilding, FaConciergeBell, FaUsersCog, FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }) {
    const { authStatus, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [role, setRole] = useState("USER");

    useEffect(() => {
        async function setRolefun() {
          try {
            const { user } = await authService.getMe();
    
            if(!user){ // if no user (not logged in), then there is no way we are setting any role...
              return;
            }
    
            const roles = user.roles?.map(role => role.rolename) || [];
    
            if (roles.includes("ADMIN")) {
              setRole("ADMIN");
            } else if (roles.includes("PROVIDER")) {
              setRole("PROVIDER");
            } else {
              setRole("USER");
            }
          } catch (err) {
            console.error(err);
          }
        }
        setRolefun();
      }, []);

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <MdDashboard /> },
        { name: "Providers", href: "/admin/providers", icon: <FaUserShield /> },
        { name: "Venues", href: "/admin/venues", icon: <FaBuilding /> },
        { name: "Services", href: "/admin/services", icon: <FaConciergeBell /> },
        { name: "Roles", href: "/admin/roles", icon: <FaUsersCog /> },
    ];

    return (
        <>
            <Navbar/>
            <div className="min-h-screen bg-[#fdfaf5] flex flex-col mt-20 md:flex-row">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-[#1a3d2b] border-r border-gray-200 md:h-screen md:fixed z-40">
                    <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                        <h2 className="text-xl font-bold text-[#fdfaf5]">Admin<span className="text-[#bf4a1a]">Panel</span></h2>
                    </div>

                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-[#3c5a4b] text-[#fffff4] shadow-sm"
                                        : "text-[#9da99e] hover:bg-[#2c4c3c] hover:text-[#fffff4]"
                                        }`}>
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}

                        <div className="my-4 border-t border-[#fdfaf5]"></div>

                        <Link href="/">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#9da99e] hover:bg-[#2c4c3c] hover:text-[#fffff4] transition-all">
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
        </>

    );
}