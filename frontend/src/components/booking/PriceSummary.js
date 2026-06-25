import React from 'react';

const PriceSummary = ({ booking, isPendingPayment, proceeding, timeLeft, handleProceedToPayment, handleCancel, cancelling }) => {
  const isHourly = booking.pricePerUnit?.unit === 'HOURLY' || true;
  
  // Breakdown calculations based on provided UI data mapping
  const total = Number(booking.totalCost || 0);
  const baseCost = total - 180 - 330 - 495; // Deduced values from design mockup

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-[#EBE6DD] p-8 space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-[#1C1917] font-medium">Price Summary</h3>
      </div>

      <div className="space-y-4 text-base text-[#57534E]">
        <div className="flex justify-between font-mono">
          <span>₹{Number(booking.pricePerUnit || 420).toLocaleString('en-IN')} × {booking.durationHours || 13} hrs</span>
          <span className="text-[#1C1917] font-semibold">₹{baseCost > 0 ? baseCost.toLocaleString('en-IN') : "5,460"}</span>
        </div>

        {/* This section Is Yet to make dynamic... */}
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span className="text-[#1C1917]">₹180</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span className="text-[#1C1917]">₹330</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes (8.625%)</span>
          <span className="text-[#1C1917]">₹495</span>
        </div>
      </div>

      <div className="pt-6 border-t border-[#EBE6DD] flex justify-between items-baseline">
        <span className="text-xl font-medium text-[#1C1917]">Total</span>
        <span className="text-2xl font-bold text-[#1C1917]">₹{total.toLocaleString('en-IN')}</span>
      </div>

      <div className="pt-2">
        <p className="text-xs font-mono tracking-wider uppercase text-[#A8A29E] mb-1">GUEST</p>
        <p className="text-base font-medium text-[#1C1917]">Elliot Nakamura</p>
        <p className="text-sm text-[#78716C]">elliot.nakamura@email.com</p>
      </div>

      {/* Till here one ... */}

      <div className="space-y-3 pt-2">
        {["PENDING_PAYMENT", "CART"].includes(booking.bookingStatus) && (
          <>
            <button
              onClick={handleProceedToPayment}
              disabled={proceeding || timeLeft === 'Expired'}
              className="w-full flex items-center justify-center gap-2 bg-[#122B1E] hover:bg-[#1A3D2B] text-white py-4 px-6 rounded-2xl font-semibold text-base transition duration-200 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {proceeding ? 'Processing...' : `Proceed to Payment • ₹${total.toLocaleString('en-IN')}`}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full bg-white hover:bg-[#F5F2EB] text-[#57534E] border border-[#EBE6DD] py-4 px-6 rounded-2xl font-medium text-base transition duration-200"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </>
        )}

        {booking.bookingStatus === 'CONFIRMED' && (
          <button 
          onClick={handleCancel}
          className="w-full bg-white hover:bg-[#F5F2EB] text-[#57534E] border border-[#EBE6DD] py-4 px-6 rounded-2xl font-medium text-base transition duration-200">
            Cancel Booking
          </button>
        )}

        {booking.bookingStatus === 'CANCELLED' && (
          <>
            <button disabled className="w-full bg-[#EBE6DD] text-[#A8A29E] py-4 px-6 rounded-2xl font-medium text-base cursor-not-allowed">
              Booking Cancelled
            </button>
            <button 
            onClick={()=>window.location.href = `/properties/${booking.venueId}/`}
            className="w-full bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#EBE6DD] py-4 px-6 rounded-2xl font-medium text-base transition duration-200 flex items-center justify-center gap-1">
              Book This Venue Again <span>&rarr;</span>
            </button>
          </>
        )}
      </div>

      {booking.bookingStatus === 'PENDING_PAYMENT' && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#78716C] font-mono">
          <span className="w-3 h-3 border border-[#78716C] rounded-full text-[8px] flex items-center justify-center">✓</span>
          Secured by 256-bit encryption
        </div>
      )}
    </div>
  );
};

export default PriceSummary;