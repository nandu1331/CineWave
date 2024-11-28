import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tmdbAxios } from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlayCircle, 
    faClock, 
    faCalendar, 
    faChevronDown, 
    faChevronUp 
} from "@fortawesome/free-solid-svg-icons";

export default function EpisodeDetails({ tvId, seasonNumber }) {
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEpisode, setExpandedEpisode] = useState(null);
    const [showAllEpisodes, setShowAllEpisodes] = useState(false);
    const INITIAL_EPISODES_TO_SHOW = 6;

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setIsLoading(true);
                const response = await tmdbAxios.get(`tv/${tvId}/season/${seasonNumber}`);
                setEpisodes(response.data.episodes);
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setError("Failed to load episodes");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEpisodes();
    }, [tvId, seasonNumber]);

    const visibleEpisodes = showAllEpisodes 
        ? episodes 
        : episodes.slice(0, INITIAL_EPISODES_TO_SHOW);

    const hasMoreEpisodes = episodes.length > INITIAL_EPISODES_TO_SHOW;

    // Animation variants remain the same
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const episodeVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    // Loading and error states remain the same
    if (isLoading) {
        return (
            <div className="grid gap-4 md:gap-6">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="h-32 md:h-40 bg-neutral-800/50 rounded-xl animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center"
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
            className="grid gap-4 md:gap-6"
        >
            {visibleEpisodes.map((episode) => (
                <motion.div
                    key={episode.id}
                    variants={episodeVariants}
                    className="bg-neutral-800/30 backdrop-blur-sm rounded-xl overflow-hidden 
                             hover:bg-neutral-800/50 transition-all duration-300 
                             transform hover:scale-[1.02] cursor-pointer
                             border border-white/5 hover:border-white/10"
                    onClick={() => setExpandedEpisode(expandedEpisode === episode.id ? null : episode.id)}
                >
                    {/* Your existing episode card content remains the same */}
                    <div className="flex flex-col md:flex-row gap-4 p-4">
                        {/* Episode Thumbnail */}
                        <div className="relative w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                            {episode.still_path ? (
                                <>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                        alt={episode.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <motion.div 
                                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <FontAwesomeIcon icon={faPlayCircle} className="text-4xl text-white/90" />
                                    </motion.div>
                                </>
                            ) : (
                                <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                                    <span className="text-white/50">No Preview</span>
                                </div>
                            )}
                        </div>

                        {/* Episode Details */}
                        <div className="flex-grow space-y-3">
                            <div className="flex flex-col md:flex-row justify-between gap-2">
                                <h3 className="text-lg md:text-xl font-semibold">
                                    {episode.episode_number}. {episode.name}
                                </h3>
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faClock} />
                                        {episode.runtime}min
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCalendar} />
                                        {new Date(episode.air_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Episode Description */}
                            <AnimatePresence mode="wait">
                                {expandedEpisode === episode.id ? (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-black/20 rounded-lg p-3"
                                    >
                                        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                                            {episode.overview || "No description available."}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <p className="text-sm md:text-base text-gray-400 line-clamp-2">
                                        {episode.overview || "description not available."}
                                    </p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Show More/Less Button */}
            {hasMoreEpisodes && (
                <motion.button
                    onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                    className="w-full py-4 px-6 mt-2 rounded-xl
                             bg-neutral-800/30 backdrop-blur-sm
                             hover:bg-neutral-800/50 transition-all duration-300
                             border border-white/5 hover:border-white/10
                             flex items-center justify-center gap-2
                             text-gray-300 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="font-medium">
                        {showAllEpisodes ? 'Show Less' : `Show All Episodes (${episodes.length})`}
                    </span>
                    <FontAwesomeIcon 
                        icon={showAllEpisodes ? faChevronUp : faChevronDown}
                        className={`transform transition-transform duration-300 
                                  ${showAllEpisodes ? 'rotate-180' : ''}`}
                    />
                </motion.button>
            )}
        </motion.div>
    );
}
