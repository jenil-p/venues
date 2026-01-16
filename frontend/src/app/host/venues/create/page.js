"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resourceService } from "@/api/resource.service";
import { providerService } from "@/api/provider.service";
import toast from "react-hot-toast";
import { FaBuilding, FaMapMarkerAlt, FaList, FaCamera, FaRupeeSign, FaCheck, FaArrowRight, FaArrowLeft, FaTrash } from "react-icons/fa";

const STEPS = [
    { id: 1, title: "Category", icon: <FaBuilding /> },
    { id: 2, title: "Basics", icon: <FaList /> },
    { id: 3, title: "Location", icon: <FaMapMarkerAlt /> },
    { id: 4, title: "Features", icon: <FaCheck /> },
    { id: 5, title: "Photos", icon: <FaCamera /> },
    { id: 6, title: "Pricing", icon: <FaRupeeSign /> },
];

export default function CreateVenueWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [options, setOptions] = useState({
        types: [],
        features: [],
        locations: []
    });

    const [formData, setFormData] = useState({
        typeId: null,
        venuename: "",
        description: "",
        capacity: "",
        contactemail: "",
        contactnumber1: "",
        contactnumber2: "",
        address: {
            location: "",
            postalcode: "",
            latitude: 0,
            longitude: 0,
            cityId: ""
        },
        featureIds: [],
        photos: [],
        pricing: [{ unit: "HOURLY", price: "", startTime: null, endTime: null }] 
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await resourceService.getFullFormOptions();
                setOptions(res.data || res);
            } catch (err) {
                toast.error("Failed to load form options");
            }
        };
        fetchOptions();
    }, []);


    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    const toggleFeature = (id) => {
        setFormData(prev => {
            const exists = prev.featureIds.includes(id);
            if (exists) return { ...prev, featureIds: prev.featureIds.filter(f => f !== id) };
            return { ...prev, featureIds: [...prev.featureIds, id] };
        });
    };

    const handlePhotoAdd = (e) => {
        const url = prompt("Enter image URL (For demo):");
        if (url) {
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, { image: url, description: "", order: prev.photos.length + 1 }]
            }));
        }
    };

    const removePhoto = (index) => {
        const newPhotos = [...formData.photos];
        newPhotos.splice(index, 1);
        const reordered = newPhotos.map((p, i) => ({ ...p, order: i + 1 }));
        setFormData(prev => ({ ...prev, photos: reordered }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!formData.venuename || !formData.typeId || formData.photos.length < 1) {
                toast.error("Please fill all required fields");
                setLoading(false);
                return;
            }

            await providerService.listFillVenue(formData);
            toast.success("Venue Listed Successfully!");
            router.push("/host/venues");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to list venue");
        } finally {
            setLoading(false);
        }
    };


    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {options.types.map(type => (
                            <div
                                key={type.id}
                                onClick={() => handleChange('typeId', type.id)}
                                className={`cursor-pointer p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-md ${formData.typeId === type.id
                                        ? "border-rose-500 bg-rose-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="text-3xl">{/* Render Icon if available, else generic */} 🏢 </div>
                                <span className={`font-semibold ${formData.typeId === type.id ? "text-rose-600" : "text-gray-700"}`}>{type.name}</span>
                            </div>
                        ))}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Venue Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                placeholder="e.g. The Grand Palace Hall"
                                value={formData.venuename}
                                onChange={(e) => handleChange('venuename', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition h-32"
                                placeholder="Describe the ambiance, specialized events, etc."
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Guest Capacity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                    value={formData.capacity}
                                    onChange={(e) => handleChange('capacity', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email for Inquiries</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none transition"
                                    value={formData.contactemail}
                                    onChange={(e) => handleChange('contactemail', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Primary Contact</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none" value={formData.contactnumber1} onChange={(e) => handleChange('contactnumber1', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Secondary (Optional)</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none" value={formData.contactnumber2} onChange={(e) => handleChange('contactnumber2', e.target.value)} />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                const selectedState = options.locations.find(s => s.cities.some(c => c.id == formData.address.cityId));
                return (
                    <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                            Tip: Providing accurate location helps users find you on the map.
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Street Address / Landmark</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none"
                                value={formData.address.location}
                                onChange={(e) => handleAddressChange('location', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                                    value={formData.address.cityId}
                                    onChange={(e) => handleAddressChange('cityId', Number(e.target.value))}
                                >
                                    <option value="">Select City</option>
                                    {options.locations.map(state => (
                                        <optgroup key={state.id} label={state.name}>
                                            {state.cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none"
                                    value={formData.address.postalcode}
                                    onChange={(e) => handleAddressChange('postalcode', e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Latitude/Longitude Hidden or Manual Entry for now */}
                    </div>
                );

            case 4:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="mb-4 text-gray-500">What does this venue offer?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {options.features.map(feature => (
                                <div
                                    key={feature.id}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${formData.featureIds.includes(feature.id)
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.featureIds.includes(feature.id) ? "bg-rose-500 border-rose-500" : "border-gray-300"
                                        }`}>
                                        {formData.featureIds.includes(feature.id) && <FaCheck className="text-white text-xs" />}
                                    </div>
                                    <span className="font-medium">{feature.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div
                            onClick={handlePhotoAdd}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition mb-6"
                        >
                            <FaCamera className="text-4xl text-gray-400 mb-3" />
                            <p className="font-semibold text-gray-700">Add Photos</p>
                            <p className="text-sm text-gray-400">Click to upload (Min 5 recommended)</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.photos.map((photo, index) => (
                                <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                                    <img src={photo.image} alt="Upload" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-1 text-center">
                                        Order: {photo.order}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                            <h4 className="font-bold text-green-800">Set your base price</h4>
                            <p className="text-sm text-green-700">You can add complex seasonal pricing later from your dashboard.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pricing Model</label>
                            <div className="flex gap-4">
                                {['HOURLY', 'DAILY'].map(unit => (
                                    <div
                                        key={unit}
                                        onClick={() => {
                                            const newPricing = [...formData.pricing];
                                            newPricing[0].unit = unit;
                                            setFormData({ ...formData, pricing: newPricing });
                                        }}
                                        className={`px-6 py-3 rounded-lg border cursor-pointer font-semibold ${formData.pricing[0].unit === unit ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
                                            }`}
                                    >
                                        {unit}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price Amount (₹)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 outline-none text-xl font-bold"
                                placeholder="0.00"
                                value={formData.pricing[0].price}
                                onChange={(e) => {
                                    const newPricing = [...formData.pricing];
                                    newPricing[0].price = e.target.value;
                                    setFormData({ ...formData, pricing: newPricing });
                                }}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="max-w-4xl mx-auto pb-20">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">List your property</h1>
                <div className="flex items-center gap-2 mt-4">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className={`flex items-center gap-2 text-sm font-medium ${step === s.id ? "text-rose-600" : step > s.id ? "text-black" : "text-gray-400"}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === s.id ? "border-rose-600 bg-rose-50" : step > s.id ? "bg-black text-white border-black" : "border-gray-300"}`}>
                                    {step > s.id ? <FaCheck /> : s.id}
                                </span>
                                <span className="hidden md:inline">{s.title}</span>
                            </div>
                            {i !== STEPS.length - 1 && <div className={`h-[2px] w-8 ${step > s.id ? "bg-black" : "bg-gray-200"}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[400px]">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    {STEPS[step - 1].icon} {STEPS[step - 1].title}
                </h2>
                {renderStepContent()}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:pl-72 z-30">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <FaArrowLeft /> Back
                    </button>

                    {step < 6 ? (
                        <button
                            onClick={() => setStep(prev => Math.min(6, prev + 1))}
                            className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition flex items-center gap-2"
                        >
                            Next <FaArrowRight />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition flex items-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-70"
                        >
                            {loading ? "Publishing..." : "Publish Listing"} <FaCheck />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}