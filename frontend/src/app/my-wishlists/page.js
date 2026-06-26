"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, MapPin, Users, ArrowRight, LayoutGrid, List, 
  Search, Clock, Trash2, SlidersHorizontal, CheckCircle2 
} from "lucide-react";

import { venueService } from "@/api/venue.service";
import Navbar from "@/components/Navbar";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function RemoveModal({ 
  venueName, 
  onConfirm, 
  onCancel 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#e1dfda] p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Remove from saved?</h3>
            <p className="text-sm text-[#78716c] mt-1">
              <span className="font-medium">{venueName}</span> will be removed from your wishlist.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#e1dfda] rounded-xl py-3 text-sm font-medium hover:bg-muted"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-destructive text-destructive-foreground rounded-xl py-3 text-sm font-semibold hover:bg-destructive/90"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyWishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [removeTarget, setRemoveTarget] = useState(null);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await venueService.getWishlist();
        setItems(data.wishlists || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.venue.venuename.toLowerCase().includes(q) ||
      item.venue.address.city.name.toLowerCase().includes(q) ||
      item.venue.address.location.toLowerCase().includes(q)
    );
  });

  const handleRemove = async (item) => {
    try {
      await venueService.toggleWishlist(item.venue.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setRemoveTarget(null);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handleCardClick = (venueId) => {
    router.push(`/properties/${venueId}`);
  };

  const uniqueCities = [...new Set(filteredItems.map((i) => i.venue.address.city.name))];

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading your wishlist...</div>;
  }

  return (
    <>
        <Navbar />
        <div className="min-h-screen bg-[#f5f1eb] pb-12 mt-20">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
            <div>
                <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-[#efdfd6] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-[#BF4A1A] fill-[#BF4A1A]" />
                </div>
                <span className="uppercase text-xs font-medium tracking-widest text-[#78716c]">Saved Venues</span>
                </div>
                <h1 className="text-3xl font-semibold">My Wishlist</h1>
                <p className="text-[#78716c] mt-1">
                {items.length} venue{items.length !== 1 ? "s" : ""} saved · revisit anytime
                </p>
            </div>

            {/* Stats */}
            {items.length > 0 && (
                <div className="hidden sm:flex gap-8 bg-card border border-[#e1dfda] rounded-2xl px-6 py-4">
                <div className="text-center">
                    <p className="text-2xl font-semibold">{items.length}</p>
                    <p className="text-xs text-[#78716c]">Saved</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-semibold">{uniqueCities.length}</p>
                    <p className="text-xs text-[#78716c]">Cities</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-semibold">
                    {items.filter((i) => i.venue.status === "ACTIVE").length}
                    </p>
                    <p className="text-xs text-[#78716c]">Available</p>
                </div>
                </div>
            )}
            </div>

            {/* Toolbar */}
            {items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by venue name or city..."
                    className="w-full pl-11 pr-4 py-3 bg-card border border-[#e1dfda] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">

                <div className="flex border border-[#e1dfda] rounded-2xl overflow-hidden">
                    <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                    <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                    <List className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Search result count */}
            {search && (
            <p className="mb-4 text-sm text-[#78716c]">
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for "{search}"
            </p>
            )}

            {/* Main Content */}
            {filteredItems.length === 0 ? (
            <div className="text-center py-20">
                <Heart className="w-16 h-16 mx-auto text-[#78716c] mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved venues yet</h3>
                <p className="text-[#78716c]">Start exploring and save your favorite venues.</p>
            </div>
            ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleCardClick(item.venue.id)}
                    className="group bg-[#fdfaf5] rounded-3xl overflow-hidden border border-[#e1dfda] hover:shadow-xl transition-all cursor-pointer"
                >
                    <div className="relative h-64">
                    <Image
                        src={item.venue.photos[0]?.image || "/placeholder.jpg"}
                        alt={item.venue.venuename}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    
                    <button
                        onClick={(e) => { e.stopPropagation(); setRemoveTarget(item); }}
                        className="absolute top-4 right-4 w-9 h-9 bg-[#efdfd6]/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-[#efdfd6]"
                    >
                        <Heart className="w-5 h-5 text-[#BF4A1A] fill-[#BF4A1A]" />
                    </button>

                    <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 text-xs bg-black/70 text-white px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        Saved {timeAgo(item.createdAt)}
                        </span>
                    </div>
                    </div>

                    <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.venue.venuename}</h3>
                    <div className="flex items-center gap-1 text-sm text-[#78716c] mb-3">
                        <MapPin className="w-4 h-4" />
                        {item.venue.address.city.name} · {item.venue.address.location}
                    </div>

                    {item.venue.description && (
                        <p className="text-sm text-[#78716c]line-clamp-2 mb-4">
                        {item.venue.description}
                        </p>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4" />
                        Up to <span className="font-medium">{item.venue.capacity}</span> guests
                        </div>
                        <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                        View venue <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="space-y-4">
                {filteredItems.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleCardClick(item.venue.id)}
                    className="flex gap-6 bg-card border border-[#e1dfda] rounded-3xl p-4 hover:shadow-md cursor-pointer group"
                >
                    <div className="relative w-48 h-40 rounded-2xl overflow-hidden shrink-0">
                    <Image
                        src={item.venue.photos[0]?.image || "/placeholder.jpg"}
                        alt={item.venue.venuename}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                    />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between">
                        <h3 className="font-semibold text-xl">{item.venue.venuename}</h3>
                        <button
                            onClick={(e) => { e.stopPropagation(); setRemoveTarget(item); }}
                            className="text-[#78716c] hover:text-destructive"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        </div>
                        <p className="text-[#78716c] mt-1">
                        {item.venue.address.city.name} · {item.venue.address.location}
                        </p>
                        {item.venue.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-[#78716c]">
                            {item.venue.description}
                        </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-[#78716c]">
                        <Users className="w-4 h-4" />
                        Up to {item.venue.capacity} guests
                        </div>
                        <div className="text-sm text-emerald-600 flex items-center gap-1">
                        View venue <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* Cities Section */}
            {filteredItems.length > 0 && (
            <div className="mt-12">
                <p className="uppercase text-xs tracking-widest text-[#78716c] mb-4">Cities in your wishlist</p>
                <div className="flex flex-wrap gap-3">
                {uniqueCities.map((city) => (
                    <div
                    key={city}
                    className="inline-flex items-center gap-2 bg-card border border-[#e1dfda] rounded-full px-4 py-2 text-sm"
                    >
                    <MapPin className="w-4 h-4" />
                    {city}
                    <span className="font-semibold text-emerald-600">
                        {filteredItems.filter((i) => i.venue.address.city.name === city).length}
                    </span>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Ready to Book Banner */}
            {items.length > 0 && (
            <div className="mt-16 bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="uppercase tracking-widest text-xs font-medium text-emerald-400">Ready to book?</span>
                </div>
                <h3 className="text-2xl font-semibold">You have {items.length} venue{items.length > 1 ? "s" : ""} waiting</h3>
                <p className="text-emerald-300 mt-2">Turn a saved venue into a real experience. Check availability and lock in your date.</p>
                </div>
                <button
                onClick={() => router.push("/")}
                className="shrink-0 bg-white text-emerald-950 font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors"
                >
                Browse more venues
                </button>
            </div>
            )}
        </main>

        {/* Remove Modal */}
        {removeTarget && (
            <RemoveModal
            venueName={removeTarget.venue.venuename}
            onConfirm={() => handleRemove(removeTarget)}
            onCancel={() => setRemoveTarget(null)}
            />
        )}
        </div>
    </>
  );
}