import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tmdbAxios } from "../../axios";
import EpisodeDetails from "./EpisodeDetails";

export default function SeasonDetails({ id }) {
    const [seasonList, setSeasonList] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSeasonList = async (tvId) => {
        try {
            setIsLoading(true);
            const response = await tmdbAxios.get(`tv/${tvId}`);
            setSeasonList(response.data.seasons);
            setSelectedSeason(response.data.seasons[0]?.season_number || 1);
        } catch (error) {
            console.error("Error fetching seasons:", error);
            setError("Failed to load seasons");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchSeasonList(id);
        }
    }, [id]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-32 bg-neutral-800/50 rounded-lg animate-pulse"
            />
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 p-4 text-center"
            >
                {error}
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-8"
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row lg:flex-row justify-between items-center">
                    <motion.h1 
                        className="text-2xl font-bold"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Episodes
                    </motion.h1>
                    <motion.select
                        className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-black px-4 py-2 w-full max-w-fit 
                                   border-2 border-neutral-700 rounded-lg shadow-md
                                   text-white text-sm font-medium tracking-wide cursor-pointer
                                   hover:border-neutral-500 hover:shadow-lg hover:shadow-neutral-700/50
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-neutral-500 
                                   transition-all duration-300 ease-in-out"
                        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                        value={selectedSeason}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {seasonList.map((season) => (
                            <option 
                                key={season.id} 
                                value={season.season_number}
                                className="bg-neutral-900 text-white hover:bg-neutral-700"
                            >
                                {season.name} ({season.episode_count} Episodes)
                            </option>
                        ))}
                    </motion.select>

                </div>
                <AnimatePresence mode="wait">
                    <EpisodeDetails 
                        key={selectedSeason}
                        tvId={id} 
                        seasonNumber={selectedSeason} 
                    />
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
