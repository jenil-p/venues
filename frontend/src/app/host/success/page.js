import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function HostSuccess() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <FaCheckCircle className="text-green-500 text-6xl mb-6 animate-bounce" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Submitted!</h1>
      <p className="text-gray-500 text-center max-w-md mb-8">
        We have received your request to become a host. Our team will verify your details and update your status shortly.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}