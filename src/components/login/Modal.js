import React from 'react'

import { IoClose } from "react-icons/io5";

const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
      <div
        onClick={e => e.stopPropagation()}
        className={`
            bg-white rounded-xl shadow p-6 transition-all 
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
          `}>
          <div onClick={onClose} className="close absolute top-7 right-7 text-[#484848] cursor-pointer text-2xl">
              <IoClose/>
          </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
