import React from 'react';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-[#E0E2E6] py-20 px-4 sm:px-8 lg:px-40">
          <h1 className="text-[#484848] font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            <p>Reservation</p>
            <p>Form</p>
          </h1>
        </div>

        {/* Booking Form */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Steps */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mb-12">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#484848] text-white flex items-center justify-center mb-2">1</div>
                <span className="text-sm text-[#484848]">Property</span>
              </div>
              <div className="h-1 flex-grow bg-[#C2C6CC] mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#484848] text-white flex items-center justify-center mb-2">2</div>
                <span className="text-sm text-[#484848]">Personal Data</span>
              </div>
              <div className="h-1 flex-grow bg-[#C2C6CC] mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#484848] text-white flex items-center justify-center mb-2">3</div>
                <span className="text-sm text-[#484848]">Payment</span>
              </div>
            </div>

            {/* Current Step - Payment Details */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#484848] mb-6">Step 3: Payment details</h2>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-6">
                  <label className="block text-[#484848] font-medium mb-2">Name on card</label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Lost"
                    className="w-full p-3 border border-[#C2C6CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#484848]"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[#484848] font-medium mb-2">Card number</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    className="w-full p-3 border border-[#C2C6CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#484848]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[#484848] font-medium mb-2">Valid until</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border border-[#C2C6CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#484848]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#484848] font-medium mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="•••"
                      className="w-full p-3 border border-[#C2C6CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#484848]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#484848] mb-4">House rules</h3>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[#484848] font-medium mb-2">Check-in time</h4>
                    <p className="text-[#9A9A9A]">From 3 PM</p>
                  </div>
                  <div>
                    <h4 className="text-[#484848] font-medium mb-2">Check-out time</h4>
                    <p className="text-[#9A9A9A]">Until 11 AM</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-[#484848] font-medium mb-2">Beware</h4>
                  <ul className="text-[#9A9A9A] space-y-2">
                    <li>• No pets allowed</li>
                    <li>• No smoking</li>
                    <li>• No partying</li>
                  </ul>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#484848] hover:bg-[#333333] text-white py-4 px-6 rounded-lg font-bold text-lg transition duration-200">
              Book now
            </button>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-2xl font-bold text-[#484848] mb-4">Hotel Norrebro ***</h2>
              <p className="text-[#9A9A9A] mb-6">3-star hotel located in the heart of Copenhagen</p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#484848] font-medium">Check-In</span>
                  <span className="text-[#484848]">Friday, 09 December 2022</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#484848] font-medium">Check-out</span>
                  <span className="text-[#484848]">Monday, 12 December 2022</span>
                </div>
              </div>

              <div className="border-t border-[#E0E2E6] pt-6 mb-6">
                <h3 className="text-lg font-semibold text-[#484848] mb-4">Standard double room</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#9A9A9A]">Price per night</span>
                    <span className="text-[#484848]">$180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9A9A]">3 nights</span>
                    <span className="text-[#484848]">$540</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9A9A]">City tax</span>
                    <span className="text-[#484848]">$40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9A9A]">Service fee</span>
                    <span className="text-[#484848]">$20</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E0E2E6] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#484848]">TOTAL</span>
                  <span className="text-xl font-bold text-[#484848]">$600</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterDiv />
    </div>
  );
};

export default page;