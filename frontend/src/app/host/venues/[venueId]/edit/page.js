"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import { resourceService } from "@/api/resource.service";
import toast from "react-hot-toast";
import {
    FaArrowLeft, FaInfoCircle, FaMapMarkerAlt, FaList,
    FaCamera, FaMoneyBillWave, FaCheck, FaSave, FaTrash, FaPlus
} from "react-icons/fa";

const TABS = [
    { id: 'basics', label: 'Basic Info', icon: <FaInfoCircle /> },
    { id: 'location', label: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 'features', label: 'Amenities', icon: <FaList /> },
    { id: 'photos', label: 'Photos', icon: <FaCamera /> },
    { id: 'pricing', label: 'Pricing', icon: <FaMoneyBillWave /> },
];

const EditVenuePage = ({ params }) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basics');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [venueId, setVenueId] = useState(null);

    // Data States
    const [formData, setFormData] = useState(null);
    const [options, setOptions] = useState({ features: [], locations: [], types: [] });

    // 1. Init
    useEffect(() => {
        async function init() {
            const p = await params;
            setVenueId(p.venueId);

            try {
                // Fetch Venue & Options in parallel
                const [venueRes, optionsRes] = await Promise.all([
                    providerService.getVenue(p.venueId),
                    resourceService.getFullFormOptions()
                ]);

                setFormData(venueRes.venue);
                setOptions(optionsRes.data || optionsRes); // Adjust based on API structure
            } catch (err) {
                toast.error("Failed to load venue data");
                router.push('/host/venues');
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [params, router]);

    // --- HANDLERS ---

    const handleUpdate = async (sectionName, apiCall) => {
        setSaving(true);
        try {
            await apiCall();
            toast.success(`${sectionName} updated successfully`);
            // Optional: Refetch data if needed
        } catch (error) {
            console.error(error);
            toast.error(`Failed to update ${sectionName}`);
        } finally {
            setSaving(false);
        }
    };

    // 1. BASICS HANDLER
    const saveBasics = () => {
        const payload = {
            venuename: formData.venuename,
            description: formData.description,
            capacity: Number(formData.capacity),
            contactemail: formData.contactemail,
            contactnumber1: formData.contactnumber1,
            contactnumber2: formData.contactnumber2
        };
        handleUpdate("Basic Info", () => providerService.updateVenue(payload, venueId));
    };

    // 2. FEATURES HANDLER
    const saveFeatures = () => {
        // Backend expects { featureIds: [1, 2] }
        // formData.features is currently [{ feature: { id: 1, ... }, ... }]
        // We need to map current state to IDs
        const currentFeatureIds = formData.features.map(f => f.feature ? f.feature.id : f.featureId);
        handleUpdate("Amenities", () => providerService.addVenueFeatures({ featureIds: currentFeatureIds }, venueId));
    };

    const toggleFeature = (featId) => {
        setFormData(prev => {
            const exists = prev.features.some(f => (f.feature?.id === featId || f.featureId === featId));
            let newFeatures;
            if (exists) {
                newFeatures = prev.features.filter(f => (f.feature?.id !== featId && f.featureId !== featId));
            } else {
                // Add mock structure for immediate UI update
                newFeatures = [...prev.features, { featureId: featId, feature: options.features.find(x => x.id === featId) }];
            }
            return { ...prev, features: newFeatures };
        });
    };

    // 3. PRICING HANDLER
    const savePricing = () => {
        // Backend expects array: [{ unit, price, ... }]
        // Ensure price is number
        const payload = formData.pricing.map(p => ({
            unit: p.unit,
            price: Number(p.price),
            startTime: p.startTime,
            endTime: p.endTime
        }));
        handleUpdate("Pricing", () => providerService.addVenuePricing(payload, venueId));
    };

    // 4. PHOTOS HANDLERS
    const handleAddPhoto = async () => {
        const url = prompt("Enter Image URL (Demo):"); // Replace with file upload logic
        if (!url) return;

        // Optimistic UI Update
        const newOrder = formData.photos.length + 1;
        const newPhoto = { image: url, description: "", order: newOrder };

        // In real app, upload first, then call addVenuePhotos
        // Here we call backend to add specific photo
        try {
            await providerService.addVenuePhotos({ photos: [newPhoto] }, venueId);
            toast.success("Photo added");
            // Refresh locally
            setFormData(prev => ({ ...prev, photos: [...prev.photos, newPhoto] }));
        } catch (e) { toast.error("Failed to add photo"); }
    };

    const handleDeletePhoto = async (photoId, index) => {
        if (!confirm("Delete this photo?")) return;
        try {
            if (photoId) {
                await providerService.deleteVenuePhoto(venueId, photoId);
            }
            // Remove from local state
            const newPhotos = [...formData.photos];
            newPhotos.splice(index, 1);
            setFormData(prev => ({ ...prev, photos: newPhotos }));
            toast.success("Photo deleted");
        } catch (e) { toast.error("Failed to delete photo"); }
    };


    // --- RENDERERS ---

    if (loading) return <div className="p-20 text-center animate-pulse">Loading Editor...</div>;
    if (!formData) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'basics':
                return (
                    <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Venue Name</label>
                            <input
                                value={formData.venuename}
                                onChange={e => setFormData({ ...formData, venuename: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none h-32"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    value={formData.contactemail}
                                    onChange={e => setFormData({ ...formData, contactemail: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={saveBasics}
                                disabled={saving}
                                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2"
                            >
                                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {options.features.map(opt => {
                                const isSelected = formData.features.some(f => (f.feature?.id === opt.id || f.featureId === opt.id));
                                return (
                                    <div
                                        key={opt.id}
                                        onClick={() => toggleFeature(opt.id)}
                                        className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition ${isSelected ? "bg-rose-50 border-rose-500 text-rose-700" : "hover:bg-gray-50"}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? "bg-rose-500 border-rose-500" : "border-gray-300"}`}>
                                            {isSelected && <FaCheck className="text-white text-xs" />}
                                        </div>
                                        <span className="font-medium">{opt.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={saveFeatures}
                            disabled={saving}
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2"
                        >
                            {saving ? "Saving..." : <><FaSave /> Save Amenities</>}
                        </button>
                    </div>
                );

            case 'pricing':
                const priceRule = formData.pricing?.[0] || { unit: 'HOURLY', price: 0 };
                return (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                            <div className="flex gap-4">
                                {['HOURLY', 'DAILY'].map(u => (
                                    <button
                                        key={u}
                                        onClick={() => {
                                            const newPricing = [...formData.pricing];
                                            if (!newPricing[0]) newPricing[0] = {};
                                            newPricing[0].unit = u;
                                            setFormData({ ...formData, pricing: newPricing });
                                        }}
                                        className={`px-4 py-2 rounded-lg border font-semibold ${priceRule.unit === u ? "bg-black text-white" : "bg-white text-gray-600"}`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (₹)</label>
                            <input
                                type="number"
                                value={priceRule.price}
                                onChange={e => {
                                    const newPricing = [...formData.pricing];
                                    if (!newPricing[0]) newPricing[0] = { unit: 'HOURLY' };
                                    newPricing[0].price = e.target.value;
                                    setFormData({ ...formData, pricing: newPricing });
                                }}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none text-xl font-bold"
                            />
                        </div>
                        <button
                            onClick={savePricing}
                            disabled={saving}
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2"
                        >
                            {saving ? "Saving..." : <><FaSave /> Update Pricing</>}
                        </button>
                    </div>
                );

            case 'photos':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.photos.map((photo, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border">
                                    <img src={photo.image} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id, idx)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={handleAddPhoto}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
                            >
                                <FaPlus className="text-2xl mb-2" />
                                <span className="font-semibold">Add Photo</span>
                            </button>
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                        <h3 className="font-bold flex items-center gap-2"><FaInfoCircle /> Location Editing</h3>
                        <p className="text-sm mt-1">
                            Changing the location affects search results. To update the address, please contact support or delete and recreate the venue if it moved completely.
                        </p>
                        {/* Implement Address Form if you want to allow full editing, similar to Basics */}
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Venue</h1>
                        <p className="text-gray-500 text-sm">Update details for {formData.venuename}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Nav */}
                <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-5 py-4 flex items-center gap-3 font-medium transition ${activeTab === tab.id
                                    ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                    {renderContent()}
                </div>

            </div>
        </div>
    );
};

export default EditVenuePage;