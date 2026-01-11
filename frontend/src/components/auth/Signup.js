"use client";
import React, { useState } from "react";
import { authService } from "@/api/auth.service";

const Signup = ({ onSuccess, onLogin }) => {
    const [form, setForm] = useState({ fullname: "", email: "", contactnumber: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async () => {
        if (!form.fullname || !form.email || form.contactnumber.length !== 10) {
            setError("Please fill in all fields correctly.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await authService.signup({
                fullname: form.fullname,
                email: form.email,
                contactnumber: `+91${form.contactnumber}`,
            });
            onSuccess();
        } catch (err) {
            setError("Failed to create account. User might already exist.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder-gray-400";

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Finish signing up</h2>
                <p className="text-gray-500 text-sm mt-1">Create your profile to start booking.</p>
            </div>

            <div className="flex flex-col gap-4">
                <input
                    placeholder="Full Legal Name"
                    className={inputClass}
                    onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                />
                <input
                    placeholder="Email Address"
                    type="email"
                    className={inputClass}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className={`flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all`}>
                     <div className="bg-gray-50 px-4 py-3.5 border-r border-gray-300 text-gray-600 font-medium select-none">+91</div>
                     <input
                        placeholder="Mobile Number"
                        maxLength={10}
                        className="flex-1 px-4 py-3.5 outline-none bg-transparent"
                        onChange={(e) => setForm({ ...form, contactnumber: e.target.value })}
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md border border-red-100">{error}</div>}

            <div className="text-xs text-gray-500 leading-relaxed">
                By selecting <strong>Agree and continue</strong>, I agree to VenueFinder’s <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </div>

            <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl py-3.5 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-70"
            >
                {loading ? "Creating Profile..." : "Agree and continue"}
            </button>

            <div className="text-center text-sm pt-2">
                <span className="text-gray-600">Already have an account? </span>
                <button onClick={onLogin} className="font-semibold text-gray-900 hover:underline">
                    Log in
                </button>
            </div>
        </div>
    );
};

export default Signup;