// src/components/MyList.js
import React, { useState, useEffect } from 'react';
import { djangoAxios } from '../axios';
import { useNavigate } from 'react-router-dom';

export default function MyList() {
    const [myList, setMyList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleClick = (movieId) => {
        navigate(`movie/${movieId}`)
    } 

    const removeFromList = async (movieId) => {
        try {
            await djangoAxios.delete(`mylist/remove/${movieId}/`);
            // Remove movie from state
            setMyList(myList.filter(movie => movie.movie_id !== movieId));
        } catch (error) {
            console.error('Error removing movie from list:', error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-white">{error}</div>;

    return (
        <div className="my-list-container p-20">
            <h1 className="text-white text-3xl font-bold mb-8">My List</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {myList.map(movie => (
                    <div key={movie.movie_id} onClick={() => handleClick(movie.movie_id)}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                        <button 
                            onClick={() => removeFromList(movie.movie_id)}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
