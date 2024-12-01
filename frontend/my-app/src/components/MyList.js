// src/components/MyList.js
import React, { useState, useEffect } from 'react';
import { djangoAxios } from '../axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function MyList() {
    const [myList, setMyList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyList();
    }, []);

    const fetchMyList = async () => {
        try {
            const response = await djangoAxios.get('mylist/');
            setMyList(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mylist:', error);
            setError('Failed to fetch your list');
            setLoading(false);
        }
    };

    const removeFromList = async (itemId) => {
        try {
            await djangoAxios.delete(`mylist/remove/${itemId}/`);
            // Remove item from state
            setMyList(myList.filter(item => item.item_id !== itemId));
        } catch (error) {
            console.error('Error removing item from list:', error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-white">{error}</div>;

    return (
        <div className="container mx-auto px-4 pt-24 min-h-screen">
            <h1 className="text-white text-3xl font-bold mb-8">My List</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-10">
                {myList.map(item => (
                    <div 
                        key={item.item_id}
                        className='relative group cursor-pointer'    
                    >
                        <Link to={`/${item.media_type}/${item.item_id}`}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title}
                            className="w-full rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                        </Link>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromList(item.item_id);
                            }}
                            className={`
                                absolute z-50 right-2 top-2
                                bg-black/50 hover:bg-black/75
                                p-2 rounded-md
                                transform transition-all duration-300
                                opacity-0 group-hover:opacity-100
                                'cursor-default ring-2 ring-red-500 ring-opacity-50'
                            `} 
                        >
                            <FontAwesomeIcon 
                                icon={faMinus} 
                                className={`
                                    transition-all duration-300 ease-in-out
                                    text-lg
                                    text-red-500
                                `}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
