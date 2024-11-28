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
                        className="bg-neutral-900/95 px-4 py-2 w-full max-w-fit border-white/20 border-2 rounded-md
                                 hover:border-white/40 transition-all duration-300 cursor-pointer
                                 focus:outline-none focus:border-white/60"
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
