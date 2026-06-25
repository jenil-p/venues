"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoIosMenu } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./auth/AuthModal";

import { authService } from "@/api/auth.service";
import { providerService } from "@/api/provider.service";

const Navbar = () => {
  const { authStatus, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [role, setRole] = useState("USER");
  const [loadingHost, setLoadingHost] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        // console.error(err);
      }
    }
    setRolefun();
  }, []);

  const handleBecomeHost = async () => {
    if (authStatus !== "logged_in") {
      setOpenAuth(true);
      return;
    }
    setLoadingHost(true);
    try {
      const data = await providerService.getProviderRequestStatus();

      if (data.exists) {
        router.push("/host/status");
        console.log("status", data)
      } else {
        router.push("/host/join");
        console.log("form ", data)
      }
    } catch (error) {
      // console.error("Error checking host status", error);
      router.push("/host/join");
    }
    finally {
      setLoadingHost(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0 h-20">

            {/* Logo */}
            <Link href="/" className="cursor-pointer">
              <h1 className="text-rose-500 font-bold text-2xl">VenueFinder</h1>
            </Link>
            
            {/* Right Section */}
            <div className="flex items-center gap-4 relative" ref={menuRef}>

              {role === "USER" &&
                <div
                  onClick={handleBecomeHost}
                  className="hidden md:block text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  Become a Host
                </div>
              }

              {/* User Menu Dropdown Trigger */}
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 md:py-1 md:px-2 border border-gray-300 rounded-full flex items-center gap-3 cursor-pointer hover:shadow-md transition duration-300 bg-white"
              >
                <IoIosMenu className="text-xl ml-1" />
                <div className="hidden md:block">
                  {/* Fallback to Icon if no photo */}
                  {user?.photo ? (
                    <img src={user.photo} alt="user" className="rounded-full h-8 w-8 object-cover" />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-[200px] bg-white overflow-hidden right-0 top-12 text-sm z-50 animate-in fade-in zoom-in duration-200">
                  <div className="flex flex-col cursor-pointer">

                    {authStatus === "logged_in" ? (
                      <>
                        {role === "ADMIN" && (
                          <>
                            <div
                              className="px-4 py-3 hover:bg-neutral-100 font-bold text-rose-500 flex items-center gap-2 transition"
                              onClick={() => router.push('/admin')}
                            >
                              <MdDashboard /> Admin Panel
                            </div>
                            <hr />
                          </>
                        )}
                        {role === "PROVIDER" && (
                          <>
                            <div
                              className="px-4 py-3 hover:bg-neutral-100 font-bold text-rose-500 flex items-center gap-2 transition"
                              onClick={() => router.push('/host/dashboard')}
                            >
                              <MdDashboard /> Provider Dashboard
                            </div>
                            <hr />
                          </>
                        )}
                        <div className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => router.push('/messages')}>Messages</div>
                        <div className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => router.push('/bookings')}>My Bookings</div>
                        <div className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => router.push('/bookmarks')}>Saved</div>
                        <hr />
                        <div className="px-4 py-3 hover:bg-neutral-100 transition" onClick={logout}>Logout</div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => { setOpenAuth(true); setMenuOpen(false); }}>Login</div>
                        <div className="px-4 py-3 hover:bg-neutral-100 transition" onClick={() => { setOpenAuth(true); setMenuOpen(false); }}>Sign up</div>
                      </>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal Trigger */}
      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
};

export default Navbar;