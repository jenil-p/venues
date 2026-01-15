"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/api/admin.service";
import { FaCheck, FaTimes, FaTrash, FaTag } from "react-icons/fa";
import { CiLocationOn, CiStar } from "react-icons/ci";
import toast from "react-hot-toast";

const ServicesPage = () => {
    const router = useRouter();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        try {
            const res = await adminService.getAllService();
            setServices(res.services || []);
        } catch (error) {
            toast.error("Failed to fetch services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleOnClickService = (serviceId) => {
        if (serviceId) {
            router.push(`/admin/services/${serviceId}`);
        } else {
            console.error("ServiceID is missing");
        }
    }

    const handleAction = async (action, id) => {
        try {
            if (action === 'approve') await adminService.approveService(id);
            if (action === 'reject') await adminService.rejectService(id);
            if (action === 'delete') {
                if (!confirm("Delete this service?")) return;
                await adminService.deleteService(id);
            }
            toast.success(`Action successful`);
            fetchServices();
        } catch (err) {
            toast.error(`Action failed`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Services</h1>
                    <p className="text-gray-500 text-sm">Manage catering, decoration, and other services</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 animate-pulse text-center">Loading services...</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Service Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">City</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td onClick={() => handleOnClickService(service.id)} className="px-6 py-4 font-semibold text-gray-900 hover:underline cursor-pointer">{service.name}</td>
                                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                        <FaTag className="text-xs" /> {service.category.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700 flex items-center gap-2"><CiLocationOn />{service.city.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700 flex items-center"><CiStar />{service.rating}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${service.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" :
                                            service.status === "BLOCKED" ? "bg-red-100 text-red-700 border-red-200" :
                                                "bg-gray-100 text-gray-700 border-gray-200"
                                            }`}>
                                            {service.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {service.status !== "ACTIVE" && (
                                                <button onClick={() => handleAction('approve', service.id)} className="p-2 text-green-600 hover:bg-green-50 rounded"><FaCheck /></button>
                                            )}
                                            {service.status !== "BLOCKED" && (
                                                <button onClick={() => handleAction('reject', service.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded"><FaTimes /></button>
                                            )}
                                            <button onClick={() => handleAction('delete', service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
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

export default ServicesPage;