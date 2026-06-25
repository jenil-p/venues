'use client';

const MyBookingsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f5f1eb] font-sans antialiased text-zinc-900">

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <div className="h-10 w-64 bg-zinc-300 animate-pulse rounded-xl" />
          <div className="h-5 w-96 bg-zinc-200 animate-pulse rounded mt-3" />
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#fdfaf5] border border-zinc-100 p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-zinc-200 animate-pulse rounded-xl mb-4" />
              <div className="h-10 w-20 bg-zinc-300 animate-pulse rounded-xl mb-2" />
              <div className="h-4 w-32 bg-zinc-200 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Bar Skeleton */}
          <div className="relative flex-1 max-w-md">
            <div className="h-11 w-full bg-[#fdfaf5] border border-zinc-200 rounded-xl animate-pulse" />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-zinc-100 p-1 rounded-xl w-fit">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-9 px-5 bg-white rounded-lg animate-pulse"
                style={{ width: i === 0 ? '110px' : '85px' }}
              />
            ))}
          </div>
        </div>

        {/* Bookings List Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#fdfaf5] border border-zinc-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl bg-zinc-200 animate-pulse flex-shrink-0" />

                {/* Content */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-72 bg-zinc-300 animate-pulse rounded" />
                    <div className="h-5 w-20 bg-zinc-200 animate-pulse rounded-full" />
                  </div>

                  <div className="h-4 w-80 bg-zinc-200 animate-pulse rounded" />

                  <div className="flex flex-wrap gap-4 pt-1">
                    <div className="h-4 w-36 bg-zinc-200 animate-pulse rounded" />
                    <div className="h-4 w-52 bg-zinc-200 animate-pulse rounded" />
                    <div className="h-4 w-28 bg-zinc-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>

              {/* Right Side - Price & Actions */}
              <div className="flex md:flex-col items-end md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                <div className="text-right space-y-1">
                  <div className="h-4 w-20 bg-zinc-200 animate-pulse rounded mx-auto md:ml-auto" />
                  <div className="h-8 w-28 bg-zinc-300 animate-pulse rounded" />
                  <div className="h-3 w-16 bg-zinc-200 animate-pulse rounded mx-auto md:ml-auto" />
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-6">
                  <div className="h-8 w-24 bg-zinc-200 animate-pulse rounded-lg" />
                  <div className="h-8 w-20 bg-zinc-200 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsSkeleton;