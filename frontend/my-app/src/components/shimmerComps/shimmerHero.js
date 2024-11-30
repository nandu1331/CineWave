// ShimmerHero.js
const ShimmerHero = ({ isFullPage }) => {
    return (
        <div className={`relative w-full overflow-hidden ${
            isFullPage 
                ? "h-[30vh] md:h-[70vh] lg:h-[80vh]" 
                : "h-[30vh] md:h-[40vh] lg:h-[50vh]"
        }`}>
            <div className="absolute inset-0 bg-neutral-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-animation" />
            </div>
            
            {/* Shimmer for Movie Logo */}
            <div className={`absolute ${
                isFullPage 
                    ? 'bottom-8 left-6 md:bottom-12 md:left-10 lg:bottom-16 lg:left-14'
                    : 'bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8'
            }`}>
                <div className="w-[130px] md:w-[160px] lg:w-[200px] h-[60px] bg-neutral-800 rounded-lg animate-pulse" />
            </div>

            {/* Shimmer for Controls */}
            <div className={`absolute flex items-center gap-3 ${
                isFullPage 
                    ? 'bottom-5 right-0 lg:bottom-16'
                    : 'bottom-4 right-0 lg:bottom-8'
            }`}>
                <div className="w-8 h-8 bg-neutral-800 rounded-full animate-pulse" />
                <div className="w-16 h-8 bg-neutral-800 rounded-l-lg animate-pulse" />
            </div>
        </div>
    );
};

export default ShimmerHero;