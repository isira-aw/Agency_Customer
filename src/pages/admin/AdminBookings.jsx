import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { bookingAPI } from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    bookingAPI.getAll()
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  };

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      loadBookings();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const deleteBooking = async (id) => {
    if (confirm('Delete this booking?')) {
      try {
        await bookingAPI.delete(id);
        loadBookings();
      } catch (error) {
        alert('Error deleting booking');
      }
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Bookings Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-6 py-4">{booking.name}</td>
                <td className="px-6 py-4">{booking.email}</td>
                <td className="px-6 py-4">{booking.date}</td>
                <td className="px-6 py-4">{booking.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'approved')}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'rejected')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'approved' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'completed')}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
