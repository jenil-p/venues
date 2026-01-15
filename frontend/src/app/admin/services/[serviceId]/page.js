"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service";
import toast from "react-hot-toast";
import {
    FaArrowLeft, FaMapMarkerAlt, FaTag, FaMoneyBillWave,
    FaUserTie, FaCheck, FaTimes, FaTrash, FaPhone, FaBuilding, FaUtensils, FaConciergeBell
} from "react-icons/fa";


const ServiceDetailsPage = ({ params }) => {
    const router = useRouter();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);

    useEffect(() => {
        async function unwrap() {
            const p = await params;
            setId(p.serviceId);
        }
        unwrap();
    }, [params]);

    const fetchService = async () => {
        if (!id) return;
        try {
            const res = await adminService.getService(id);
            setService(res.service);
        } catch (error) {
            toast.error("Failed to load service details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, [id]);

    const handleAction = async (action) => {
        try {
            if (action === "approve") {
                if (!confirm("Approve this service listing?")) return;
                await adminService.approveService(id);
                toast.success("Service Approved");
            }
            if (action === "reject") {
                if (!confirm("Reject/Block this service?")) return;
                await adminService.rejectService(id);
                toast.success("Service Blocked");
            }
            if (action === "delete") {
                if (!confirm("Permanently delete this service?")) return;
                await adminService.deleteService(id);
                toast.success("Service Deleted");
                router.back();
                return;
            }
            fetchService();
        } catch (err) {
            toast.error(`Action failed`);
        }
    };

    // --- SKELETON LOADER ---
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-64 bg-gray-200 rounded-2xl" />
                        <div className="h-40 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-48 bg-gray-200 rounded-xl" />
                        <div className="h-64 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!service) return <div className="text-center py-20">Service not found</div>;

    // Helper for Status Badge Color
    const getStatusColor = (status) => {
        if (status === "ACTIVE") return "bg-green-50 text-green-700 border-green-200";
        if (status === "BLOCKED") return "bg-red-50 text-red-700 border-red-200";
        return "bg-amber-50 text-amber-700 border-amber-200";
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-6">

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
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getStatusColor(service.status)}`}>
                                {service.status}
                            </span>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm">
                            <FaMapMarkerAlt className="text-rose-500" />
                            {service.city ? `${service.city.name}, ${service.city.state.name}` : "Location not specified"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {service.status !== "ACTIVE" && (
                        <button
                            onClick={() => handleAction('approve')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm font-medium text-sm"
                        >
                            <FaCheck /> Approve
                        </button>
                    )}
                    {service.status !== "BLOCKED" && (
                        <button
                            onClick={() => handleAction('reject')}
                            className="px-4 py-2 bg-white border border-amber-300 text-amber-600 rounded-lg hover:bg-amber-50 transition flex items-center gap-2 font-medium text-sm"
                        >
                            <FaTimes /> Block
                        </button>
                    )}
                    <button
                        onClick={() => handleAction('delete')}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2 font-medium text-sm"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ---------------- LEFT COLUMN (Main Info) ---------------- */}
                <div className="md:col-span-2 space-y-6">

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                        {/* Decorative Background Icon */}
                        <FaConciergeBell className="absolute top-4 right-4 text-9xl text-gray-500 opacity-50 transform rotate-12 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                                    <FaTag /> {service.category?.name}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description || "No description provided for this service."}
                            </p>
                        </div>
                    </div>

                    {/* 2. Service Details */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Service Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Service Category ID</p>
                                <p className="font-semibold text-gray-900">#{service.categoryId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Service ID</p>
                                <p className="font-semibold text-gray-900">#{service.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Rating</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                    {service.rating || 0} / 5 <span className="text-yellow-400">★</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Location</p>
                                <p className="font-semibold text-gray-900">
                                    {service.city?.name || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------- RIGHT COLUMN (Sidebar) ---------------- */}
                <div className="space-y-6">

                    {/* 1. Pricing Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium uppercase tracking-wide">
                            <FaMoneyBillWave /> Base Pricing
                        </div>
                        <div className="text-3xl font-extrabold text-gray-900">
                            ₹ {Number(service.basePrice).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Starting price per event/day</p>
                    </div>

                    {/* 2. Provider Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
                            <FaUserTie className="text-rose-500" />
                            <h3 className="font-bold">Provider Information</h3>
                        </div>

                        {service.provider ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                        {service.provider.legalname?.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-gray-900 truncate" title={service.provider.legalname}>
                                            {service.provider.legalname}
                                        </p>
                                        <p className="text-xs text-gray-500">ID: {service.provider.id}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <FaPhone className="w-3 text-gray-400" />
                                        <span>{service.provider.contact1}</span>
                                    </div>
                                    {service.provider.contact2 && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <FaPhone className="w-3 text-gray-400" />
                                            <span>{service.provider.contact2}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => router.push(`/admin/providers/${service.provider.id}`)}
                                    className="w-full py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                                >
                                    View Full Profile
                                </button>
                            </div>
                        ) : (
                            <p className="text-red-500 text-sm">Provider data missing</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;