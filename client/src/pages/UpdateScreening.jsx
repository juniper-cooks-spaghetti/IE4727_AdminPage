import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateScreening = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [screeningRes, moviesRes, cinemasRes] = await Promise.all([
          axios.get(`http://localhost:8800/screenings/${id}`),
          axios.get("http://localhost:8800/movies"),
          axios.get("http://localhost:8800/cinemas")
        ]);
        setScreening(screeningRes.data[0]);
        setMovies(moviesRes.data);
        setCinemas(cinemasRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8800/screenings/${id}`, {
        [editField]: editValue
      });
      setScreening({ ...screening, [editField]: editValue });
      setEditField(null);
      setEditValue('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-400">Error: {error}</div>;
  if (!screening) return <div className="text-center p-4">Screening not found</div>;

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const screeningDetails = [
    {
      label: 'Movie',
      key: 'MovieID',
      value: screening.MovieID,
      type: 'select',
      options: movies.map(movie => ({
        value: movie.MovieID,
        label: movie.Title
      }))
    },
    {
      label: 'Cinema',
      key: 'CinemaID',
      value: screening.CinemaID,
      type: 'select',
      options: cinemas.map(cinema => ({
        value: cinema.CinemaID,
        label: cinema.Name
      }))
    },
    {
      label: 'Screening Time',
      key: 'ScreeningTime',
      value: screening.ScreeningTime,
      type: 'datetime-local'
    },
    {
      label: 'Ticket Price',
      key: 'TicketPrice',
      value: screening.TicketPrice,
      type: 'number'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Update Screening Details</h1>
      
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
            {screeningDetails.map(({ label, key, value, type, options }) => (
              <tr key={key} className="hover:bg-gray-700">
                <td className="px-6 py-4 text-sm text-gray-300">{label}</td>
                <td className="px-6 py-4">
                  {editField === key ? (
                    type === 'select' ? (
                      <select
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      >
                        {options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        step={type === 'number' ? '0.01' : undefined}
                      />
                    )
                  ) : (
                    <div className="text-white">
                      {type === 'select'
                        ? options.find(opt => opt.value === value)?.label
                        : key === 'ScreeningTime'
                        ? formatDateTime(value)
                        : key === 'TicketPrice'
                        ? `$${value}`
                        : value}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
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
          onClick={() => navigate('/screenings')}
          className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          Back to Screenings
        </button>
      </div>
    </div>
  );
};

export default UpdateScreening;