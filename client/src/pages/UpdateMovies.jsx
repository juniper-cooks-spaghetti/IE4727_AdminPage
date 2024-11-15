import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateMovies = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/movies/${id}`);
                setMovie(res.data[0]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleEdit = (field, value) => {
        setEditField(field);
        // Convert boolean to string for Featured field
        setEditValue(field === 'Featured' ? (value ? '1' : '0') : value);
    };

    const handleUpdate = async () => {
        try {
            // Convert string back to boolean for Featured field
            const valueToUpdate = editField === 'Featured' 
                ? editValue === '1' || editValue === 'true'
                : editValue;

            await axios.put(`http://localhost:8800/movies/${id}`, {
                [editField]: valueToUpdate
            });
            setMovie({ ...movie, [editField]: valueToUpdate });
            setEditField(null);
            setEditValue('');
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-400">Error: {error}</div>;
    if (!movie) return <div className="text-center p-4">Movie not found</div>;

    const movieDetails = [
        { label: 'Title', key: 'Title', value: movie.Title, type: 'text' },
        { label: 'Genre', key: 'Genre', value: movie.Genre, type: 'text' },
        { label: 'Duration', key: 'Duration', value: movie.Duration, type: 'number' },
        { label: 'Synopsis', key: 'Synopsis', value: movie.Synopsis, type: 'textarea' },
        { label: 'Release Date', key: 'ReleaseDate', value: movie.ReleaseDate, type: 'date' },
        { label: 'Thumbnail URL', key: 'Thumbnail', value: movie.Thumbnail, type: 'url' },
        { label: 'Poster URL', key: 'Poster', value: movie.Poster, type: 'url' },
        { label: 'Featured', key: 'Featured', value: movie.Featured, type: 'checkbox' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Update Movie Details</h1>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="w-1/5 px-6 py-3 text-left text-sm font-medium text-gray-200">Field</th>
                            <th className="w-3/5 px-6 py-3 text-left text-sm font-medium text-gray-200">Value</th>
                            <th className="w-1/5 px-6 py-3 text-left text-sm font-medium text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {movieDetails.map(({ label, key, value, type }) => (
                            <tr key={key} className="hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-300 align-top">{label}</td>
                                <td className="px-6 py-4">
                                    {editField === key ? (
                                        type === 'textarea' ? (
                                            <textarea
                                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                rows="4"
                                            />
                                        ) : type === 'checkbox' ? (
                                            <select
                                                className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                            >
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={type}
                                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                            />
                                        )
                                    ) : (
                                        <div className="text-white break-words">
                                            {key === 'ReleaseDate' ? formatDate(value) :
                                             key === 'Featured' ? (value ? 'Yes' : 'No') :
                                             value}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 align-top">
                                    {editField === key ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdate}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditField(null);
                                                    setEditValue('');
                                                }}
                                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(key, value)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                    Back to Movies
                </button>
            </div>
        </div>
    );
};

export default UpdateMovies;