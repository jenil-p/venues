"use client";
import React, { useState, useEffect, useRef } from "react";
import { authService } from "@/api/auth.service";
import { useAuth } from "@/context/AuthContext";

const LoginVerifyOtp = ({ contactNumber, onBack, onSuccess }) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);
    const { setUser, setAuthStatus } = useAuth();

    useEffect(() => {
        if(inputRef.current) inputRef.current.focus();
    }, []);

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter the complete 6-digit code.");
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
            setError("Incorrect OTP. Please check and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Confirm your number</h2>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-gray-500 text-sm">Enter the code sent to +91 {contactNumber}</p>
                    <button onClick={onBack} className="text-sm font-semibold underline text-gray-900">Edit</button>
                </div>
            </div>

            <div>
                <input
                    ref={inputRef}
                    type="text"
                    maxLength={6}
                    placeholder="- - - - - -"
                    className={`w-full text-center text-3xl tracking-[0.5em] font-bold px-4 py-4 border rounded-xl outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'}`}
                    value={otp}
                    onChange={(e) => {
                         // Allow only numbers
                         const val = e.target.value.replace(/\D/g, '');
                         setOtp(val);
                         setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                />
                 {error && <p className="text-xs text-center text-red-500 mt-3 font-medium">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 mt-2">
                 <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold rounded-xl py-3.5 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                    {loading ? "Verifying..." : "Log in"}
                </button>
                
                <button className="text-sm font-semibold text-gray-600 hover:text-black hover:underline py-2">
                    Resend SMS
                </button>
            </div>
        </div>
    );
};

export default LoginVerifyOtp;