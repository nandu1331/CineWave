import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { tmdbAxios } from "../../axios";
import RecommendationCard from "./RecommendationCard";

export default function DetailsBody({ details, mediaType }) {
    const [recommendations, setRecommendations] = useState([]);

    const formatRunTime = (runtime) => {
        if (!runtime) return "N/A";
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        const fetchRecommendations = async (id) => {
            try {
                const response = await tmdbAxios.get(`/${mediaType}/${id}/recommendations`);
                setRecommendations(response.data.results);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            }
        };

        if (details?.id) {
            fetchRecommendations(details.id);
        }
    }, [details, mediaType]);

    return (
        <div className="p-7 flex flex-col gap-5 bg-black text-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold">{details?.title || details?.original_title || details?.name}</h1>
            <div className="flex flex-row gap-2 items-center">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                <p className="font-medium">{details.vote_average?.toFixed(1) || "N/A"}</p>
                <p> • </p>
                <p>{(details.release_date || details.first_air_date)?.split('-')[0] || "N/A"}</p>
                <p> • </p>
                <p>{formatRunTime(details?.runtime)}</p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-2">
                {details.genres?.map((genre) => (
                    <div
                        key={genre.id}
                        className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300 hover:bg-neutral-700 transition-colors duration-200"
                    >
                        {genre.name}
                    </div>
                ))}
            </div>
            <p className="text-lg">{details.overview || "No overview available."}</p>
            <h2 className="text-2xl font-semibold mt-5">Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {recommendations?.slice(0, 9).map((item) => (
                    <RecommendationCard 
                        key={item.id}
                        title={item?.name || item?.title || item?.original_title}
                        poster={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                        rating={item.vote_average?.toFixed(1) || "N/A"}
                        releaseYear={(item.release_date || item.first_air_date)?.split('-')[0] || "N/A"}
                        overview={item?.overview}
                    />
                ))}
            </div>
        </div>
    );
}