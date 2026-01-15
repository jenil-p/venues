"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaUserShield } from "react-icons/fa";
import toast from "react-hot-toast";

import { adminService } from "@/api/admin.service";

const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchRoles = async () => {
        try {
            const res = await adminService.getAllRoles();
            setRoles(res.roles || []);
        } catch (error) {
            toast.error("Failed to fetch roles");
        }
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newRole.trim()) return;
        try {
            await adminService.createRole(newRole);
            toast.success("Role created");
            setNewRole("");
            fetchRoles();
        } catch (err) {
            toast.error("Failed to create role");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this role?")) return;
        try {
            await adminService.deleteRole(id);
            toast.success("Role deleted");
            fetchRoles();
        } catch (err) {
            toast.error("Failed to delete role");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
                <p className="text-gray-500 text-sm">Define user access levels</p>
            </div>

            {/* Create Role Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Add New Role</h3>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="e.g. MODERATOR"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none uppercase"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value.toUpperCase())}
                    />
                    <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition flex items-center gap-2">
                        <FaPlus /> Create
                    </button>
                </form>
            </div>

            {/* Roles List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
                    Existing Roles
                </div>
                <div className="divide-y divide-gray-100">
                    {roles.map((role, idx) => (
                        <div key={idx} className="px-6 py-4 flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                                    <FaUserShield />
                                </div>
                                <span className="font-medium text-gray-800">{role.rolename}</span>
                            </div>
                            {role.rolename !== 'ADMIN' && role.rolename !== 'USER' && (
                                <button onClick={() => handleDelete(role.id)} className="text-gray-400 hover:text-red-500 transition">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RolesPage;