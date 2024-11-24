// src/components/common/Shimmer.js
const Shimmer = ({ className }) => {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:400%_100%] ${className}`}>
    </div>
  );
};

export default Shimmer;
