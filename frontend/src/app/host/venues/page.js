"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import toast from "react-hot-toast";
import {
  LuEye,
  LuChevronRight,
  LuMapPin,
  LuPencilLine,
  LuPlus,
  LuStar,
  LuTag,
  LuTrash2,
} from "react-icons/lu";

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const statusClass = (status) => {
  if (status === "ACTIVE") return "bg-[#214d39] text-[#f6f5f0]";
  if (status === "INACTIVE" || status === "BLOCKED") return "bg-[#373432] text-[#f6f5f0]";
  if (status === "PENDING") return "bg-[#8a651a] text-[#fff9e9]";
  return "bg-[#6f6b66] text-[#f6f5f0]";
};

const VenueCard = ({ venue, onView, onEdit, onDelete }) => {
  const city = venue.address?.city?.name || venue.city || "Location unavailable";
  const type = venue.type?.name || venue.category?.name || venue.venueType || "Venue";
  const image = venue.photos?.[0]?.image || venue.photo;
  const rating = Number(venue.averageRating || venue.rating || 0).toFixed(1);

  return (
    <article className="overflow-hidden rounded-[27px] border border-[#dcd8d2] bg-[#fffdfa]">
      <div className="relative h-[350px] overflow-hidden bg-[#e9e5de]">
        {image ? (
          <img src={image} alt={venue.venuename} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[18px] text-[#817a73]">No image available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <span className={`absolute left-6 top-6 rounded-full px-4 py-2 text-[16px] font-bold ${statusClass(venue.status)}`}>
          {venue.status || "DRAFT"}
        </span>
        <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4 text-[#fffdfa]">
          <div className="min-w-0">
            <h2 className="truncate font-serif text-[26px] font-semibold tracking-[-0.03em]">{venue.venuename}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-[17px] font-medium text-white/85"><LuMapPin /> {city}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[17px] font-semibold"><LuStar className="fill-[#ffbe0b] text-[#ffbe0b]" /> {rating}</span>
        </div>
      </div>

      <div className="grid h-[80px] grid-cols-3 divide-x divide-[#dfdcd6] border-b border-[#dfdcd6]">
        <div className="flex flex-col items-center justify-center"><b className="text-[18px] text-[#292623]">{venue.capacity || 0}</b><span className="mt-1 text-[15px] text-[#837d76]">Capacity</span></div>
        <div className="flex flex-col items-center justify-center"><b className="text-[18px] text-[#292623]">{venue.bookingsCount || 0}</b><span className="mt-1 text-[15px] text-[#837d76]">Bookings</span></div>
        <div className="flex flex-col items-center justify-center"><b className="text-[18px] text-[#292623]">{formatAmount(venue.totalRevenue || venue.revenue)}</b><span className="mt-1 text-[15px] text-[#837d76]">Revenue</span></div>
      </div>

      <div className="flex h-[80px] items-center justify-between px-6">
        <span className="inline-flex min-w-0 items-center gap-2 truncate text-[17px] text-[#837d76]"><LuTag className="shrink-0 text-[20px]" /> {type}</span>
        <div className="flex items-center gap-5 text-[#817a73]">
          <button onClick={() => onView(venue.id)} title="View venue" className="transition-colors hover:text-[#143f2c]"><LuEye className="text-[22px]" /></button>
          <button onClick={() => onEdit(venue.id)} title="Edit venue" className="transition-colors hover:text-[#143f2c]"><LuPencilLine className="text-[22px]" /></button>
          <button onClick={() => onDelete(venue.id)} title="Delete venue" className="transition-colors hover:text-[#bb3a22]"><LuTrash2 className="text-[22px]" /></button>
        </div>
      </div>
    </article>
  );
};

export default function MyVenuesPage() {
  const router = useRouter();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await providerService.getAllVenues();
        setVenues(response?.venues || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your venues");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue? This cannot be undone.")) return;
    try {
      await providerService.deleteVenue(id);
      setVenues((currentVenues) => currentVenues.filter((venue) => venue.id !== id));
      toast.success("Venue deleted successfully");
    } catch (error) {
      toast.error("Failed to delete venue");
    }
  };

  return (
    <div className="space-y-8 pb-20" style={{ zoom: 0.6667 }}>
      <header className="flex flex-col gap-6 px-4 pt-4 md:px-0">
        <div>
          <div className="flex items-center gap-3 text-[17px] text-[#837d76]"><span>Host</span><LuChevronRight className="text-[18px]" /><span className="font-medium text-[#292623]">My Venues</span></div>
          <h1 className="mt-4 font-serif text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#201e1c]">My Venues</h1>
          <p className="mt-2 text-[20px] text-[#7f7973]">Manage your listed properties and check their status.</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[19px] text-[#7f7973]">{venues.length} {venues.length === 1 ? "listing" : "listings"}</p>
          <button onClick={() => router.push("/host/venues/create")} className="inline-flex h-[60px] items-center gap-3 rounded-xl bg-[#143f2c] px-7 text-[19px] font-semibold text-white transition-colors hover:bg-[#0e3223]"><LuPlus className="text-[24px]" /> Add New Venue</button>
        </div>
      </header>

      {loading && (
        <div className="grid grid-cols-1 gap-7 px-4 md:grid-cols-2 xl:grid-cols-3 md:px-0">
          {[1, 2, 3].map((item) => <div key={item} className="h-[510px] animate-pulse rounded-[27px] bg-[#e9e5de]" />)}
        </div>
      )}

      {!loading && (
        <section className="grid grid-cols-1 gap-7 px-4 md:grid-cols-2 xl:grid-cols-3 md:px-0">
          {venues.map((venue) => <VenueCard key={venue.id} venue={venue} onView={(id) => router.push(`/host/venues/${id}`)} onEdit={(id) => router.push(`/host/venues/${id}/edit`)} onDelete={handleDelete} />)}
          <button onClick={() => router.push("/host/venues/create")} className="flex min-h-[400px] flex-col items-center justify-center rounded-[27px] border-[3px] border-dashed border-[#dcd8d2] text-[#817a73] transition-colors hover:border-[#143f2c] hover:text-[#143f2c]">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-dashed border-current"><LuPlus className="text-[32px]" /></span>
            <span className="mt-7 text-[20px]">List a new venue</span>
          </button>
        </section>
      )}
    </div>
  );
}
