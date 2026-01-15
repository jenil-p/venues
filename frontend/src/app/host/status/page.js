"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaCheckCircle, FaClock, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { providerService } from "@/api/provider.service";

const HostStatusPage = () => {
  const { authStatus } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (authStatus === "logged_out") {
      router.push("/");
      return;
    }

    const fetchStatus = async () => {
      try {
        const data = await providerService.getProviderRequestStatus();
        if (!data || !data.exists) {
          router.push("/host/join");
        } else {
          setApplication(data.profile);
        }
      } catch (error) {
        console.error("Error fetching status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [authStatus, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-start md:items-center">
              <div className="space-y-3">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
            </div>

            <div className="p-8">
              <div className="w-full h-40 bg-gray-100 rounded-xl animate-pulse mb-8" />
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-5" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>

              </div>
            </div>
            <div className="bg-gray-50 p-6 flex justify-end border-t border-gray-100">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const getStatusUI = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: <FaCheckCircle className="text-3xl mb-2" />,
          title: "Application Approved!",
          desc: "You are now an official host on VenueFinder. Switch your dashboard view to start listing.",
        };
      case "REJECTED":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: <FaExclamationCircle className="text-3xl mb-2" />,
          title: "Application Rejected",
          desc: "Unfortunately, we couldn't approve your profile at this time. Please contact support for details.",
        };
      default:
        return {
          color: "text-amber-600 bg-amber-50 border-amber-200",
          icon: <FaClock className="text-3xl mb-2" />,
          title: "Application Pending",
          desc: "Our admins are currently reviewing your documents. This process usually takes 24-48 hours.",
        };
    }
  };

  const uiState = getStatusUI(application.status);

  const renderAddress = () => {
    const addr = application.address;
    if (!addr) return "No address provided";
    return `${addr.location || ''}, ${addr.city.name || ''}, ${addr.city.state.name || ''} - ${ addr.postalcode || ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition"
        >
          <FaArrowLeft /> Back to Home
        </button>

        {/* Main Status Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          {/* Header Section */}
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Host Application</h1>
              <p className="text-gray-500 text-sm mt-1">Application ID: #{application.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-semibold ${uiState.color}`}>
              {application.status}
            </div>
          </div>

          <div className="p-8">
            {/* Status Message */}
            <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed mb-8 text-center ${uiState.color}`}>
              {uiState.icon}
              <h2 className="text-lg font-bold">{uiState.title}</h2>
              <p className="text-sm opacity-90 mt-1 max-w-md">{uiState.desc}</p>
            </div>

            {/* Application Summary Details */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Application Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo & Name */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={application.photo}
                  alt="Applicant"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-500">Legal Name</p>
                  <p className="font-semibold text-gray-900 truncate">{application.legalname}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-semibold text-gray-900">{application.contact1}</p>
              </div>

              {/* Address Preview */}
              <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg shadow-sm text-rose-500">
                  <BiBuildingHouse size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered Address</p>
                  <p className="font-medium text-gray-900">
                    {renderAddress()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HostStatusPage;