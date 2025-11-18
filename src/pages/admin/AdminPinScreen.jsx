import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminPinScreen() {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const ADMIN_PIN = '1234'; // Change this in production

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin/portal');
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full"
      >
        <div className="text-center mb-6">
          <Lock className="mx-auto mb-4 text-blue-600" size={64} />
          <h1 className="text-3xl font-bold">Admin Access</h1>
          <p className="text-gray-600 mt-2">Enter PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full p-4 border-2 rounded-lg text-center text-2xl mb-4 focus:border-blue-600 outline-none"
            maxLength={4}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Access Admin Portal
          </button>
        </form>
      </motion.div>
    </div>
  );
}
