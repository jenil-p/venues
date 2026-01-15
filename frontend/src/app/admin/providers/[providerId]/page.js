"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service";
import { FaUserTimes, FaArrowLeft, FaPhone, FaIdCard, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import toast from "react-hot-toast";

const ProviderDetailsPage = ({ params }) => {
    const router = useRouter();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    const [id, setId] = useState(null);

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setId(resolvedParams.providerId);
        }
        unwrapParams();
    }, [params]);

    const fetchProvider = async () => {
        if (!id) return;
        try {
            const res = await adminService.getProvider(id);
            setProvider(res.provider);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load provider details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProvider();
    }, [id]);

    const handleApprove = async () => {
        if (!confirm("Approve this provider? This will give them access to post venues.")) return;
        try {
            await adminService.approveProvider(id);
            toast.success("Provider Approved Successfully");
            fetchProvider(); // Refresh data
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async () => {
        if (!confirm("Reject this application?")) return;
        try {
            await adminService.rejectProvider(id);
            toast.success("Provider Rejected");
            fetchProvider();
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    // --- SKELETON LOADER ---
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                    <div className="flex gap-6">
                        <div className="w-32 h-32 bg-gray-200 rounded-full" />
                        <div className="space-y-3 flex-1">
                            <div className="h-6 w-1/3 bg-gray-200 rounded" />
                            <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="h-40 bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    if (!provider) return <div className="text-center py-20">Provider not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">

            {/* Header & Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium"
                >
                    <FaArrowLeft /> Back to List
                </button>
                <div className="flex gap-3">
                    {provider.status === "PENDING" && (
                        <>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition flex items-center gap-2"
                            >
                                <FaUserTimes /> Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold transition flex items-center gap-2 shadow-lg shadow-gray-200"
                            >
                                <FaUserCheck /> Approve Application
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Top Banner / Status */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="flex items-center gap-6">
                        <img
                            src={provider.photo}
                            alt={provider.legalname}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{provider.legalname}</h1>
                            <p className="text-gray-500 text-sm mt-1">Provider ID: #{provider.id}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${provider.status === "APPROVED" ? "bg-green-100 text-green-700 border-green-200" :
                            provider.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                                "bg-amber-100 text-amber-700 border-amber-200"
                        }`}>
                        {provider.status}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="p-8 grid md:grid-cols-2 gap-10">

                    {/* Column 1: Personal Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded text-gray-600"><FaPhone /></div>
                                <div>
                                    <p className="text-sm text-gray-500">Primary Contact</p>
                                    <p className="font-medium text-gray-900">{provider.contact1}</p>
                                </div>
                            </div>

                            {provider.contact2 && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded text-gray-600"><FaPhone /></div>
                                    <div>
                                        <p className="text-sm text-gray-500">Secondary Contact</p>
                                        <p className="font-medium text-gray-900">{provider.contact2}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded text-gray-600"><FaCalendarAlt /></div>
                                <div>
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(provider.dateOfBirth).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded text-gray-600"><FaMapMarkerAlt /></div>
                                <div>
                                    <p className="text-sm text-gray-500">Registered Address</p>
                                    <p className="font-medium text-gray-900">
                                        {provider.address ?
                                            `${provider.address.location}, ${provider.address.city.name}, ${provider.address.city.state.name} - ${provider.address.postalcode}`
                                            : "Address not available"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Legal & Documents */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Documents</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FaIdCard className="text-gray-500" />
                                    <p className="text-sm font-semibold text-gray-700">ID Proof Document</p>
                                </div>
                                {/* Render ID Proof Image or Link */}
                                <div className="border rounded-xl overflow-hidden bg-gray-50 relative group cursor-pointer">
                                    <img
                                        src={provider.idProof}
                                        alt="ID Proof"
                                        className="w-full h-48 object-cover group-hover:opacity-90 transition"
                                        onClick={() => window.open(provider.idProof, '_blank')}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                        <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">Click to View Full</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProviderDetailsPage;