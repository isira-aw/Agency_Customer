import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { bookingAPI, settingsAPI } from '../../services/api';

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', purpose: '', date: '', time: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    settingsAPI.getTimeSlots()
      .then(res => setTimeSlots(res.data.value.slots || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', purpose: '', date: '', time: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Error creating booking');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Book an Interview</h1>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          Booking successful! We'll contact you soon.
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Purpose of Interview"
          className="w-full p-3 border rounded h-24 dark:bg-gray-700 dark:text-white"
        />
        
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="dark:text-white" />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="flex-1 p-3 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Clock size={20} className="dark:text-white" />
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="flex-1 p-3 border rounded dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Time</option>
            {timeSlots.map((slot, idx) => (
              <option key={idx} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Book Interview
        </button>
      </motion.form>
    </div>
  );
}
