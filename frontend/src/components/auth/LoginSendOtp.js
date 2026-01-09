"use client";

import React, { useState } from "react";
import { authService } from "@/api/auth.service.js";

const LoginSendOtp = ({ onNext, onSignup }) => {
    const [contactNumber, setContactNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        if (contactNumber.length !== 10) {
            setError("Please enter a valid 10 digit number");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await authService.sendOtp({
                contactnumber: `+91${contactNumber}`,
            });

            onNext(contactNumber);
        } catch (err) {
            setError("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-[400px]">
            <h3 className="small-semibold-gray mb-6">Login or Signup</h3>

            <div className="flex border rounded-full overflow-hidden p-2 mb-4">
                <span className="px-4 py-2 border-r text-[#484848]">+91</span>
                <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    className="flex-1 px-4 py-2 outline-none"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                />
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-[#9A9A9A] text-white rounded-full py-2 w-full font-medium"
            >
                {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="text-xs text-center mt-4 text-[#484848]">
                Don't have an account?{" "}
                <span
                    onClick={onSignup}
                    className="underline cursor-pointer"
                >
                    Sign up
                </span>
            </p>
        </div>
    );
};

export default LoginSendOtp;
