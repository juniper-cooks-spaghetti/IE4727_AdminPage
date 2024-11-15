import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddScreening = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    screeningTime: '',
    ticketPrice: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, cinemasRes] = await Promise.all([
          axios.get("http://localhost:8800/movies"),
          axios.get("http://localhost:8800/cinemas")
        ]);
        setMovies(moviesRes.data);
        setCinemas(cinemasRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/screenings', formData);
      navigate('/screenings');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Add New Screening</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Movie</label>
          <select
            name="movieId"
            value={formData.movieId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            required
          >
            <option value="">Select Movie</option>
            {movies.map(movie => (
              <option key={movie.MovieID} value={movie.MovieID}>
                {movie.Title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Cinema</label>
          <select
            name="cinemaId"
            value={formData.cinemaId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            required
          >
            <option value="">Select Cinema</option>
            {cinemas.map(cinema => (
              <option key={cinema.CinemaID} value={cinema.CinemaID}>
                {cinema.Name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Screening Time</label>
          <input
            type="datetime-local"
            name="screeningTime"
            value={formData.screeningTime}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Ticket Price ($)</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Screening
          </button>
          <button
            type="button"
            onClick={() => navigate('/screenings')}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScreening