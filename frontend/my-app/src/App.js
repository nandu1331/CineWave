import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Login from './components/login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar-components/Navbar';
import Banner from './components/Banner';
import Row from './components/row'; 
import requests from './requests';
import Register from './components/register';
import MyList from './components/MyList';
import ShimmerBanner from './components/shimmerComps/shimmerBanner';
import SearchResults from './components/SearchResults';
import MovieDetailsCard from './components/MovieDetailsCardComps/DetailsCard';

// Create a separate component for category content
const CategoryContent = ({ category }) => {
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [category]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ShimmerBanner />
                <div className="space-y-8">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
                            <div className="h-32 bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    switch(category) {
        case 'movies':
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Banner media_type={'Movie'}/>
                    <Row title="Now Playing" fetchUrl={requests.fetchMovieNowPlaying} isBig={true} media_type={'Movie'}/>
                    <Row title="Popular Movies" fetchUrl={requests.fetchMoviePopular} media_type={'Movie'}/>
                    <Row title="Top Rated Movies" fetchUrl={requests.fetchMovieToprated} media_type={'Movie'}/>
                    <Row title="Upcoming Movies" fetchUrl={requests.fetchMovieUpcoming} media_type={'Movie'}/>
                </motion.div>
            );
        case 'tvshows':
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Banner media_type={'TV'}/>
                    <Row title="Airing Today" fetchUrl={requests.fetchTvShowsAiringToday} isBig={true} media_type={'TV'}/>
                    <Row title="On The Air" fetchUrl={`${requests.fetchTvshowsOnTheAir}?sort_by=vote_average.desc`} media_type={'TV'}/>
                    <Row title="Popular" fetchUrl={requests.fetchTvshowsPopular} media_type={'TV'}/>
                    <Row title="Top Rated" fetchUrl={`${requests.fetchTvshowsToprated}?sort_by=first_air_date.desc`} media_type={'TV'}/>
                </motion.div>
            );
        case 'trending' :
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Banner media_type={'Movie' || 'TV'}/>
                    <Row title="Trending Today" fetchUrl={requests.fetchTrendingToday} isBig={true} />
                    <Row title="Trending this Week" fetchUrl={`${requests.fetchTrendingWeek}`} />
                    <Row title="Trending Movies Today" fetchUrl={requests.fetchTrendingMoviesToday} media_type={'Movie'}/>
                    <Row title="Trending Movies this Week" fetchUrl={requests.fetchTrendingMoviesWeek} media_type={'Movie'}/>
                    <Row title="Trending TvShows Today" fetchUrl={`${requests.fetchTrendingTvShowsToday}`} media_type={'TV'}/>
                    <Row title="Trending TvShows this Week" fetchUrl={`${requests.fetchTrendingTvShowsWeek}`} media_type={'TV'}/>
                </motion.div>
            );
        default:
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Banner media_type={'Movie'}/>
                    <Row title="Now Playing" fetchUrl={requests.fetchNowPlaying} isBig={true} media_type={'Movie'}/>
                    <Row title="Popular" fetchUrl={requests.fetchMoviePopular} media_type={'Movie'}/>         
                    <Row title="Top-Rated" fetchUrl={requests.fetchMovieToprated} media_type={'Movie'}/>
                    <Row title="Upcoming" fetchUrl={requests.fetchMovieUpcoming} media_type={'Movie'}/>
                    <Row title="Anime" fetchUrl={requests.fetchAnime} media_type={'Anime'}/>
                    <Row title="Tv shows" fetchUrl={requests.fetchTvshowsToprated} media_type={'TV'}/>
                </motion.div>
            );
    }
};

// Main layout component
const MainLayout = ({ category }) => (
    <motion.div 
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Navbar />
        <AnimatePresence mode="wait">
            <CategoryContent category={category} />
        </AnimatePresence>
    </motion.div>
);

export default function App() {
    return (
        <Router>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/login" element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Login />
                        </motion.div>
                    } />
                    <Route path="/register" element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Register />
                        </motion.div>
                    } />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    } />
                    <Route path="/movies" element={
                        <ProtectedRoute>
                            <MainLayout category="movies" />
                        </ProtectedRoute>
                    } />
                    <Route path="/tvshows" element={
                        <ProtectedRoute>
                            <MainLayout category="tvshows" />
                        </ProtectedRoute>
                    } />
                    <Route path="/trending" element={
                        <ProtectedRoute>
                            <MainLayout category="trending" />
                        </ProtectedRoute>
                    } />
                    <Route path="/mylist" element={
                        <ProtectedRoute>
                            <motion.div className='app'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Navbar />
                                <MyList />
                            </motion.div>
                        </ProtectedRoute>
                    } />
                    <Route 
                        path="/browse/search" 
                        element={<SearchResults />} 
                    />
                    <Route
                        path="/:media_type/:id" 
                        element={<MovieDetailsCard />}
                    />
                </Routes>
            </AnimatePresence>
        </Router>
    );
}
