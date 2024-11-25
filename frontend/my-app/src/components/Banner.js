import React from "react";
import tmdbAxios from "axios";
import requests from "../requests";
import { djangoAxios } from "../axios";
import { useState } from "react";
import ShimmerBanner from "./shimmerComps/shimmerBanner";

export default function Banner() {
    const [movie, setMovie] = React.useState(null); 
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const apikey = process.env.REACT_APP_API_KEY

    React.useEffect(() => {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/${requests.fetchPopular}`;
        tmdbAxios
            .get(url, {
                params: {
                    api_key: `${apikey}`, 
                    ...requests.params, 
                },
            })
            .then(res => {
                const randomMovie = res.data.results[Math.floor(Math.random() * res.data.results.length)];
                setMovie(randomMovie);
                setLoading(false); 
            })
            .catch(err => console.error("Error fetching data:", err)); 
        }, []);

    const imageUrl = `${baseImgUrl}${movie?.backdrop_path}`

    if (loading) {
    return <ShimmerBanner />
  }

    return (
        <header 
            className="bg-cover bg-center bg-no-repeat h-[70%]"
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <div className="flex flex-col justify-between gap-10 mx-14 pb-20 pt-40 align-middle">
                <h1 className="font-bold text-5xl text-white ">{movie?.title}</h1>
                <div className="flex flex-row gap-5 px-5 max-w-96">
                    <button 
                        className="bg-[#38383880] hover:bg-[#e6e6e6] text-white hover:text-black px-10 py-2 rounded-md"
                    >
                        Play
                    </button>
                    <button className="bg-[#38383880] hover:bg-[#e6e6e6] text-white hover:text-black px-10 py-2 rounded-md">
                        Details
                    </button>

                </div>
                <h1 className="text-md max-w-96 text-white">{movie?.overview}</h1>
            </div>
            <div 
                 style={{
                    backgroundImage: "linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.61), #111)",
                    height: "150px",
                    width: "100%",
                  }}
            ></div>
        </header>
     );
}
