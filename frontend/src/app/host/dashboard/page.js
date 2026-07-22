"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "../../../api/booking.service.js";
import { providerService } from "../../../api/provider.service.js";
import toast from "react-hot-toast";
import {
  LuActivity,
  LuArrowUpRight,
  LuBell,
  LuBuilding2,
  LuCalendarDays,
  LuChevronDown,
  LuCircleAlert,
  LuPlus,
  LuSearch,
  LuStar,
  LuTrendingUp,
} from "react-icons/lu";
import { RxCheckCircled } from "react-icons/rx";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatStatus = (status) => {
  if (status === "PENDING_PAYMENT") return "Pending";
  return status ? `${status.charAt(0)}${status.slice(1).toLowerCase()}` : "Pending";
};

const statusClasses = (status) => {
  if (status === "CONFIRMED") return "border-[#b9c8bd] bg-[#e7ebe4] text-[#204b38]";
  if (status === "COMPLETED") return "border-[#d6cec0] bg-[#e9e3d9] text-[#827a70]";
  return "border-[#ffd46b] bg-[#fffaf0] text-[#c75808]";
};

const StatusPill = ({ status }) => {
  const isConfirmed = status === "CONFIRMED";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses(status)}`}>
      {isConfirmed ? <RxCheckCircled className="text-[13px]" /> : <LuCircleAlert className="text-[13px]" />}
      {formatStatus(status)}
    </span>
  );
};

const StatCard = ({ title, value, subtext, icon, iconClass, trend }) => (
  <article className="min-h-[256px] rounded-[22px] border border-[#dfdcd6] bg-[#fffdfa] p-7">
    <div className="flex items-start justify-between">
      <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-[17px] ${iconClass}`}>
        {icon}
      </div>
      {trend && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ebeee9] px-3 py-1.5 text-sm font-medium text-[#234c39]">
          <LuTrendingUp className="text-[15px]" /> {trend}%
        </span>
      )}
    </div>
    <div className="mt-9">
      <p className="font-serif text-[31px] font-semibold leading-none tracking-[-0.035em] text-[#201e1c]">{value}</p>
      <p className="mt-2 text-[18px] leading-tight text-[#7f7973]">{title}</p>
      <p className="mt-3 text-base text-[#88817a]">{subtext}</p>
    </div>
  </article>
);

const BookingCard = ({ booking, upcoming = false }) => {
  const guestName = booking.user?.fullname || "Guest";
  const venueName = booking.venue?.venuename || "Venue booking";
  const eventDate = booking.startTime
    ? new Date(booking.startTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Date unavailable";
  const initials = guestName.split(" ").map((name) => name[0]).slice(0, 2).join("").toUpperCase();

  if (upcoming) {
    return (
      <article className="rounded-[17px] bg-[#f1eee8] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-base font-semibold text-[#292623]">{guestName}</p>
          <StatusPill status={booking.bookingStatus} />
        </div>
        <p className="mt-2 truncate text-sm text-[#847d76]">{venueName}</p>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-[#847d76]">{eventDate}</span>
          <span className="font-semibold text-[#252220]">{formatAmount(booking.totalCost)}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="flex items-center gap-4 rounded-[17px] px-4 py-4 transition-colors hover:bg-[#f5f2ec]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#143f2c] text-base font-bold text-[#f8f6f1]">{initials}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-semibold text-[#292623]">{guestName}</p>
        <p className="mt-0.5 truncate text-[15px] text-[#847d76]">{venueName} · {booking.numberOfGuestsExpected || 0} guests</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[17px] font-semibold text-[#292623]">{formatAmount(booking.totalCost)}</p>
        <div className="mt-1"><StatusPill status={booking.bookingStatus} /></div>
      </div>
    </article>
  );
};

const VenueSummaryCard = ({ venue }) => {
  const image = venue.photo || venue.photos?.[0]?.image || "https://picsum.photos/id/1015/300/300";
  return (
    <article className="flex items-center gap-4 rounded-[15px] px-3 py-3 transition-colors hover:bg-[#f5f2ec]">
      <img src={image} className="h-[60px] w-[60px] rounded-xl object-cover" alt={venue.venuename} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-[#292623]">{venue.venuename}</p>
        <p className="mt-0.5 text-sm text-[#847d76]">{venue.bookingsCount || 0} bookings</p>
      </div>
      <span className={`h-3 w-3 rounded-full ${venue.status === "ACTIVE" ? "bg-[#1d513a]" : "bg-[#817c76]"}`} />
    </article>
  );
};

export default function HostDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, venuesRes] = await Promise.all([
          bookingService.getDashboardOverview(),
          providerService.getAllVenues(),
        ]);
        setData(dashboardRes);
        setVenues(venuesRes?.venues || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#143f2c] border-t-transparent" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenueTrend = data?.revenueTrend || [];
  const upcoming = data?.upcoming || [];
  const recent = data?.recentBookings || [];
  const venuesSummary = data?.venuesSummary || venues.slice(0, 3);

  return (
    <div
      className="-mx-4 -mt-24 min-h-screen bg-[#f8f6f2] pb-10 md:-mx-8 md:-mt-8"
      style={{ zoom: 0.6667 }}
    >
      <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between border-y border-[#dfdcd6] bg-[#fffdfa] px-7 md:px-8">
        <label className="flex h-14 w-full max-w-[578px] items-center gap-3 rounded-[17px] border border-[#dcd8d1] bg-[#f7f5f0] px-5 text-[18px] text-[#77716b]">
          <LuSearch className="text-[23px]" />
          <input className="w-full bg-transparent outline-none placeholder:text-[#77716b]" placeholder="Search bookings, venues..." />
        </label>
        <div className="ml-6 flex items-center gap-3">
          <button onClick={() => router.push("/host/venues/create")} className="hidden h-14 items-center gap-3 rounded-[18px] bg-[#143f2c] px-6 text-[18px] font-semibold text-white transition-colors hover:bg-[#0e3223] sm:flex">
            <LuPlus className="text-[23px]" /> Create New Listing
          </button>
          <button aria-label="Notifications" className="relative flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#e1ddd7] text-[#726c66]">
            <LuBell className="text-[23px]" />
            <span className="absolute right-3.5 top-3.5 h-2.5 w-2.5 rounded-full bg-[#d96030]" />
          </button>
          <button className="hidden h-16 items-center gap-3 rounded-[18px] border border-[#e1ddd7] px-3 pr-4 md:flex">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#143f2c] text-sm font-bold text-[#fffdfa]">MS</span>
            <span className="text-[18px] font-semibold text-[#292623]">Margot</span>
            <LuChevronDown className="text-[#7c756e]" />
          </button>
        </div>
      </header>

      <main className="px-5 pt-10 md:px-10 md:pt-11">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-base text-[#837d76]">
            <span>Host</span><LuChevronDown className="-rotate-90 text-[17px]" /><span className="font-medium text-[#292623]">Dashboard Overview</span>
          </div>
          <h1 className="mt-3 font-serif text-[37px] font-semibold leading-none tracking-[-0.035em] text-[#201e1c]">Dashboard Overview</h1>
          <p className="mt-2 text-[20px] text-[#7f7973]">Welcome back! Here&apos;s what&apos;s happening with your listings.</p>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Revenue" value={formatAmount(stats.totalRevenue)} subtext="All time earnings" trend={stats.revenueGrowth} icon={<LuTrendingUp className="text-[29px]" />} iconClass="bg-[#e8ebe5] text-[#204b38]" />
          <StatCard title="Active Bookings" value={stats.activeBookings || 0} subtext={`${stats.pendingBookings || 0} pending approval`} trend={stats.bookingGrowth} icon={<LuCalendarDays className="text-[28px]" />} iconClass="bg-[#f8e8dd] text-[#dc570e]" />
          <StatCard title="Total Listings" value={stats.totalListings || 0} subtext="Venues & Services" icon={<LuBuilding2 className="text-[28px]" />} iconClass="bg-[#eee8ff] text-[#7132ff]" />
          <StatCard title="Average Rating" value={stats.avgRating?.toFixed(1) || "0.0"} subtext={`Based on ${stats.totalReviews || 0} reviews`} icon={<LuStar className="text-[29px]" />} iconClass="bg-[#fff4c7] text-[#c25700]" />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <article className="rounded-[23px] border border-[#dfdcd6] bg-[#fffdfa] p-7 xl:col-span-9">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-[28px] font-semibold tracking-[-0.03em] text-[#201e1c]">Revenue Trend</h2>
                <p className="mt-1 text-[17px] text-[#837d76]">Monthly earnings · 2025</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ebeee9] px-3 py-1.5 text-sm font-medium text-[#204b38]"><LuActivity /> Live</span>
            </div>
            <div className="mt-5 h-[310px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 15, right: 5, left: 10, bottom: 0 }}>
                  <defs><linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#143f2c" stopOpacity={0.14} /><stop offset="100%" stopColor="#143f2c" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="#ebe8e1" strokeDasharray="4 5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 14 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#817a73", fontSize: 14 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => [formatAmount(value), "Revenue"]} contentStyle={{ border: "1px solid #dfdcd6", borderRadius: "12px", boxShadow: "0 8px 18px rgba(32, 30, 28, .08)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#143f2c" strokeWidth={3.5} fill="url(#revenue-fill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-[23px] border border-[#dfdcd6] bg-[#fffdfa] p-7 xl:col-span-3">
            <div className="flex items-center justify-between"><h2 className="font-serif text-[28px] font-semibold tracking-[-0.03em] text-[#201e1c]">Upcoming</h2><button onClick={() => router.push("/host/bookings")} className="text-base font-medium text-[#204b38]">View all</button></div>
            <div className="mt-6 space-y-3">{upcoming.length ? upcoming.slice(0, 4).map((booking) => <BookingCard key={booking.id} booking={booking} upcoming />) : <p className="py-12 text-center text-[#847d76]">No upcoming bookings yet</p>}</div>
          </article>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <article className="rounded-[23px] border border-[#dfdcd6] bg-[#fffdfa] p-7 xl:col-span-9">
            <div className="flex items-center justify-between"><h2 className="font-serif text-[28px] font-semibold tracking-[-0.03em] text-[#201e1c]">Recent Bookings</h2><button onClick={() => router.push("/host/bookings")} className="inline-flex items-center gap-1 text-base font-medium text-[#204b38]">All bookings <LuArrowUpRight /></button></div>
            <div className="mt-5 space-y-2">{recent.length ? recent.slice(0, 4).map((booking) => <BookingCard key={booking.id} booking={booking} />) : <p className="py-12 text-center text-[#847d76]">No recent bookings</p>}</div>
          </article>
          <article className="rounded-[23px] border border-[#dfdcd6] bg-[#fffdfa] p-7 xl:col-span-3">
            <div className="flex items-center justify-between"><h2 className="font-serif text-[28px] font-semibold tracking-[-0.03em] text-[#201e1c]">My Venues</h2><button onClick={() => router.push("/host/venues")} className="text-base font-medium text-[#204b38]">Manage</button></div>
            <div className="mt-5 space-y-2">{venuesSummary.length ? venuesSummary.slice(0, 3).map((venue) => <VenueSummaryCard key={venue.id} venue={venue} />) : <p className="py-12 text-center text-[#847d76]">No venues yet.</p>}</div>
          </article>
        </section>
      </main>
    </div>
  );
}
