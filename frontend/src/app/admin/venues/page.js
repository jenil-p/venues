"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service";
import { FaCheck, FaTimes, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { MdPerson } from "react-icons/md";
import toast from "react-hot-toast";

const VenuesPage = () => {
    const router = useRouter();

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVenues = async () => {
        try {
            const res = await adminService.getAllVenues();
            setVenues(res.venues || []);
        } catch (error) {
            toast.error("Failed to fetch venues");
        } finally {
            setLoading(false);
        }
    };

    const handleOnClickVenue = (venueId) => {
        if (venueId) {
            router.push(`/admin/venues/${venueId}`);
        } else {
            console.error("Venue ID is missing");
        }
    }

    useEffect(() => { fetchVenues(); }, []);

    const handleAction = async (action, id) => {
        try {
            if (action === 'approve') await adminService.approveVenue(id);
            if (action === 'reject') await adminService.rejectVenue(id);
            if (action === 'delete') {
                if (!confirm("Are you sure? This cannot be undone.")) return;
                await adminService.deleteVenue(id);
            }
            toast.success(`Venue ${action}d successfully`);
            fetchVenues();
        } catch (err) {
            toast.error(`Failed to ${action} venue`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Venue Listings</h1>
                    <p className="text-gray-500 text-sm">Review and manage properties posted by hosts</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded" />)}
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Venue Info</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Capacity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map((venue) => (
                                <tr key={venue.id} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <img src={venue.photos?.[0] || '/placeholder.jpg'} className="w-16 h-12 rounded object-cover bg-gray-200" alt="" />
                                            <div onClick={() => handleOnClickVenue(venue.id)} className="hover:underline cursor-pointer">
                                                <p className="font-semibold text-gray-900">{venue.venuename}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FaMapMarkerAlt /> {venue.address.city.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700">{venue.venuename}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700 flex items-center"><CiStar />{venue.rating}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700 flex items-center"><MdPerson />{venue.capacity}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${venue.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" :
                                            venue.status === "BLOCKED" ? "bg-red-100 text-red-700 border-red-200" :
                                                "bg-amber-100 text-amber-700 border-amber-200"
                                            }`}>
                                            {venue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {venue.status !== "ACTIVE" && (
                                                <button onClick={() => handleAction('approve', venue.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                    <FaCheck />
                                                </button>
                                            )}
                                            {venue.status !== "BLOCKED" && (
                                                <button onClick={() => handleAction('reject', venue.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded" title="Block/Reject">
                                                    <FaTimes />
                                                </button>
                                            )}
                                            <button onClick={() => handleAction('delete', venue.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VenuesPage;