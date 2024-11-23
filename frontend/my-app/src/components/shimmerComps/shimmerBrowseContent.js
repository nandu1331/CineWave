// src/components/LoadingShimmer/ShimmerRow.js
import React from 'react';

export default function ShimmerBrowseContent() {
  // Create an array of 20 items to match potential max items
  const shimmerItems = Array(20).fill(null);

  return (
    <div className="pt-20 min-h-screen bg-black">
      <div className="container mx-auto px-4">
        {/* Title shimmer */}
        <div className="h-10 w-48 bg-gray-700 rounded mb-8 animate-pulse"></div>

        {/* Grid container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
          {shimmerItems.map((_, index) => (
            <div key={index} className="relative group">
              {/* Poster shimmer */}
              <div className="aspect-[2/3] w-full rounded-lg bg-gray-700 animate-pulse"></div>
              
              {/* Content shimmer - always visible unlike the actual content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black">
                {/* Title shimmer */}
                <div className="h-6 w-3/4 bg-gray-600 rounded mb-2 animate-pulse"></div>
                
                {/* Rating shimmer */}
                <div className="flex items-center gap-1">
                  {/* Star icon shimmer */}
                  <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
                  {/* Rating text shimmer */}
                  <div className="h-4 w-12 bg-gray-600 rounded animate-pulse"></div>
                </div>
                
                {/* Add button shimmer */}
                <div className="absolute right-3 bottom-72">
                  <div className="h-8 w-8 bg-gray-600 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
