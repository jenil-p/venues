import React from 'react';
import VenueCard from '@/components/cards/VenueCard';

const SectionContainer = ({ title, subtitle, children }) => (
  <section className="w-full py-6">
    <div className="flex flex-col gap-1 mb-6 px-1">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Suggestions = ({ venues, isLoading }) => {

  const skeletons = Array(10).fill(0);

  if (isLoading) {
    return (
      <div className="w-[90%] m-auto pt-24 pb-10 px-6 2xl:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-x-6 gap-y-10">
          {skeletons.map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-square w-full bg-gray-200 rounded-xl" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] m-auto pt-24 pb-10 px-6 2xl:px-10">

      <SectionContainer title="Explore Venues" subtitle="Latest additions to our exclusive list">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-x-6 gap-y-10">
          {venues.map((venue, i) => (
            <VenueCard key={`venue-${i}`} venue={venue} />
          ))}
        </div>
      </SectionContainer>

    </div>
  );
};

export default Suggestions;