import React, { useState, useEffect } from "react";
import { tmdbAxios } from "../../axios";
import DetailsHero from "./DetailsHero";
import DetailsBody from "./MovieDetailsBody";
import { useParams } from "react-router-dom";

// Shimmer Component for Hero
const HeroShimmer = ({ isFullPage }) => {
    const containerClasses = isFullPage 
        ? "w-full h-[500px]" 
        : "w-full h-[400px]";

    return (
        <div className={`${containerClasses} bg-neutral-800 animate-pulse`}>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 shimmer"></div>
        </div>
    );
};

// Shimmer Component for Body
const BodyShimmer = ({ isFullPage }) => {
    return (
        <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((item) => (
                <div 
                    key={item} 
                    className="w-full h-20 bg-neutral-800 animate-pulse rounded-md"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 shimmer"></div>
                </div>
            ))}
        </div>
    );
};

export default function MovieDetailsCard({ movieId, onClose, mediaType }) {
    const [movieDetails, setMovieDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    
    // Use either props or params, with props taking precedence
    const activeId = movieId || params?.id;
    const activeMediaType = mediaType || params?.media_type;
    
    // Determine if component should render in full-page mode
    const isFullPage = !movieId && params?.id;

    useEffect(() => {
        // Only control body overflow in modal mode
        if (!isFullPage) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isFullPage]);

    useEffect(() => {
        const fetchDetails = async (id) => {
            if (!id) return;

            setIsLoading(true);
            try {
                let response;
                const mediaTypeFormatted = activeMediaType?.toLowerCase();
                const endpoint = mediaTypeFormatted === 'movie' ? 'movie' : 'tv';
                
                response = await tmdbAxios.get(`${endpoint}/${id}`);
                setMovieDetails(response.data);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails(activeId);
    }, [activeId, activeMediaType]);

    if (!activeId || !activeMediaType) {
        return null;
    }

    const containerClassName = isFullPage
        ? "min-h-screen bg-black w-[100%]" // Full page layout
        : "fixed inset-0 pt-32 z-10 items-center text-white bg-black bg-opacity-80 justify-center overflow-y-auto"; // Modal layout

    const contentClassName = isFullPage
        ? "w-full max-w-full mx-auto px-3" // Full page content
        : "relative w-11/12 md:w-9/12 lg:w-7/12 max-w-4xl mx-auto z-20 bg-neutral-900 rounded-lg shadow-2xl overflow-y-auto"; // Modal content

    return (
        <div className={`${containerClassName} text-white`}>
            <div className={`${contentClassName} text-white`}>
                {!isFullPage && (
                    <button 
                        onClick={onClose}
                        className="absolute top-0 right-2 z-50 
                                 text-white hover:text-gray-300 
                                 bg-neutral-800 rounded-full 
                                 w-10 h-10 flex items-center justify-center"
                    >
                        ✕
                    </button>
                )}
                
                {isLoading ? (
                    <>
                        <HeroShimmer isFullPage={isFullPage} />
                        <BodyShimmer isFullPage={isFullPage} />
                    </>
                ) : (
                    <>
                        <DetailsHero 
                            details={movieDetails} 
                            mediaType={activeMediaType?.toLowerCase() === 'movie' ? 'movie' : 'tv'}
                            isFullPage={isFullPage}
                        />
                        <DetailsBody 
                            details={movieDetails} 
                            mediaType={activeMediaType?.toLowerCase() === 'movie' ? 'movie' : 'tv'}
                            isFullPage={isFullPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

// // Add this to your global CSS or Tailwind config
// const shimmerStyles = `
//     @keyframes shimmer {
//         0% {
//             transform: translateX(-100%);
//         }
//         100% {
//             transform: translateX(100%);
//         }
//     }

//     .shimmer {
//         animation: shimmer 1.5s infinite linear;
//     }
// `;