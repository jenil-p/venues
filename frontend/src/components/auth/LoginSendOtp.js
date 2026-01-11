"use client";
import React, { useState } from "react";
import { authService } from "@/api/auth.service.js";

const LoginSendOtp = ({ onNext, onSignup }) => {
    const [contactNumber, setContactNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        if (contactNumber.length !== 10) {
            setError("Please enter a valid 10-digit number.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await authService.sendOtp({ contactnumber: `+91${contactNumber}` });
            onNext(contactNumber);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to VenueFinder</h2>
                <p className="text-gray-500 text-sm mt-1">Please enter your details to continue.</p>
            </div>

            <div>
                <div className={`flex items-center border rounded-xl overflow-hidden transition-all duration-200 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black'}`}>
                    <div className="bg-gray-50 px-4 py-3.5 border-r border-gray-300 text-gray-600 font-medium select-none">
                        +91
                    </div>
                    <input
                        type="tel"
                        maxLength={10}
                        autoFocus
                        placeholder="Phone number"
                        className="flex-1 px-4 py-3.5 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                        value={contactNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // Only numbers
                            setContactNumber(val);
                            setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    />
                </div>
                {error && <p className="text-xs text-red-500 mt-2 ml-1 flex items-center gap-1">⚠️ {error}</p>}
            </div>

            <p className="text-xs text-gray-500">
                We'll text you to confirm your number. Standard message and data rates apply.
            </p>

            <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl py-3.5 transition-all active:scale-[0.98] shadow-lg shadow-rose-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Sending Code..." : "Continue"}
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="text-center text-sm">
                <span className="text-gray-600">New here? </span>
                <button onClick={onSignup} className="font-semibold text-gray-900 hover:underline">
                    Create an account
                </button>
            </div>
        </div>
    );
};

export default LoginSendOtp;