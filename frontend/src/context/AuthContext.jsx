"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/api/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("checking");

  // authStatus:
  // - "checking"   --> app just loaded, calling /auth/me
  // - "guest"      --> not logged in
  // - "otp_send"   --> OTP sent, waiting for verify
  // - "logged_in"  --> authenticated

  const handleLogout = () => {
    setUser(null);
    setAuthStatus("guest");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.user || null);
        setAuthStatus(res.user ? "logged_in" : "guest");
      } catch (err) {
        setUser(null);
        setAuthStatus("guest");
      }
    };

    checkAuth();
  }, []);

  
  useEffect(() => {
    const handleUnauthorized = () => {
      handleLogout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    }
    handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authStatus, setAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);