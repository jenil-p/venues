"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service.js";
import { FaUserTimes, FaUserSlash } from "react-icons/fa";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import toast from "react-hot-toast";

const ProvidersPage = () => {
    const router = useRouter();

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    // Fetch Data
    const fetchProviders = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllPrviders();
            console.log(res)
            setProviders(res.providers || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    // Handlers
    const handleApprove = async (id) => {
        if (!confirm("Are you sure you want to approve this provider?")) return;
        try {
            await adminService.approveProvider(id);
            toast.success("Provider Approved");
            fetchProviders();
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Are you sure you want to reject this provider?")) return;
        console.log("reject him ", id)
        try {
            await adminService.rejectProvider(id);
            toast.success("Provider Rejected");
            fetchProviders();
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this provider?")) return;
        try {
            await adminService.deleteProvider(id);
            toast.success("Provider Deleted");
            fetchProviders();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleOnclick = async (providerId) =>{
        if (providerId) {
        router.push(`/admin/providers/${providerId}`);
        } else {
        console.error("Venue ID is missing");
        }
    }

    // Filtering Logic
    const filteredProviders = providers.filter(p => {
        if (filter === "ALL") return true;
        return p.status === filter;
    });

    // Helper for Status Badge
    const StatusBadge = ({ status }) => {
        const styles = {
            APPROVED: "bg-green-100 text-green-700 border-green-200",
            PENDING: "bg-amber-100 text-amber-700 border-amber-200",
            REJECTED: "bg-red-100 text-red-700 border-red-200",
            DRAFT: "bg-gray-100 text-gray-600 border-gray-200"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.DRAFT}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Provider Requests</h1>
                    <p className="text-gray-500 text-sm">Manage host applications and approvals</p>
                </div>

                {/* Filters */}
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === f ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProviders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No providers found with status "{filter}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProviders.map((provider) => (
                                        <tr key={provider.id} onClick={() => handleOnclick(provider.id)} className="bg-white border-b hover:bg-gray-50 transition">
                                            {/* Applicant Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img className="w-10 h-10 rounded-full object-cover bg-gray-200" src={provider.photo} alt="" />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{provider.legalname}</div>
                                                        <div className="text-xs text-gray-500">ID: {provider.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900">{provider.contact1}</div>
                                                <div className="text-xs text-gray-500">User ID: {provider.userId}</div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <StatusBadge status={provider.status} />
                                            </td>

                                            {/* Date (Mocked format if date not in res) */}
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date().toLocaleDateString()}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {provider.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(provider.id)}
                                                                title="Approve"
                                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                                                            >
                                                                <FaUserCheck />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(provider.id)}
                                                                title="Reject"
                                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                            >
                                                                <FaUserTimes />
                                                            </button>
                                                        </>
                                                    )}
                                                    {provider.status === "APPROVED" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleReject(provider.id)}
                                                                title="Reject"
                                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                            >
                                                                <FaUserTimes />
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* If Rejected, allow re-approval */}
                                                    {provider.status === "REJECTED" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(provider.id)}
                                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                                                            >
                                                                < FaUserPlus />
                                                            </button>
                                                            <button onClick={() => handleDelete(provider.id)}
                                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                                            >
                                                                <FaUserSlash />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProvidersPage;