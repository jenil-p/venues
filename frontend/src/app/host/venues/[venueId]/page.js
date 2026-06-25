"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import toast from "react-hot-toast";
import {
    FaArrowLeft, FaMapMarkerAlt, FaEdit, FaTrash, FaCamera,
    FaList, FaMoneyBillWave, FaCheck, FaImages, FaEye
} from "react-icons/fa";

const HostVenueDetailsPage = ({ params }) => {
    const router = useRouter();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);

    useEffect(() => {
        async function unwrap() {
            const p = await params;
            setId(p.venueId);
        }
        unwrap();
    }, [params]);

    const fetchVenue = async () => {
        if (!id) return;
        try {
            setLoading(true);
            // console.log("sending request to " , id)
            const res = await providerService.getVenue(id);
            // console.log(res)
            setVenue(res.venue);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load venue details. You might not be the owner.");
            router.push("/host/venues");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenue();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure? This will permanently delete this venue listing.")) return;
        try {
            await providerService.deleteVenue(id);
            toast.success("Venue deleted");
            router.push("/host/venues");
        } catch (error) {
            toast.error("Failed to delete venue");
        }
    };

    const formatAddress = () => {
        const a = venue?.address;
        if (!a) return "No address";
        const cityName = a.city?.name || "";
        return `${a.location}, ${cityName} - ${a.postalcode}`;
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: "bg-green-100 text-green-700 border-green-200",
            PENDING: "bg-amber-100 text-amber-700 border-amber-200",
            DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
            BLOCKED: "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${styles[status] || styles.DRAFT}`}>
                <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-pulse">
                <div className="flex justify-between">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-80 bg-gray-200 rounded-2xl" />
                        <div className="h-40 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-64 bg-gray-200 rounded-xl" />
                        <div className="h-40 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!venue) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <button
                        onClick={() => router.push('/host/venues')}
                        className="text-gray-500 hover:text-black flex items-center gap-2 text-sm font-medium transition"
                    >
                        <FaArrowLeft /> Back to List
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{venue.venuename}</h1>
                        {getStatusBadge(venue.status)}
                    </div>

                    <p className="text-gray-500 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rose-500" />
                        {formatAddress()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition flex items-center gap-2">
                        <FaEye /> Preview
                    </button>
                    <button
                        onClick={() => router.push(`/host/venues/${id}/edit`)}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium shadow-lg transition flex items-center gap-2"
                    >
                        <FaEdit /> Edit Listing
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Photo Gallery */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
                        {venue.photos && venue.photos.length > 0 ? (
                            <div className="h-80 w-full relative">
                                <img src={venue.photos[0].image} alt="Main" className="w-full h-full object-cover" />

                                {/* Photo Count Overlay */}
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                                    <FaImages /> {venue.photos.length} Photos
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                <FaCamera size={40} className="mb-2 opacity-20" />
                                <p>No photos uploaded</p>
                            </div>
                        )}

                        {/* Quick Edit Overlay */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-200">
                            <button
                                onClick={() => router.push(`/host/venues/${id}/photos`)} // Assumption: granular edit page
                                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-gray-50 text-sm"
                            >
                                Manage Photos
                            </button>
                        </div>
                    </div>

                    {/* 2. Overview */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Details</h2>
                            <button className="text-blue-600 text-sm font-semibold hover:underline">Edit details</button>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                            {venue.description || "No description provided."}
                        </p>

                        <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                            <div>
                                <p className="text-sm text-gray-500 font-semibold mb-1">Capacity</p>
                                <p className="text-lg font-bold text-gray-900">{venue.capacity} Guests</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold mb-1">Type</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {venue.types?.map((t, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Features */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Amenities</h3>
                            <button className="text-blue-600 text-sm font-semibold hover:underline">Edit amenities</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {venue.features?.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    <FaCheck className="text-green-500 text-xs" />
                                    <span className="text-sm font-medium">{f.feature.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ---------------- RIGHT COLUMN (Sidebar) ---------------- */}
                <div className="space-y-6">

                    {/* 1. Pricing Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-gray-800">
                                <FaMoneyBillWave className="text-green-600" />
                                <h3 className="font-bold">Pricing</h3>
                            </div>
                            <button className="text-blue-600 text-xs font-bold hover:underline">UPDATE</button>
                        </div>

                        {venue.pricing && venue.pricing.length > 0 ? (
                            <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Base Price</p>
                                <p className="text-3xl font-extrabold text-gray-900">
                                    ₹{Number(venue.pricing[0].price).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600 font-medium mt-1">
                                    per {venue.pricing[0].unit.toLowerCase()}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-4 italic">Pricing not set</div>
                        )}
                    </div>

                    {/* 2. Stats / Performance (Placeholder) */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <FaList className="text-rose-400" /> Performance
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <p className="text-xs text-gray-300">Views</p>
                                <p className="text-xl font-bold">0</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg">
                                <p className="text-xs text-gray-300">Bookings</p>
                                <p className="text-xl font-bold">0</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Danger Zone */}
                    <div className="border border-red-100 bg-red-50 p-6 rounded-2xl">
                        <h3 className="font-bold text-red-800 mb-2">Danger Zone</h3>
                        <p className="text-xs text-red-600 mb-4">
                            Deleting this venue will remove it from search results and cancel pending bookings.
                        </p>
                        <button
                            onClick={handleDelete}
                            className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2"
                        >
                            <FaTrash /> Delete Venue
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HostVenueDetailsPage;