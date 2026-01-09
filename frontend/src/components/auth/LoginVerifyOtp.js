"use client";

import React, { useState } from "react";
import { authService } from "@/api/auth.service";
import { useAuth } from "@/context/AuthContext";

const LoginVerifyOtp = ({ contactNumber, onBack, onSuccess }) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser, setAuthStatus } = useAuth();

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter a 6 digit OTP");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await authService.verifyOtp({
                contactnumber: `+91${contactNumber}`,
                otp: `${otp}`,
            });

            setUser(res.user);
            setAuthStatus("logged_in");
            onSuccess();
        } catch (err) {
            setError("Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-[400px]">
            <h3 className="small-semibold-gray mb-6">Verify OTP</h3>

            <p className="text-xs mb-4 text-[#484848]">
                OTP sent to <strong>+91 {contactNumber}</strong>
            </p>

            <input
                type="text"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                className="w-full border rounded-full px-4 py-2 outline-none mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-[#9A9A9A] text-white rounded-full py-2 w-full font-medium"
            >
                {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <p
                onClick={onBack}
                className="text-xs text-center mt-4 underline cursor-pointer"
            >
                Change number
            </p>
        </div>
    );
};

export default LoginVerifyOtp;
