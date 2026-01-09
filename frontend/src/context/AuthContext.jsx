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


  useEffect(() => {
    authService
      .getMe()
      .then((res) => {
        setUser(res);
        setAuthStatus("logged_in");
      })
      .catch(() => {
        setUser(null);
        setAuthStatus("guest");
      });
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAuthStatus("guest");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, authStatus, setAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
