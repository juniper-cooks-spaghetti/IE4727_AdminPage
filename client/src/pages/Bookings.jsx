import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8800/bookings");
        setBookings(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
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

  if (loading) return <div className="text-center p-4 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Successful Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.BookingID}
            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg"
          >
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2 text-white">
                {booking.MovieTitle}
              </h2>
              
              <div className="space-y-2 text-gray-300">
                <p>ID: {booking.BookingID}</p>
                <p>User: {booking.Username}</p>
                <p>Cinema: {booking.CinemaName}</p>
                <p>Screening: {formatDateTime(booking.ScreeningTime)}</p>
                <p>Booked: {formatDateTime(booking.BookingTime)}</p>
                <p>Amount: ${booking.TotalAmount}</p>
                <div>
                  <p className="font-medium mb-1">Seats:</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.BookedSeats.split(',').map((seat, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 rounded text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;