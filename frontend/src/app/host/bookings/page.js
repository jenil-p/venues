"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/api/booking.service.js";
import toast from "react-hot-toast";
import {
  LuChevronDown,
  LuChevronRight,
  LuCircleAlert,
  LuCircleX,
  LuClock3,
  LuEye,
  LuSearch,
  LuUsers,
} from "react-icons/lu";
import { RxCheckCircled } from "react-icons/rx";

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const statusDetails = (status) => {
  if (status === "CONFIRMED") return { label: "Confirmed", icon: RxCheckCircled, className: "border-[#b9c8bd] bg-[#e7ebe4] text-[#204b38]" };
  if (status === "COMPLETED") return { label: "Completed", icon: LuClock3, className: "border-[#d6cec0] bg-[#e9e3d9] text-[#827a70]" };
  if (status === "CANCELLED") return { label: "Cancelled", icon: LuCircleX, className: "border-[#f2b8b0] bg-[#fff0ee] text-[#c83326]" };
  return { label: "Pending", icon: LuCircleAlert, className: "border-[#ffd46b] bg-[#fffaf0] text-[#c75808]" };
};

const StatusPill = ({ status }) => {
  const details = statusDetails(status);
  const Icon = details.icon;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[14px] font-semibold ${details.className}`}><Icon className="text-[15px]" />{details.label}</span>;
};

const SummaryCard = ({ label, value }) => (
  <article className="flex h-[160px] flex-col justify-center rounded-[22px] border border-[#dfdcd6] bg-[#fffdfa] px-6">
    <p className="text-[17px] text-[#817a73]">{label}</p>
    <p className="mt-3 font-serif text-[30px] font-semibold leading-none text-[#24211f]">{value}</p>
  </article>
);

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getBookings();
        setBookings(response?.bookings || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const counts = useMemo(() => ({
    all: bookings.length,
    confirmed: bookings.filter((booking) => booking.bookingStatus === "CONFIRMED").length,
    pending: bookings.filter((booking) => ["PENDING", "PENDING_PAYMENT"].includes(booking.bookingStatus)).length,
    completed: bookings.filter((booking) => booking.bookingStatus === "COMPLETED").length,
    cancelled: bookings.filter((booking) => booking.bookingStatus === "CANCELLED").length,
  }), [bookings]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const matchesTab = activeTab === "ALL" || (activeTab === "PENDING" ? ["PENDING", "PENDING_PAYMENT"].includes(booking.bookingStatus) : booking.bookingStatus === activeTab);
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || booking.user?.fullname?.toLowerCase().includes(term) || booking.venue?.venuename?.toLowerCase().includes(term) || String(booking.id).includes(term);
    return matchesTab && matchesSearch;
  }), [activeTab, bookings, searchTerm]);

  const earned = bookings.filter((booking) => ["CONFIRMED", "COMPLETED"].includes(booking.bookingStatus)).reduce((total, booking) => total + Number(booking.totalCost || 0), 0);
  const tabs = [
    { label: "All", value: "ALL", count: counts.all },
    { label: "Confirmed", value: "CONFIRMED", count: counts.confirmed },
    { label: "Pending", value: "PENDING", count: counts.pending },
    { label: "Completed", value: "COMPLETED", count: counts.completed },
    { label: "Cancelled", value: "CANCELLED", count: counts.cancelled },
  ];

  return (
    <div className="space-y-8 pb-14" style={{ zoom: 0.6667 }}>
      <header className="px-4 pt-4 md:px-0">
        <div className="flex items-center gap-3 text-[17px] text-[#837d76]"><span>Host</span><LuChevronRight className="text-[18px]" /><span className="font-medium text-[#292623]">Bookings</span></div>
        <h1 className="mt-4 font-serif text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#201e1c]">Bookings</h1>
        <p className="mt-2 text-[20px] text-[#7f7973]">All reservations made across your venues and services.</p>
      </header>

      <section className="grid grid-cols-1 gap-5 px-4 md:grid-cols-2 xl:grid-cols-4 md:px-0">
        <SummaryCard label="Total bookings" value={counts.all} />
        <SummaryCard label="Confirmed" value={counts.confirmed} />
        <SummaryCard label="Pending review" value={counts.pending} />
        <SummaryCard label="Earned (filtered)" value={formatAmount(earned)} />
      </section>

      <section className="flex flex-col justify-between gap-5 px-4 md:flex-row md:items-center md:px-0">
        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`inline-flex h-[60px] items-center gap-2 rounded-full px-4 text-[17px] font-medium transition-colors ${isActive ? "bg-[#143f2c] text-[#fffdfa]" : "text-[#7f7973] hover:bg-[#ece9e3]"}`}><span>{tab.label}</span><span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[13px] ${isActive ? "bg-white/20" : "bg-[#e9e6df]"}`}>{tab.count}</span></button>;
          })}
        </div>
        <label className="flex h-[72px] w-full max-w-[480px] items-center gap-3 rounded-[20px] border border-[#dfdcd6] bg-[#fffdfa] px-5 text-[#837d76]">
          <LuSearch className="text-[21px]" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search guest, venue, ID..." className="w-full bg-transparent text-[17px] outline-none placeholder:text-[#98918a]" />
        </label>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#dfdcd6] bg-[#fffdfa]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1360px] border-collapse">
            <thead className="border-b border-[#dfdcd6] bg-[#f4f1eb] text-left">
              <tr className="text-[16px] font-semibold uppercase tracking-wide text-[#7f7973]">
                <th className="px-6 py-5">Guest &amp; Venue</th><th className="px-6 py-5">Date &amp; Time</th><th className="px-6 py-5">Guests</th><th className="px-6 py-5">Amount</th><th className="px-6 py-5">Status</th><th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfdcd6]">
              {filteredBookings.map((booking) => {
                const name = booking.user?.fullname || "Guest";
                const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
                const start = booking.startTime ? new Date(booking.startTime) : null;
                const end = booking.endTime ? new Date(booking.endTime) : null;
                return (
                  <tr key={booking.id} className="transition-colors hover:bg-[#faf8f4]">
                    <td className="px-6 py-6"><div className="flex items-center gap-4"><span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#143f2c] text-[16px] font-bold text-[#fffdfa]">{initials}</span><div><p className="text-[18px] font-semibold text-[#292623]">{name}</p><p className="mt-1 text-[16px] text-[#837d76]">{booking.venue?.venuename || "Venue booking"}</p></div></div></td>
                    <td className="px-6 py-6"><p className="text-[17px] font-medium text-[#292623]">{start?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) || "—"}</p><p className="mt-1 text-[15px] text-[#837d76]">{start?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "—"} - {end?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "—"}</p></td>
                    <td className="px-6 py-6"><span className="inline-flex items-center gap-2 text-[16px] text-[#5e6c63]"><LuUsers className="text-[20px] text-[#204b38]" />{booking.numberOfGuestsExpected || 0}</span></td>
                    <td className="px-6 py-6 text-[19px] font-semibold text-[#292623]">{formatAmount(booking.totalCost)}</td>
                    <td className="px-6 py-6"><StatusPill status={booking.bookingStatus} /></td>
                    <td className="px-6 py-6"><div className="flex items-center justify-center gap-5 text-[#77716b]"><button onClick={() => router.push(`/host/bookings/${booking.id}`)} title="View booking" className="hover:text-[#143f2c]"><LuEye className="text-[21px]" /></button><button onClick={() => router.push(`/host/bookings/${booking.id}`)} title="Booking actions" className="hover:text-[#143f2c]"><LuChevronDown className="text-[20px]" /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && filteredBookings.length === 0 && <p className="py-16 text-center text-[17px] text-[#837d76]">No bookings found</p>}
        {loading && <p className="py-16 text-center text-[17px] text-[#837d76]">Loading bookings...</p>}
      </section>
    </div>
  );
}
