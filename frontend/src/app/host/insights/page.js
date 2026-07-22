"use client";

import React, { useEffect, useState } from "react";
import { bookingService } from "../../../api/booking.service.js";
import toast from "react-hot-toast";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LuChevronRight, LuStar } from "react-icons/lu";

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setData(await bookingService.getInsights());
      } catch (error) {
        console.error(error);
        toast.error("Failed to load insights");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#143f2c] border-t-transparent" /></div>;
  }

  const revenueByVenue = data?.revenueByVenue || [];
  const monthlyBookings = data?.monthlyBookings || [];
  const venuePerformance = data?.venuePerformance || [];
  const highestRevenue = Math.max(...venuePerformance.map((venue) => Number(venue.revenue || 0)), 1);

  return (
    <div className="space-y-8 pb-14" style={{ zoom: 0.6667 }}>
      <header className="px-4 pt-4 md:px-0">
        <div className="flex items-center gap-3 text-[17px] text-[#837d76]"><span>Host</span><LuChevronRight className="text-[18px]" /><span className="font-medium text-[#292623]">Insights</span></div>
        <h1 className="mt-4 font-serif text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#201e1c]">Insights</h1>
        <p className="mt-2 text-[20px] text-[#7f7973]">Analytics and performance metrics for your listings.</p>
      </header>

      <section className="grid grid-cols-1 gap-8 px-4 xl:grid-cols-2 md:px-0">
        <article className="min-h-[640px] rounded-[24px] border border-[#dfdcd6] bg-[#fffdfa] p-8">
          <h2 className="font-serif text-[29px] font-semibold tracking-[-0.03em] text-[#201e1c]">Revenue by Venue</h2>
          <p className="mt-2 text-[18px] text-[#837d76]">All-time earnings per listing</p>
          <div className="mt-6 h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByVenue} margin={{ top: 14, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#ebe8e1" strokeDasharray="4 5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 15 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 15 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatAmount(value), "Revenue"]} contentStyle={{ border: "1px solid #dfdcd6", borderRadius: "12px", boxShadow: "0 8px 18px rgba(32, 30, 28, .08)" }} />
                <Bar dataKey="revenue" fill="#143f2c" radius={[12, 12, 0, 0]} barSize={96} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="min-h-[640px] rounded-[24px] border border-[#dfdcd6] bg-[#fffdfa] p-8">
          <h2 className="font-serif text-[29px] font-semibold tracking-[-0.03em] text-[#201e1c]">Monthly Bookings</h2>
          <p className="mt-2 text-[18px] text-[#837d76]">Number of bookings per month</p>
          <div className="mt-6 h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBookings} margin={{ top: 14, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="bookings-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c54c11" stopOpacity={0.18} /><stop offset="100%" stopColor="#c54c11" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#ebe8e1" strokeDasharray="4 5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 15 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 15 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [value, "Bookings"]} contentStyle={{ border: "1px solid #dfdcd6", borderRadius: "12px", boxShadow: "0 8px 18px rgba(32, 30, 28, .08)" }} />
                <Area type="monotone" dataKey="bookings" stroke="#c54c11" strokeWidth={4} fill="url(#bookings-fill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-[24px] border border-[#dfdcd6] bg-[#fffdfa] p-8">
        <h2 className="font-serif text-[29px] font-semibold tracking-[-0.03em] text-[#201e1c]">Venue Performance</h2>
        <div className="mt-7 space-y-5">
          {venuePerformance.length ? venuePerformance.map((venue, index) => {
            const completion = Math.min((Number(venue.revenue || 0) / highestRevenue) * 100, 100);
            return (
              <article key={venue.venueId || index} className="flex items-center gap-5">
                <img src={venue.photo || "https://picsum.photos/id/1015/300/300"} alt={venue.name} className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-5"><p className="truncate text-[18px] font-semibold text-[#292623]">{venue.name}</p><div className="flex shrink-0 items-center gap-4"><span className="text-[17px] font-semibold text-[#292623]">{formatAmount(venue.revenue)}</span><span className="inline-flex items-center gap-1 text-[16px] font-semibold text-[#292623]"><LuStar className="fill-[#ffb800] text-[#ffb800]" />{Number(venue.rating || 0).toFixed(1)}</span></div></div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#ece9e3]"><div className="h-full rounded-full bg-[#143f2c]" style={{ width: `${completion}%` }} /></div>
                </div>
              </article>
            );
          }) : <p className="py-16 text-center text-[17px] text-[#837d76]">No performance data available yet.</p>}
        </div>
      </section>
    </div>
  );
}
