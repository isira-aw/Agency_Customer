import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { bookingAPI, registrationAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRegistrations: 0,
    completedInterviews: 0,
    pendingInterviews: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [bookings, registrations] = await Promise.all([
        bookingAPI.getAll(),
        registrationAPI.getAll()
      ]);

      const completed = bookings.data.filter(b => b.status === 'completed').length;
      const pending = bookings.data.filter(b => b.status === 'pending').length;

      setStats({
        totalBookings: bookings.data.length,
        totalRegistrations: registrations.data.length,
        completedInterviews: completed,
        pendingInterviews: pending
      });
    } catch (error) {
      console.error(error);
    }
  };

  const statCards = [
    { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings, color: 'bg-blue-500' },
    { icon: Users, label: 'Total Registrations', value: stats.totalRegistrations, color: 'bg-green-500' },
    { icon: CheckCircle, label: 'Completed', value: stats.completedInterviews, color: 'bg-purple-500' },
    { icon: Clock, label: 'Pending', value: stats.pendingInterviews, color: 'bg-orange-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="text-white" size={24} />
            </div>
            <h3 className="text-gray-600 text-sm font-semibold">{card.label}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
