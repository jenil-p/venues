"use client";

import React, { useEffect, useState, useRef } from "react";
import { IoIosMenu } from "react-icons/io";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import AuthModal from "./auth/AuthModal";

const Navbar = () => {
  let { authStatus, user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Navbar-font w-full fixed top-0 z-50 flex justify-between items-center py-3 px-20 select-none">
      {/* Logo */}
      <div className="logo font-bold text-2xl">
        <Link href="/">Logo</Link>
      </div>

      {/* Center Menu */}
      <div className="menu-items">
        <ul className="flex justify-center items-center gap-10">
          <li>
            <Link href="/properties">Find Venue</Link>
          </li>
          <li>Events & Inspirations</li>
          <li>Booking Guide</li>
          <li>
            <Link href="/host/hostingform">Become a Host</Link>
          </li>
        </ul>
      </div>

      {/* Right User Menu */}
      <div className="relative" ref={menuRef}>
        <div
          className="user backdrop-blur-sm rounded-full px-1 py-0.5 flex justify-center items-center gap-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <IoIosMenu className="w-5 h-auto" />
          <img
            src="/user.png"
            alt="User"
            className="w-6 h-auto rounded-full"
          />
        </div>

        {/* ================= GUEST MENU ================= */}
        {menuOpen && authStatus === "guest" && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 flex flex-col text-[#484848]">
            <button
              className="text-sm font-inter font-semibold hover:bg-gray-100 rounded-md px-3 py-1 text-left"
              onClick={() => {
                setOpenAuth(true);
                setMenuOpen(false);
              }}
            >
              Login
            </button>

            <button
              className="text-sm font-inter hover:bg-gray-100 rounded-md px-3 py-1 text-left"
              onClick={() => {
                setOpenAuth(true);
                setMenuOpen(false);
              }}
            >
              Signup
            </button>

            <button className="text-sm font-inter hover:bg-gray-100 rounded-md px-3 py-1 text-left">
              Help Center
            </button>
          </div>
        )}

        {/* ================= LOGGED-IN MENU ================= */}
        {menuOpen && authStatus === "logged_in" && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-3 flex flex-col">
            <div className="flex flex-col text-[#484848]">
              <Link
                href="/messages"
                className="text-sm hover:bg-gray-100 rounded-md px-2 py-1"
              >
                Messages
              </Link>
              <Link
                href="/notifications"
                className="text-sm hover:bg-gray-100 rounded-md px-2 py-1"
              >
                Notifications
              </Link>
              <Link
                href="/reservations"
                className="text-sm hover:bg-gray-100 rounded-md px-2 py-1"
              >
                Reservations
              </Link>
              <Link
                href="/bookmarks"
                className="text-sm hover:bg-gray-100 rounded-md px-2 py-1"
              >
                Bookmarks
              </Link>
            </div>

            <div className="bg-[#9A9A9A] h-px w-full my-2" />

            <div className="flex flex-col text-xs text-[#484848]">
              <button className="hover:bg-gray-100 rounded-md px-2 py-1 text-left">
                Account
              </button>
              <button className="hover:bg-gray-100 rounded-md px-2 py-1 text-left">
                Help Center
              </button>
              <button
                onClick={logout}
                className="hover:bg-gray-100 rounded-md px-2 py-1 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        <AuthModal
          open={openAuth}
          onClose={() => setOpenAuth(false)}
        />
      </div>
    </div>
  );
};

export default Navbar;
