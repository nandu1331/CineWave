import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function DetailsBody({ details }) {
    function formatRunTime(runtime) {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`
    }

    return (
        <div className="p-7 flex flex-col gap-5">
            <h1 className="text-2xl">{details?.title || details?.original_title || details?.name}</h1>
            <div className="flex flex-row gap-2 align-middle items-center">
                <FontAwesomeIcon icon={faStar} className="text-yellow-600" />
                <p>{details.vote_average?.toFixed(1)}</p> 
                <p> • </p> 
                <p>{(details.release_date || details.first_air_date)?.split('-')[0]}</p>
                <p> • </p> 
                <p>{formatRunTime(details.runtime)}</p>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-2"> {/*genre*/}
                {details.genres?.map((genre) => (
                    <div
                        key={genre.id}
                        className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300 
                                hover:bg-neutral-700 transition-colors duration-200"
                    >
                        {genre.name}
                    </div>
                ))}
            </div>
            <p>{details.overview}</p>
            <p>{details.overview}</p>
            <p>{details.overview}</p>
        </div>
    )
}