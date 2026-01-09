"use client";

import React, { useState } from "react";
import { authService } from "@/api/auth.service";

const Signup = ({ onSuccess, onLogin }) => {
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        contactnumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async () => {
        if (
            !form.fullname ||
            !form.email ||
            form.contactnumber.length !== 10
        ) {
            setError("All fields are required");
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
            setError("Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-[400px]">
            <h3 className="small-semibold-gray mb-6">Create Account</h3>

            <input
                placeholder="Full Name"
                className="w-full border rounded-full px-4 py-2 outline-none mb-3"
                onChange={(e) =>
                    setForm({ ...form, fullname: e.target.value })
                }
            />

            <input
                placeholder="Email"
                type="email"
                className="w-full border rounded-full px-4 py-2 outline-none mb-3"
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
            />

            <div className="flex border rounded-full overflow-hidden mb-4">
                <span className="px-4 py-2 border-r">+91</span>
                <input
                    placeholder="Mobile Number"
                    maxLength={10}
                    className="flex-1 px-4 py-2 outline-none"
                    onChange={(e) =>
                        setForm({ ...form, contactnumber: e.target.value })
                    }
                />
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
                onClick={handleSignup}
                disabled={loading}
                className="bg-[#9A9A9A] text-white rounded-full py-2 w-full font-medium"
            >
                {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-xs text-center mt-4">
                Already have an account?{" "}
                <span
                    onClick={onLogin}
                    className="underline cursor-pointer"
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default Signup;
