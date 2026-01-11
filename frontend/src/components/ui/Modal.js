"use client";
import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

const Modal = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [open]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Log in or sign up</h3>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-100 transition text-gray-800"
            >
                <IoClose size={20} />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;