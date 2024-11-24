// In MovieDetailsHero.js
import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "../VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";

export default function DetailsHero({ details, mediaType }) {
    const [trailer, setTrailer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [movieTitle, setMovieTitle] = useState()
    const videoRef = useRef(null);
    const baseImgUrl = "https://image.tmdb.org/t/p/original/";
    const imageUrl = `${baseImgUrl}${details?.backdrop_path}`;

    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            setIsPlaying(true);
        }, 3000);
        return () => clearTimeout(autoPlayTimer);
    }, []);

    const handleClick = () => {
        if (isPlaying) {
            setTimeout(() => {
                setIsPlaying(false);
            }, 2000); 
        } else {
            setIsPlaying(true);
        }
    };

    console.log("HERO ID: ", details.id)

    return (
        <div className="relative h-[30vh] w-full md:h-[40vh] lg:h-[50vh] overflow-hidden ">

            <AnimatePresence initial={false}>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="relative h-full w-full overflow-hidden bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                        onClick={handleClick}
                    >
                        {movieTitle && (
                        <div className="absolute bottom-10 left-7 max-w-[175px]">
                            <img 
                                src={movieTitle} 
                                alt="Movie Logo"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full w-full overflow-hidden"
                    onClick={handleClick}
                >
                    <VideoPlayer 
                        id={details.id}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        videoRef={videoRef}
                        setMovieTitle={setMovieTitle}
                        mediaType={mediaType}
                        trailer={trailer}
                        setTrailer={setTrailer}
                    />
                </motion.div>    
            </AnimatePresence>            
        </div>
    );
}
