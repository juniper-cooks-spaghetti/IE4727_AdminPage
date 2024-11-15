import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Screenings = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState({});
  const [cinemas, setCinemas] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [screeningsRes, moviesRes, cinemasRes] = await Promise.all([
          axios.get("http://localhost:8800/screenings"),
          axios.get("http://localhost:8800/movies"),
          axios.get("http://localhost:8800/cinemas")
        ]);
        
        setScreenings(screeningsRes.data);
        setMovies(moviesRes.data.reduce((acc, movie) => ({ ...acc, [movie.MovieID]: movie }), {}));
        setCinemas(cinemasRes.data.reduce((acc, cinema) => ({ ...acc, [cinema.CinemaID]: cinema }), {}));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/screenings/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="text-center p-4 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Screenings</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => navigate('/screenings/add')}
        >
          Add Screening
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenings.map((screening) => (
          <div
            key={screening.ScreeningID}
            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg"
          >
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2 text-white">
                {movies[screening.MovieID]?.Title || 'Unknown Movie'}
              </h2>
              
              <div className="space-y-2 text-gray-300">
                <p>Cinema: {cinemas[screening.CinemaID]?.Name || 'Unknown Cinema'}</p>
                <p>Time: {formatDateTime(screening.ScreeningTime)}</p>
                <p>Price: ${screening.TicketPrice}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-2">
              <Link to={`/screenings/update/${screening.ScreeningID}`}>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Edit
                </button>
              </Link>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(screening.ScreeningID)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        <Link to="/screenings/add" className="block">
          <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center h-full min-h-[200px]">
            <h3 className="text-xl font-medium text-white">Add New Screening</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};


export default Screenings