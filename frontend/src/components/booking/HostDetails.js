import React from 'react';

import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";


const HostDetails = ({ provider }) => {
  if (!provider) return null;

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-[#EBE6DD] p-8 space-y-6">
      <h3 className="text-xl font-serif text-[#1C1917] font-medium">Your Host</h3>
      
      <div className="flex items-center gap-4">
        <img 
          src={"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} // have to change here
          alt={provider.legalname} 
          className="w-14 h-14 rounded-full object-cover border border-[#EBE6DD]"
        />
        <div>
          <h4 className="text-base font-semibold text-[#1C1917]">{provider.legalname || "Margot Sinclair"}</h4>
          <p className="text-sm text-[#78716C]">Creative Studio & Event Space</p>
        </div>
      </div>

      <div className="space-y-3 pt-2 text-sm text-[#57534E]">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-white border border-[#EBE6DD] rounded-xl text-zinc-500">
            <FiPhone/>
          </span>
          <span>+{provider.contact1 || "1 (415) 823-4901"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="p-2 bg-white border border-[#EBE6DD] rounded-xl text-zinc-500">
            <HiOutlineMail/>
          </span>
          <span>{provider.email || "margot@meridianloft.com"}</span>
        </div>
      </div>

      {/* <button className="w-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#EBE6DD] py-3 px-4 rounded-xl font-medium text-sm transition duration-200 flex items-center justify-center gap-2 shadow-sm">
        <FiMessageSquare/>
        Message Host
      </button> */}
    </div>
  );
};

export default HostDetails;