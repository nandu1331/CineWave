const ShimmerBanner = () => {
  return (
    <div className="relative h-[448px] bg-black">
      {/* Main banner image shimmer */}
      <div className="absolute inset-0 animate-imageSkeleton bg-skeleton-gradient" />
      
      {/* Content shimmer */}
      <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black">
        <div className="h-12 w-1/3 mb-4 rounded-md animate-shimmer bg-gray-700" />
        <div className="h-4 w-1/2 mb-2 rounded-md animate-shimmer bg-gray-700" />
        <div className="h-4 w-2/3 rounded-md animate-shimmer bg-gray-700" />
      </div>
    </div>
  );
};

export default ShimmerBanner;
