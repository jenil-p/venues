"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FiSearch, FiMessageSquare, FiCalendar, FiBookmark, FiLogOut } from "react-icons/fi";
import { LuLayoutDashboard, LuBuilding2, LuSparkles } from "react-icons/lu";
import { GoShieldCheck } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./auth/AuthModal";

import { authService } from "@/api/auth.service";
import { providerService } from "@/api/provider.service";

// temporary till message thing not implemented (or may be removed :)
const SoonBadge = () => (
  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B7791F] bg-[#FEF3D7] border border-[#FCE8B8] px-2 py-0.5 rounded-full shrink-0">
    <LuSparkles className="text-[10px]" /> Soon
  </span>
);

const MenuRow = ({ icon, title, subtitle, onClick, variant = "default", badge }) => {
  const variantStyles = {
    default: { box: "bg-[#F1EFEA]", icon: "text-gray-500", title: "text-[#1A1A1A]" },
    green: { box: "bg-[#E8F5E9]", icon: "text-[#1C3A27]", title: "text-[#1C3A27]" },
    red: { box: "bg-[#FDEEEE]", icon: "text-[#C83232]", title: "text-[#C83232]" },
  };
  const v = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 hover:bg-[#FAF9F5] transition flex items-center gap-3 text-left"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${v.box}`}>
        <span className={`text-lg flex ${v.icon}`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-semibold text-sm truncate ${v.title}`}>{title}</span>
          {badge}
        </div>
        {subtitle && <span className="text-xs text-gray-400 block truncate mt-0.5">{subtitle}</span>}
      </div>
    </button>
  );
};

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

        if (!user) {
          return;
        }

        const roles = user.roles?.map((role) => role.rolename) || [];

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
        console.log("status", data);
      } else {
        router.push("/host/join");
        console.log("form ", data);
      }
    } catch (error) {
      router.push("/host/join");
    } finally {
      setLoadingHost(false);
    }
  };

  const getInitials = () => {
    if (user?.fullname) {
      const names = user.fullname.split(" ");
      if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    return "EN";
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#f9f8f4] border-b border-[#ECEAE4] h-20 flex items-center shadow-sm">
        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-6 px-4 flex flex-row items-center justify-between gap-4">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-[#1C3A27] text-[#FAF9F5] p-2.5 rounded-xl flex items-center justify-center shadow-sm">
              <LuBuilding2 className="text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A] font-serif">
              Venue<span className="text-[#C85A32]">Finder</span>
            </span>
          </Link>

          {/* Search Bar Segment */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <FiSearch className="absolute left-4 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search venues, cities..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#F1EFEA] border border-[#ECEAE4] rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1C3A27] focus:bg-white transition-all"
            />
          </div>

          {/* Configuration Right Control Actions */}
          <div className="flex items-center gap-5 relative" ref={menuRef}>
            {authStatus === "logged_in" && role === "USER" && (
              <button
                disabled={loadingHost}
                onClick={handleBecomeHost}
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1C3A27] px-3 py-2 rounded-full hover:bg-[#F1EFEA] transition cursor-pointer"
              >
                <LuBuilding2 className="text-base text-gray-500" />
                Become a Host
              </button>
            )}

            {/* Unauthenticated State Action Items */}
            {authStatus !== "logged_in" && (
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => setOpenAuth(true)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => setOpenAuth(true)}
                  className="text-sm font-semibold bg-[#1C3A27] text-white px-5 py-2.5 rounded-full hover:bg-[#152C1E] shadow-sm transition cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Trigger Button Interface */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`py-1.5 pl-3 pr-1.5 border border-[#E1DFD7] rounded-full flex items-center gap-2.5 cursor-pointer hover:shadow-md transition duration-200 bg-white ${
                menuOpen ? "ring-2 ring-[#1C3A27]/20 border-[#1C3A27]" : ""
              }`}
            >
              {menuOpen ? (
                <IoClose className="text-xl text-gray-700" />
              ) : (
                <IoIosMenu className="text-xl text-gray-700" />
              )}

              <div className="flex items-center justify-center">
                {authStatus === "logged_in" ? (
                  user?.photo ? (
                    <img src={user.photo} alt="user profile picture" className="rounded-full h-8 w-8 object-cover border border-gray-100" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#1C3A27] text-[#FAF9F5] font-semibold text-xs flex items-center justify-center tracking-wider">
                      {getInitials()}
                    </div>
                  )
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Box Shell Element */}
            {menuOpen && (
              <div className="absolute rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#EAE8E0] w-[300px] bg-white overflow-hidden right-0 top-14 text-sm z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">

                {/* Header Context User block */}
                {authStatus === "logged_in" ? (
                  <div className="p-4 bg-[#FBFBFA] border-b border-[#F1EFEA] flex items-center gap-3">
                    {user?.photo ? (
                      <img src={user.photo} alt="user avatar image" className="rounded-full h-11 w-11 object-cover" />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-[#1C3A27] text-white font-semibold text-sm flex items-center justify-center shadow-inner">
                        {getInitials()}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 truncate">{user?.fullname || "Elliot Nakamura"}</span>
                      <span className="text-xs text-gray-400 truncate mb-1">{user?.email || "elliot@email.com"}</span>

                      {role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 self-start bg-[#F3E8FF] text-[#6B21A8] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#E9D5FF]">
                          <GoShieldCheck className="text-xs" /> Admin
                        </span>
                      )}
                      {role === "PROVIDER" && (
                        <span className="inline-flex items-center gap-1 self-start bg-[#FDF2E9] text-[#C85A32] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#FBE5D3]">
                          <LuBuilding2 className="text-xs" /> Host
                        </span>
                      )}
                      {role === "USER" && (
                        <span className="inline-flex items-center gap-1 self-start bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Member
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FBFBFA] border-b border-[#F1EFEA]">
                    <h4 className="font-bold text-base text-[#1A1A1A]">Welcome to VenueFinder</h4>
                    <p className="text-xs text-gray-400 mt-1">Sign in to manage your bookings and saved venues.</p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button onClick={() => { setOpenAuth(true); setMenuOpen(false); }} className="w-full text-center text-xs font-semibold py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition">Log in</button>
                      <button onClick={() => { setOpenAuth(true); setMenuOpen(false); }} className="w-full text-center text-xs font-semibold py-2.5 rounded-lg bg-[#1C3A27] text-white hover:bg-[#152C1E] transition">Sign up</button>
                    </div>
                  </div>
                )}

                {/* Main Navigation Segment Items */}
                <div className="py-1.5 flex flex-col">
                  {authStatus === "logged_in" && (
                    <>
                      {role === "ADMIN" && (
                        <MenuRow
                          icon={<GoShieldCheck />}
                          title="Admin Panel"
                          subtitle="Manage platform & users"
                          variant="green"
                          onClick={() => { router.push('/admin'); setMenuOpen(false); }}
                        />
                      )}

                      {role === "PROVIDER" && (
                        <MenuRow
                          icon={<LuLayoutDashboard />}
                          title="Provider Dashboard"
                          subtitle="Manage your venues"
                          variant="green"
                          onClick={() => { router.push('/host/dashboard'); setMenuOpen(false); }}
                        />
                      )}

                      {role === "USER" && (
                        <MenuRow
                          icon={<LuBuilding2 />}
                          title="Become a Host"
                          subtitle="List your venue with us"
                          onClick={() => { handleBecomeHost(); setMenuOpen(false); }}
                        />
                      )}

                      <MenuRow
                        icon={<FiMessageSquare />}
                        title="Messages"
                        subtitle="Chat with hosts"
                        badge={<SoonBadge />}
                        onClick={() => { router.push('/messages'); setMenuOpen(false); }}
                      />

                      <MenuRow
                        icon={<FiCalendar />}
                        title="My Bookings"
                        subtitle="Upcoming & past reservations"
                        onClick={() => { router.push('/bookings'); setMenuOpen(false); }}
                      />

                      <MenuRow
                        icon={<FiBookmark />}
                        title="Saved"
                        subtitle="Your bookmarked venues"
                        onClick={() => { router.push('/my-wishlists'); setMenuOpen(false); }}
                      />
                    </>
                  )}

                  {authStatus !== "logged_in" && (
                    <MenuRow
                      icon={<LuBuilding2 />}
                      title="List your venue"
                      subtitle="Start earning with VenueFinder"
                      onClick={() => { handleBecomeHost(); setMenuOpen(false); }}
                    />
                  )}
                </div>

                {/* Lower Dropdown Action Block Segment */}
                {authStatus === "logged_in" && (
                  <div className="border-t border-[#F1EFEA] py-1.5">
                    <MenuRow
                      icon={<FiLogOut />}
                      title="Log out"
                      variant="red"
                      onClick={() => { logout(); setMenuOpen(false); }}
                    />
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal Trigger */}
      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
};

export default Navbar;