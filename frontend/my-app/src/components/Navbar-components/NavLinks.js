// src/components/Navbar-
import { Link } from 'react-router-dom';

export default function NavLinks({ isMobile }) {
    return (
        <div className={`flex ${isMobile ? "flex-col items-center gap-5" : "flex-row items-center"} transition-all duration-300 ease-in-out`}>
            <Link to="/" className="mb-[-10px] md:mb-0">
                <img src="/image (2).png" className={`"h-14 w-44 pr-11 ${isMobile} ? ml-14 : mr-0"`} alt="Logo" />
            </Link>
            <Link to="/movies" className="text-white px-3 hover:text-gray-300">Movies</Link>
            <Link to="/tvshows" className="text-white px-3 hover:text-gray-300">TV Shows</Link>
            <Link to="/trending" className="text-white px-3 hover:text-gray-300">Trending</Link>
            <Link to="/mylist" className="text-white px-3 hover:text-gray-300">My List</Link>
        </div>
    );
}
