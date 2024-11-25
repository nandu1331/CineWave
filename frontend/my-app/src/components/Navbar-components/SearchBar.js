// src/components/Navbar-components/SearchBar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"; // Add faTimes import

export default function SearchBar({ isMobile }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState(''); // Add state for input value

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            // Clear search when closing
            setSearchValue('');
        }
    };

    const handleClear = () => {
        setSearchValue('');
        // Optional: close search field after clearing
        setIsSearchOpen(false);
    };

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className="relative flex-row items-center ">
            <div className={`
                flex 
                items-center 
                transition-all 
                duration-300 
                ease-in-out
                ${isSearchOpen ? 'w-64' : 'w-8'}
            `}>
                <input
                    className={`
                        w-full
                        rounded-md 
                        px-3 
                        py-2 
                        pl-10 
                        pr-8
                        text-sm
                        transition-all 
                        duration-300
                        ${isSearchOpen 
                            ? 'opacity-100 visible' 
                            : 'opacity-0 invisible w-0'
                        }
                    `}
                    type="text"
                    name="search"
                    id="search"
                    value={searchValue}
                    onChange={handleChange}
                    placeholder="Search..."
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    onClick={toggleSearch}
                    className={`
                        absolute 
                        left-3 
                        top-1/2 
                        text-2xl
                        transform 
                        -translate-y-1/2
                        text-gray-400
                        cursor-pointer
                        transition-all
                        hover:text-gray-200
                        ${isSearchOpen ? 'opacity-50' : 'opacity-100'}
                    `}
                />
                {/* Add clear button */}
                {isSearchOpen && (
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={handleClear}
                        className="
                            absolute 
                            right-3 
                            top-1/2 
                            transform 
                            -translate-y-1/2
                            text-gray-400
                            cursor-pointer
                            hover:text-gray-200
                            transition-all
                        "
                    />
                )}
            </div>
        </div>
    );
}
