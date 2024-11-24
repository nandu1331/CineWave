const ShimmerRow = () => {
  return (
    <div className="my-5 text-white">
      <div className="h-8 w-48 mb-4 rounded-md animate-shimmer bg-gray-700" /> {/* Title shimmer */}
      <div className="flex flex-row gap-4 overflow-x-hidden">
        {[1,2,3,4,5,6].map((item) => (
          <div key={item} className="flex-shrink-0">
            <div className="w-[160px] h-[240px] rounded-md animate-imageSkeleton bg-skeleton-gradient" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerRow;