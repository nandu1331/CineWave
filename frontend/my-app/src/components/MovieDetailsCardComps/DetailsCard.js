import React, {useState, useEffect} from "react";
import { tmdbAxios } from "../../axios";
import DetailsHero from "./DetailsHero"
import DetailsBody from "./MovieDetailsBody"

export default function MovieDetailsCard({ movieId, onClose, mediaType }) {
    const [movieDetails, setMovieDetails] = useState({})

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        const fetchDetails = async (movieId) => {
            let response
            if (mediaType === 'Movie') {
                response = await tmdbAxios.get(`movie/${movieId}`)
            } else {
                response = await tmdbAxios.get(`tv/${movieId}`) 
            }
            setMovieDetails(response.data)
        }
        fetchDetails(movieId);
    }, [movieId])

    return (
        <div className="fixed inset-0 pt-32 z-10 items-center text-white bg-black bg-opacity-80 justify-center overflow-y-auto">
            <div className="relative w-10/12  md:w-9/12 lg:w-7/12 max-w-4xl mx-auto z-20
                            bg-neutral-900 rounded-lg shadow-2xl
                            overflow-y-auto"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-0 right-2 z-50 
                               text-white hover:text-gray-300 
                               bg-neutral-800 rounded-full 
                               w-10 h-10 flex items-center justify-center"
                >
                    ✕
                </button>
                <DetailsHero details={movieDetails} mediaType={mediaType === 'Movie' ? 'movie' : 'tv'}/>
                <DetailsBody details={movieDetails} mediaType={mediaType === 'Movie' ? 'movie' : 'tv'}/>
            </div>
        </div>
    )
}