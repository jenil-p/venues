'use client';

const BookingDetailSkeleton = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen font-sans antialiased">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white border-b border-[#EBE6DD] flex items-center px-4 sm:px-8">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-5 w-28 bg-gray-200 animate-pulse rounded font-mono" />
        </div>

        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hero Image Skeleton */}
            <div className="relative rounded-3xl overflow-hidden border border-[#EBE6DD] h-[340px] bg-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-3 w-3/4">
                <div className="h-3 w-40 bg-white/30 animate-pulse rounded" />
                <div className="h-9 w-96 bg-white/40 animate-pulse rounded" />
                <div className="h-4 w-64 bg-white/30 animate-pulse rounded" />
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-3xl border border-[#EBE6DD] p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="h-8 w-52 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-7 w-32 bg-gray-200 animate-pulse rounded-full" />
              </div>

              {/* Date Boxes */}
              <div className="grid sm:grid-cols-2 gap-6 bg-[#FAF8F5] rounded-2xl p-5 border border-[#EBE6DD]">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-300 animate-pulse rounded" />
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-300 animate-pulse rounded" />
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>

              {/* Guests & Duration */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-300 animate-pulse rounded" />
                  <div className="h-7 w-40 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-300 animate-pulse rounded" />
                  <div className="h-7 w-36 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-300 animate-pulse rounded" />
                <div className="h-24 bg-gray-100 animate-pulse rounded-xl" />
              </div>

              {/* Amenities Skeleton */}
              <div className="pt-4">
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                  ))}
                </div>
              </div>
            </div>

            {/* Cancellation Policy Skeleton */}
            <div className="bg-white rounded-3xl border border-[#EBE6DD] p-6 flex gap-4">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Sidebar - Price Summary Skeleton */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#EBE6DD] p-8 sticky top-8 space-y-6">
              <div className="h-7 w-36 bg-gray-200 animate-pulse rounded" />
              
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                    <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EBE6DD] pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-8 w-28 bg-gray-300 animate-pulse rounded-xl" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="h-14 w-full bg-gray-300 animate-pulse rounded-2xl" />
                <div className="h-12 w-full bg-gray-100 animate-pulse rounded-2xl" />
              </div>

              <div className="text-center pt-4">
                <div className="h-3 w-48 mx-auto bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetailSkeleton;