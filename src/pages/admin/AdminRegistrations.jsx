import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { registrationAPI } from '../../services/api';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = () => {
    registrationAPI.getAll()
      .then(res => setRegistrations(res.data))
      .catch(err => console.error(err));
  };

  const updateStatus = async (id, status) => {
    try {
      await registrationAPI.update(id, { status });
      loadRegistrations();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const updateNotes = async (id, notes) => {
    try {
      await registrationAPI.update(id, { admin_notes: notes });
      loadRegistrations();
    } catch (error) {
      alert('Error updating notes');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    submitted: 'bg-blue-100 text-blue-800'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Registration Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Step</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {registrations.map((reg) => (
              <motion.tr
                key={reg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-6 py-4">{reg.first_name} {reg.last_name}</td>
                <td className="px-6 py-4">{reg.email}</td>
                <td className="px-6 py-4">{reg.preferred_country}</td>
                <td className="px-6 py-4">Step {reg.current_step}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[reg.status]}`}>
                    {reg.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => setSelectedReg(reg)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  {reg.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(reg.id, 'approved')}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Registration Details</h2>
            <div className="space-y-2 mb-4">
              <p><strong>Name:</strong> {selectedReg.first_name} {selectedReg.last_name}</p>
              <p><strong>Email:</strong> {selectedReg.email}</p>
              <p><strong>Phone:</strong> {selectedReg.phone}</p>
              <p><strong>Date of Birth:</strong> {selectedReg.date_of_birth}</p>
              <p><strong>Nationality:</strong> {selectedReg.nationality}</p>
              <p><strong>Experience:</strong> {selectedReg.experience_years} years</p>
              <p><strong>Previous Roles:</strong> {selectedReg.previous_roles}</p>
              <p><strong>Skills:</strong> {selectedReg.skills}</p>
              <p><strong>Preferred Country:</strong> {selectedReg.preferred_country}</p>
              <p><strong>CV:</strong> {selectedReg.cv_filename || 'Not uploaded'}</p>
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold mb-2">Admin Notes:</label>
              <textarea
                defaultValue={selectedReg.admin_notes || ''}
                onBlur={(e) => updateNotes(selectedReg.id, e.target.value)}
                className="w-full p-3 border rounded h-32"
              />
            </div>

            <button
              onClick={() => setSelectedReg(null)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
