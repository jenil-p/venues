"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import Navbar from "@/components/Navbar";
import { FaChevronRight, FaCheck, FaExclamationCircle } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";

const HostJoinPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    legalname: "",
    contact1: "",
    contact2: "",
    dateOfBirth: "",
    idProof: "",
    photo: "",
    address: {
        location: "",
        postalcode: "",
        cityId: ""
    }
  });

  useEffect(() => {
    async function loadCities() {
        try {
            const cityList = await providerService.getCities();
            setCities(Array.isArray(cityList) ? cityList : cityList.cities || []);
        } catch (error) {
            console.error("Failed to load cities", error);
        }
    }
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        address: { ...prev.address, [name]: value } 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };
  
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if(file) {
        const fakeUrl = `https://storage.cloud.com/${file.name}`;
        setFormData(prev => ({ ...prev, [fieldName]: fakeUrl }));
        if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    let newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
        if (!formData.legalname.trim()) newErrors.legalname = "Legal name is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.contact1.trim()) newErrors.contact1 = "Primary contact is required";
        else if (formData.contact1.length < 10) newErrors.contact1 = "Enter a valid 10-digit number";
    }

    if (currentStep === 2) {
        if (!formData.address.location.trim()) newErrors.location = "Street address is required";
        if (!formData.address.cityId) newErrors.cityId = "Please select a city";
        if (!formData.address.postalcode.trim()) newErrors.postalcode = "Postal code is required";
    }

    if (currentStep === 3) {
        if (!formData.idProof) newErrors.idProof = "Government ID proof is required";
        if (!formData.photo) newErrors.photo = "Profile photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
        setStep(step + 1);
        window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
        setLoading(true);
        const payload = {
            ...formData,
            address: {
                ...formData.address,
                cityId: Number(formData.address.cityId),
                postalcode: Number(formData.address.postalcode)
            }
        };

        const returned = await providerService.makeRequestToBeProvider(payload);
        console.log(returned);
        router.push('/host/success'); 
    } catch (error) {
        console.error("Failed to register:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const getInputClass = (errorKey) => `
    w-full p-4 border rounded-xl outline-none transition-all duration-200
    ${errors[errorKey] 
        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200" 
        : "border-gray-200 focus:border-black focus:ring-1 focus:ring-black bg-white hover:border-gray-300"
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="pt-28 pb-10 px-4 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100">
            <div 
                className="h-full bg-gradient-to-r from-rose-500 to-pink-600 transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            
            {/* Header */}
            <div className="mb-8">
                <span className="text-xs font-bold text-rose-500 tracking-wider uppercase mb-2 block">Step {step} of 3</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {step === 1 && "Tell us about yourself"}
                    {step === 2 && "Where are you located?"}
                    {step === 3 && "Verify your identity"}
                </h2>
                <p className="text-gray-500 text-lg">
                    {step === 1 && "We need your legal details to verify you as a host."}
                    {step === 2 && "This address will be used for your provider profile."}
                    {step === 3 && "Upload documents to ensure safety and trust."}
                </p>
            </div>

            {/* STEP 1: Personal Info */}
            {step === 1 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Legal Full Name <span className="text-rose-500">*</span></label>
                        <input 
                            name="legalname" 
                            value={formData.legalname} 
                            onChange={handleChange}
                            type="text" 
                            className={getInputClass('legalname')}
                            placeholder="e.g. John Doe"
                        />
                        {errors.legalname && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.legalname}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth <span className="text-rose-500">*</span></label>
                            <input 
                                name="dateOfBirth" 
                                value={formData.dateOfBirth} 
                                onChange={handleChange}
                                type="date" 
                                className={getInputClass('dateOfBirth')}
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.dateOfBirth}</p>}
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Contact <span className="text-rose-500">*</span></label>
                             <input 
                                name="contact1" 
                                value={formData.contact1} 
                                onChange={handleChange}
                                type="tel" 
                                maxLength={10}
                                className={getInputClass('contact1')}
                                placeholder="+91 98765..."
                             />
                             {errors.contact1 && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.contact1}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Secondary Contact <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input 
                            name="contact2" 
                            value={formData.contact2} 
                            onChange={handleChange}
                            type="tel" 
                            maxLength={10}
                            className={getInputClass('contact2')}
                            placeholder="+91 98765..."
                        />
                    </div>
                </div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address <span className="text-rose-500">*</span></label>
                        <input 
                            name="location" 
                            value={formData.address.location} 
                            onChange={handleAddressChange}
                            type="text" 
                            className={getInputClass('location')}
                            placeholder="123 Venue Street, Opp. Mall"
                        />
                        {errors.location && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.location}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                <select 
                                    name="cityId" 
                                    value={formData.address.cityId} 
                                    onChange={handleAddressChange}
                                    className={`${getInputClass('cityId')} appearance-none`}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    ▼
                                </div>
                            </div>
                            {errors.cityId && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.cityId}</p>}
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postal Code <span className="text-rose-500">*</span></label>
                             <input 
                                name="postalcode" 
                                value={formData.address.postalcode} 
                                onChange={handleAddressChange}
                                type="text" 
                                maxLength={6}
                                className={getInputClass('postalcode')}
                                placeholder="380001"
                             />
                             {errors.postalcode && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.postalcode}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Documents */}
            {step === 3 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* ID Proof Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Government ID Proof <span className="text-rose-500">*</span></label>
                        <div className={`border-2 border-dashed rounded-xl p-6 hover:border-black transition cursor-pointer relative bg-gray-50 flex flex-col items-center justify-center text-center group ${errors.idProof ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'idProof')} />
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 transition ${formData.idProof ? 'bg-green-100 text-green-600' : 'bg-white shadow-sm text-gray-400 group-hover:text-black'}`}>
                                {formData.idProof ? <FaCheck /> : <IoCloudUploadOutline size={24} />}
                            </div>
                            <h4 className="font-semibold text-gray-900">{formData.idProof ? "ID Proof Uploaded" : "Click to upload ID"}</h4>
                            <p className="text-sm text-gray-500 mt-1">{formData.idProof ? "File ready to submit" : "Aadhar, Pan Card, or Passport (Max 5MB)"}</p>
                        </div>
                        {errors.idProof && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.idProof}</p>}
                    </div>

                    {/* Photo Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo <span className="text-rose-500">*</span></label>
                        <div className={`border-2 border-dashed rounded-xl p-6 hover:border-black transition cursor-pointer relative bg-gray-50 flex flex-col items-center justify-center text-center group ${errors.photo ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'photo')} />
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 transition ${formData.photo ? 'bg-green-100 text-green-600' : 'bg-white shadow-sm text-gray-400 group-hover:text-black'}`}>
                                {formData.photo ? <FaCheck /> : <IoCloudUploadOutline size={24} />}
                            </div>
                            <h4 className="font-semibold text-gray-900">{formData.photo ? "Photo Uploaded" : "Click to upload Photo"}</h4>
                            <p className="text-sm text-gray-500 mt-1">{formData.photo ? "File ready to submit" : "Clear front-facing photo"}</p>
                        </div>
                        {errors.photo && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationCircle /> {errors.photo}</p>}
                    </div>

                </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
                <button 
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                    className={`text-sm font-bold text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-100 transition ${step === 1 ? 'opacity-0 cursor-default' : ''}`}
                >
                    Back
                </button>

                {step < 3 ? (
                    <button 
                        onClick={handleNext}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition active:scale-95 shadow-lg"
                    >
                        Next Step <FaChevronRight className="text-xs" />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-rose-500/30 active:scale-95"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HostJoinPage;