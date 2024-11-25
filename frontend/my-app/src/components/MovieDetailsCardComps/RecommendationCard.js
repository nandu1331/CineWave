import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function RecommendationCard({
    title,
    poster,
    rating,
    releaseYear,
    overview,
}) {
    return (
        <div className="flex flex-col bg-[#111] rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
            <img 
                src={poster} 
                alt={`${title} poster`} 
                className="w-full h-64 object-cover"
            />
            <div className="p-4 flex flex-col">
                <div className="flex flex-row items-center mb-2">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                    <p className="font-semibold">{rating || "N/A"}</p>
                    <p className="mx-2">•</p>
                    <p className="text-gray-400">{releaseYear || "N/A"}</p>
                </div>
                <p className="text-sm text-gray-300">
                    {overview ? (overview.length > 60 ? `${overview.slice(0, 60)}...` : overview) : "No overview available."}
                </p>
            </div>
        </div>
    );
}