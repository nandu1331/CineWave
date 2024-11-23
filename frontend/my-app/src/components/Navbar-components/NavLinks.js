// src/components/Navbar-
import { Link } from 'react-router-dom';

export default function NavLinks({ isMobile }) {
    return (
        <div className={`flex ${isMobile ? "flex-col items-center gap-5" : "flex-row items-center"} transition-all duration-300 ease-in-out`}>
            <Link to="/" className="mb-4 sm:mb-0">
                <img src="/logo.png" className={`"h-14 w-44 pr-11 ${isMobile} ? ml-14 : mr-0"`} alt="Logo" />
            </Link>
            <Link to="/browse/movies" className="text-white px-3 hover:text-gray-300">Movies</Link>
            <Link to="/browse/tvshows" className="text-white px-3 hover:text-gray-300">TV Shows</Link>
            <Link to="/browse/trending" className="text-white px-3 hover:text-gray-300">Trending</Link>
            <Link to="/mylist" className="text-white px-3 hover:text-gray-300">My List</Link>
        </div>
    );
}
