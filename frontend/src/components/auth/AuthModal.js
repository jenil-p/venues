"use client";

import { useState } from "react";
import Modal from "../ui/Modal";

import LoginSendOtp from "./LoginSendOtp";
import LoginVerifyOtp from "./LoginVerifyOtp";
import Signup from "./Signup";

const AuthModal = ({ open, onClose }) => {
  const [step, setStep] = useState("login_phone");
  const [contactNumber, setContactNumber] = useState("");

  const closeAndReset = () => {
    setStep("login_phone");
    setContactNumber("");
    onClose();
  };

  return (
    <Modal open={open} onClose={closeAndReset}>
      {step === "login_phone" && (
        <LoginSendOtp
          onNext={(number) => {
            setContactNumber(number);
            setStep("verify_otp");
          }}
          onSignup={() => setStep("signup")}
        />
      )}

      {step === "verify_otp" && (
        <LoginVerifyOtp
          contactNumber={contactNumber}
          onBack={() => setStep("login_phone")}
          onSuccess={closeAndReset}
        />
      )}

      {step === "signup" && (
        <Signup
          onSuccess={() => setStep("login_phone")}
          onLogin={() => setStep("login_phone")}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
