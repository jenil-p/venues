"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service";
import toast from "react-hot-toast";
import {
    FaArrowLeft, FaMapMarkerAlt, FaUsers, FaStar,
    FaEnvelope, FaPhone, FaCheck, FaTimes, FaTrash,
    FaMoneyBillWave, FaUserTie, FaBuilding, FaInfoCircle
} from "react-icons/fa";

const VenueDetailsPage = ({ params }) => {
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
            const res = await adminService.getVenue(id);
            setVenue(res.venue);
        } catch (error) {
            toast.error("Failed to load venue details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenue();
    }, [id]);

    // 3. Actions
    const handleAction = async (action) => {
        try {
            if (action === "approve") {
                if (!confirm("Approve this venue listing?")) return;
                await adminService.approveVenue(id);
                toast.success("Venue Approved");
            }
            if (action === "reject") {
                if (!confirm("Reject/Block this venue?")) return;
                await adminService.rejectVenue(id);
                toast.success("Venue Blocked");
            }
            if (action === "delete") {
                if (!confirm("Permanently delete this venue?")) return;
                await adminService.deleteVenue(id);
                toast.success("Venue Deleted");
                router.back();
                return;
            }
            fetchVenue();
        } catch (err) {
            toast.error(`Action failed`);
        }
    };

    // --- SKELETON LOADER ---
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-96 bg-gray-200 rounded-2xl" />
                        <div className="h-40 bg-gray-200 rounded-xl" />
                        <div className="h-40 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-64 bg-gray-200 rounded-xl" />
                        <div className="h-48 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!venue) return <div className="text-center py-20">Venue not found</div>;

    // --- HELPER: Address Formatter ---
    const formatAddress = () => {
        const a = venue.address;
        if (!a) return "No address provided";
        const city = a.city?.name;
        const state = a.city?.state?.name;
        const country = a.city?.state?.country?.name;

        if (a.location) return `${a.location}, ${city}, ${state}, ${country} - ${a.postalcode}`;
        return `${city}, ${state}, ${country}`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">

            {/* ---------------- HEADER ---------------- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            {venue.venuename}
                            <span className={`text-sm px-3 py-1 rounded-full border align-middle ${venue.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200" :
                                    venue.status === "BLOCKED" ? "bg-red-50 text-red-700 border-red-200" :
                                        "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                {venue.status}
                            </span>
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <FaMapMarkerAlt className="text-rose-500" />
                            {formatAddress()}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {venue.status !== "ACTIVE" && (
                        <button
                            onClick={() => handleAction('approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm font-medium"
                        >
                            <FaCheck /> Approve
                        </button>
                    )}
                    {venue.status !== "BLOCKED" && (
                        <button
                            onClick={() => handleAction('reject')}
                            className="px-4 py-2 bg-white border border-amber-300 text-amber-600 rounded-lg hover:bg-amber-50 transition flex items-center gap-2 font-medium"
                        >
                            <FaTimes /> Block
                        </button>
                    )}
                    <button
                        onClick={() => handleAction('delete')}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2 font-medium"
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ---------------- LEFT COLUMN (Main Info) ---------------- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Photo Gallery */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        {venue.photos && venue.photos.length > 0 ? (
                            <div className="grid grid-cols-4 grid-rows-2 gap-1 h-96">
                                {/* Main Image */}
                                <div className="col-span-2 row-span-2 relative group">
                                    <img src={venue.photos[0]?.image} alt="Main" className="w-full h-full object-cover" />
                                </div>
                                {/* Secondary Images */}
                                {venue.photos.slice(1, 5).map((photo, i) => (
                                    <div key={i} className="col-span-1 row-span-1 relative">
                                        <img src={photo.image} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {/* Fallback if less than 5 images, fill with gray or placeholder */}
                                {venue.photos.length < 5 && (
                                    <div className="col-span-1 row-span-1 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                        End of Gallery
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                                <FaBuilding size={48} className="opacity-20" />
                                <span className="ml-3">No Photos Available</span>
                            </div>
                        )}
                    </div>

                    {/* Overview & Stats */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">About this Venue</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                            {venue.description || "No description provided."}
                        </p>

                        <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaUsers /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Capacity</p>
                                    <p className="font-bold text-gray-900">{venue.capacity} Guests</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><FaStar /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Rating</p>
                                    <p className="font-bold text-gray-900">{venue.rating ? venue.rating : "New"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><FaInfoCircle /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">ID</p>
                                    <p className="font-bold text-gray-900">#{venue.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features & Types */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Amenities & Types</h3>

                        <div className="space-y-6">
                            {/* Venue Types */}
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-3">Venue Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {venue.types && venue.types.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-3">Features</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {venue.features && venue.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-gray-700">
                                            {/* If icon exists render it, else dot */}
                                            {f.feature.icon ? <span className="text-rose-500">{/* Icon Render Logic */}</span> : <div className="w-2 h-2 bg-rose-500 rounded-full" />}
                                            <span className="text-sm">{f.feature.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Preview */}
                    {venue.reviews && venue.reviews.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Reviews</h3>
                            <div className="space-y-4">
                                {venue.reviews.slice(0, 3).map((review, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-gray-900">{review.user.fullname}</span>
                                            <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                                {review.rating} <FaStar />
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* ---------------- RIGHT COLUMN (Sidebar) ---------------- */}
                <div className="space-y-6">

                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-gray-800">
                            <FaMoneyBillWave className="text-green-600 text-xl" />
                            <h3 className="font-bold text-lg">Pricing</h3>
                        </div>

                        {venue.pricing ? (
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-500 uppercase font-semibold">Base Price</p>
                                <p className="text-3xl font-extrabold text-gray-900 my-1">
                                    ₹{venue.pricing[0].price}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">{venue.pricing[0].unit}</p>

                                {(venue.pricing.startTime || venue.pricing.endTime) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                        Available: <br />
                                        <span className="font-semibold text-gray-900">
                                            {venue.pricing.startTime || 'N/A'} - {venue.pricing.endTime || 'N/A'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center italic">Pricing info not available</p>
                        )}
                    </div>

                    {/* Provider Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 text-gray-800">
                            <FaUserTie className="text-rose-500 text-xl" />
                            <h3 className="font-bold text-lg">Host Details</h3>
                        </div>

                        {venue.provider ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                        {venue.provider.legalname?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{venue.provider.legalname}</p>
                                        <p className={`text-xs font-semibold ${venue.provider.status === "APPROVED" ? "text-green-600" : "text-amber-600"}`}>
                                            {venue.provider.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaUsers className="w-4" />
                                        <span>{venue.provider.user.fullname}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaEnvelope className="w-4" />
                                        <span className="truncate">{venue.provider.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaPhone className="w-4" />
                                        <span>{venue.provider.contact1}</span>
                                    </div>
                                    {venue.provider.contact2 && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FaPhone className="w-4" />
                                            <span>{venue.provider.contact2}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => router.push(`/admin/providers/${venue.provider.id}`)}
                                    className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                                >
                                    View Host Profile
                                </button>
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">Provider data missing</p>
                        )}
                    </div>

                    {/* 3. Contact Venue */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Venue Contacts</h3>
                        <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                <FaEnvelope className="text-gray-400" />
                                <span className="text-gray-700 font-medium truncate">{venue.contactemail}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                <FaPhone className="text-gray-400" />
                                <span className="text-gray-700 font-medium">{venue.contactnumber1}</span>
                            </div>
                            {venue.contactnumber2 && (
                                <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                    <FaPhone className="text-gray-400" />
                                    <span className="text-gray-700 font-medium">{venue.contactnumber2}</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VenueDetailsPage;