import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8800/movies");
                setMovies(res.data);
                console.log(res.data);
            } catch (err) {
                setError(err.message);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllMovies();
    }, []);

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = async (id) =>{
        try{
            await axios.delete(`http://localhost:8800/movies/${id}`)
            window.location.reload()
        }catch(err){
            console.log(err)
        }
    }

    if (loading) return <div className="text-center p-4 text-gray-300">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-400">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Movies</h1>
            
            {movies.length === 0 ? (
                <p className="text-center text-gray-300">No movies found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                        <div 
                            key={movie.MovieID} 
                            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {movie.Thumbnail && (
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={movie.Thumbnail}
                                        alt={`${movie.Title} thumbnail`}
                                        className="w-full h-full object-cover"
                                    />
                                    {movie.Featured && (
                                        <span className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            )}
                            
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2 text-white">{movie.Title}</h2>
                                
                                <div className="flex items-center gap-2 text-sm mb-2">
                                    <span className="px-2 py-1 bg-gray-700 text-gray-200 rounded">
                                        {movie.Genre}
                                    </span>
                                    {movie.Duration && (
                                        <span className="px-2 py-1 bg-gray-700 text-gray-200 rounded">
                                            {formatDuration(movie.Duration)}
                                        </span>
                                    )}
                                </div>

                                {movie.ReleaseDate && (
                                    <p className="text-sm text-gray-300 mb-2">
                                        Released: {formatDate(movie.ReleaseDate)}
                                    </p>
                                )}

                                {movie.Synopsis && (
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {movie.Synopsis}
                                    </p>
                                )}
                            </div>
                            
                            <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-2">
                                <button 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    View Details
                                </button>
                                <button 
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    Edit
                                </button>
                                <button 
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    onClick={()=>handleDelete(movie.MovieID)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Movies;