"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaTrash, FaMapMarkerAlt, FaUsers, FaPlus, FaSearch } from "react-icons/fa";

const MyVenuesPage = () => {
    const router = useRouter();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const res = await providerService.getAllVenues();
            setVenues(res.venues);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your venues");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this venue? This cannot be undone.")) return;

        try {
            await providerService.deleteVenue(id);
            toast.success("Venue deleted successfully");
            setVenues(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            toast.error("Failed to delete venue");
        }
    };

    const handleEdit = (id) => {
        router.push(`/host/venues/${id}/edit`);
    };

    const handleView = (id) => {
        router.push(`/host/venues/${id}`);
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: "bg-green-100 text-green-700",
            PENDING: "bg-amber-100 text-amber-700",
            DRAFT: "bg-gray-100 text-gray-600",
            BLOCKED: "bg-red-100 text-red-700"
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status] || styles.DRAFT}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Venues</h1>
                    <p className="text-gray-500 text-sm">Manage your listed properties and check their status.</p>
                </div>
                <button
                    onClick={() => router.push('/host/venues/create')}
                    className="bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-black transition text-sm flex items-center gap-2 shadow-lg shadow-gray-200"
                >
                    <FaPlus /> Add New Venue
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && venues.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <FaSearch size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No venues listed yet</h3>
                    <p className="text-gray-500 mb-6 text-sm">Get started by listing your first property.</p>
                    <button onClick={() => router.push('/host/venues/create')} className="text-rose-600 font-semibold hover:underline">
                        Create Listing &rarr;
                    </button>
                </div>
            )}

            {/* Grid List */}
            {!loading && venues.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {venues.map(venue => (
                        <div key={venue.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col">

                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {venue.photos?.[0] ? (
                                    <img
                                        src={venue.photos[0].image}
                                        alt={venue.venuename}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}

                                <div className="absolute top-3 right-3 shadow-sm">
                                    {getStatusBadge(venue.status)}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 truncate mb-1" title={venue.venuename}>
                                    {venue.venuename}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-rose-500" size={12} />
                                        {venue.address?.city?.name || "No location"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaUsers className="text-blue-500" size={12} />
                                        {venue.capacity || 0} Guests
                                        {/* {console.log(venue)} */}
                                    </span>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(venue.id)}
                                            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(venue.id)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                                            title="Edit Venue"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(venue.id)}
                                        className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition"
                                        title="Delete Venue"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyVenuesPage;