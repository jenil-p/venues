"use client"

import React, { useEffect, useState, useRef } from 'react'
import { IoIosMenu } from "react-icons/io";

import Link from 'next/link';

import Model from './login/Modal';
import LoginS1 from './login/LoginS1';
import LoginS2 from './login/LoginS2';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [isLogin, setIsLogin] = useState(false);


    const NonLogedinUser = [
        { name: "login", location: "/login" },
        { name: "Signup", location: "/Signup" },
    ];

    const LogedinUser = [
        { name: "Messages", location: "/messages" },
        { name: "Notifications", location: "/notifications" },
        { name: "Reservations", location: "/reservations" },
        { name: "Bookmarks", location: "/bookmarks" },
    ];

    const host = [
        { name: "Messages", location: "/messages" },
        { name: "Notifications", location: "/notifications" },
        { name: "Properties", location: "/properties" },
        { name: "Reservations", location: "/reservations" },
        { name: "Transaction History", location: "/transactions" },
    ]

    const servicePriovider = [
        { name: "Messages", location: "/messages" },
        { name: "Notifications", location: "/notifications" },
        { name: "Services", location: "/services" },
        { name: "Orders", location: "/orders" },
        { name: "Transaction History", location: "/transactions" },
    ]

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
        <div className='Navbar-font w-full fixed top-0 z-50 flex justify-between items-center py-3 px-20 select-none'>
            <div className="logo font-bold text-2xl"><a href="/">Logo</a></div>
            <div className='menu-items'>
                <ul className='flex justify-center items-center gap-10'>
                    <li><Link href={'/properties'}>Find Venue</Link></li>
                    <li>Events & Inspirations</li>
                    <li>Booking Guide</li>
                    <li><Link href={'/host/hostingform'}>Become a Host</Link></li>
                </ul>
            </div>

            <div className="relative" ref={menuRef}>
                <div className="user backdrop-blur-sm rounded-full px-1 py-0.5 flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}>
                    <IoIosMenu className='w-5 h-auto' />
                    <img src="/user.png" alt="User" className='w-6 h-auto rounded-full' />
                </div>

                {/* {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 flex flex-col text-[#484848]">
                        <button className="text-sm font-inter font-semibold hover:bg-gray-100 rounded-md px-3 py-1 text-left">Sign Up</button>
                        <button
                            className="text-sm font-inter hover:bg-gray-100 rounded-md px-3 py-1 text-left"
                            onClick={() => { setOpenLogin(true); setMenuOpen(!menuOpen) }}
                        >
                            Login
                        </button>
                        <button className="text-sm font-inter hover:bg-gray-100 rounded-md px-3 py-1 text-left">Help Center</button>
                    </div>
                )} */}
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 flex flex-col justify-center ">
                        <div className='flex justify-center items-start flex-col text-[#484848]'>
                            {LogedinUser.map((item, index) => {
                                return (
                                    <button key={index} className="text-sm font-inter hover:bg-gray-100 rounded-md px-2 py-1 text-left">
                                        <Link href={item.location}>
                                            {item.name}
                                        </Link>
                                    </button>
                                )
                            })}
                        </div>
                        <div className='bg-[#9A9A9A] h-px w-3/4 my-2 text-center'></div>
                        <div className='flex justify-center items-start flex-col text-xs font-inter text-[#484848]'>
                            <button className="hover:bg-gray-100 rounded-md px-2 py-1 text-left">Account</button>
                            <button className="hover:bg-gray-100 rounded-md px-2 py-1 text-left">Help Center</button>
                            <button className="hover:bg-gray-100 rounded-md px-2 py-1 text-left">Logout</button>
                        </div>
                    </div>
                )}
                <Model open={openLogin} onClose={() => setOpenLogin(false)}>
                    {/* <LoginS1/> */}
                    <LoginS2 />
                </Model>
            </div>
        </div>
    )
}

export default Navbar
