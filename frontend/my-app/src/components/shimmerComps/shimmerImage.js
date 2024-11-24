// src/components/shimmerComps/ShimmerImage.js
const ShimmerImage = () => {
  return (
    <div className="relative">
      <div className="w-full h-[230px] bg-gray-700 animate-shimmer rounded-md">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 animate-shimmer"></div>
      </div>
    </div>
  );
};

export default ShimmerImage;
