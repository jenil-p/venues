"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { providerService } from "@/api/provider.service";
import Navbar from "@/components/Navbar";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";

const HostJoinPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  
  // Form State
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
        const cityList = await providerService.getCities();
        setCities(cityList);
    }
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        address: { ...prev.address, [name]: value } 
    }));
  };
  
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if(file) {
        const fakeUrl = `https://storage.cloud.com/${file.name}`;
        setFormData(prev => ({ ...prev, [fieldName]: fakeUrl }));
        alert(`File uploaded! (Mock URL: ${fakeUrl})`);
    }
  };

  const handleSubmit = async () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-10 px-4 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="h-2 w-full bg-gray-100">
            <div 
                className="h-full bg-rose-500 transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {step === 1 && "Tell us about yourself"}
                    {step === 2 && "Where are you located?"}
                    {step === 3 && "Verify your identity"}
                </h2>
                <p className="text-gray-500">
                    {step === 1 && "We need your legal details to verify you as a host."}
                    {step === 2 && "This address will be used for your provider profile."}
                    {step === 3 && "Upload documents to ensure safety and trust."}
                </p>
            </div>

            {step === 1 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Legal Full Name</label>
                        <input 
                            name="legalname" 
                            value={formData.legalname} 
                            onChange={handleChange}
                            type="text" 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                                name="dateOfBirth" 
                                value={formData.dateOfBirth} 
                                onChange={handleChange}
                                type="date" 
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
                             <input 
                                name="contact1" 
                                value={formData.contact1} 
                                onChange={handleChange}
                                type="tel" 
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                placeholder="+91 98765..."
                             />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Contact (Optional)</label>
                        <input 
                            name="contact2" 
                            value={formData.contact2} 
                            onChange={handleChange}
                            type="tel" 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            placeholder="+91 98765..."
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input 
                            name="location" 
                            value={formData.address.location} 
                            onChange={handleAddressChange}
                            type="text" 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                            placeholder="123 Venue Street, Opp. Mall"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <select 
                                name="cityId" 
                                value={formData.address.cityId} 
                                onChange={handleAddressChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                            >
                                <option value="">Select City</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                             <input 
                                name="postalcode" 
                                value={formData.address.postalcode} 
                                onChange={handleAddressChange}
                                type="text" 
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                placeholder="380001"
                             />
                        </div>
                    </div>
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border-dashed border-2">
                        Map Integration (Coming Soon)
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-rose-500 transition cursor-pointer relative bg-gray-50">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'idProof')} />
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500 text-xl">
                                {formData.idProof ? <FaCheck /> : <IoCloudUploadOutline />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Upload ID Proof</h4>
                                <p className="text-sm text-gray-500">{formData.idProof ? "File Selected" : "Aadhar, Pan Card, or Passport"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 hover:border-rose-500 transition cursor-pointer relative bg-gray-50">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'photo')} />
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500 text-xl">
                                {formData.photo ? <FaCheck /> : <IoCloudUploadOutline />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Your Profile Photo</h4>
                                <p className="text-sm text-gray-500">{formData.photo ? "File Selected" : "Clear front-facing photo"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                        Note: Your profile will be reviewed by our admin team before approval.
                    </div>
                </div>
            )}

            <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
                <button 
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                    className={`font-semibold underline text-gray-800 ${step === 1 ? 'opacity-0 cursor-default' : 'hover:text-black'}`}
                >
                    Back
                </button>

                {step < 3 ? (
                    <button 
                        onClick={() => setStep(step + 1)}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                        Next <FaChevronRight className="text-sm" />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg shadow-rose-500/30"
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