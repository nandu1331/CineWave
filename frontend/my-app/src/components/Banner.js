import React from "react";
import tmdbAxios from "axios";
import requests from "../requests";
import { djangoAxios } from "../axios";

export default function Banner() {
    const [movie, setMovie] = React.useState(null);  // It's better to set null initially
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const apikey = process.env.REACT_APP_API_KEY


            // In any React component
const testAPI = async () => {
    try {
        const response = await djangoAxios.get('test/');
        console.log(response.data); // Should show {"message": "API is working!"}
    } catch (error) {
        console.error('API test failed:', error);
    }
};

testAPI();

    React.useEffect(() => {
        const url = `https://api.themoviedb.org/3/${requests.fetchPopular}`;
        tmdbAxios
            .get(url, {
                params: {
                    api_key: `${apikey}`,  // Ensure to replace with a valid API key
                    ...requests.params,  // Ensure params are correct
                },
            })
            .then(res => {
                // Select a random movie
                const randomMovie = res.data.results[Math.floor(Math.random() * res.data.results.length)];
                setMovie(randomMovie);  // Update the state with the movie data
            })
            .catch(err => console.error("Error fetching data:", err));  // Always handle errors
    }, []);

    const imageUrl = `${baseImgUrl}${movie?.backdrop_path}`

    // If movie data is available, render it; otherwise, show a loading state
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
