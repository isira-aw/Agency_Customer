import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Globe, Briefcase, 
  FileText, Upload, Download, Trash2, Eye, AlertCircle,
  Save, X, Edit2, Lock, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, authAPI } from '../../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Profile state
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    experience_years: '',
    previous_roles: '',
    skills: '',
    preferred_country: '',
    preferred_city: '',
  });

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        nationality: user.nationality || '',
        experience_years: user.experience_years || '',
        previous_roles: user.previous_roles || '',
        skills: user.skills || '',
        preferred_country: user.preferred_country || '',
        preferred_city: user.preferred_city || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'documents') {
      loadDocuments();
    } else if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab, bookingFilter]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Profile functions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data);
      setEditing(false);
      showMessage('Profile updated successfully!');
    } catch (error) {
      showMessage(error.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Documents functions
  const loadDocuments = async () => {
    try {
      const response = await profileAPI.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      showMessage('Failed to load documents', 'error');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showMessage('Please select a file', 'error');
      return;
    }

    setLoading(true);
    try {
      await profileAPI.uploadDocument(uploadFile, uploadCategory, uploadDescription);
      setUploadFile(null);
      setUploadCategory('');
      setUploadDescription('');
      loadDocuments();
      showMessage('Document uploaded successfully!');
    } catch (error) {
      showMessage('Failed to upload document', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await profileAPI.deleteDocument(id);
      loadDocuments();
      showMessage('Document deleted successfully!');
    } catch (error) {
      showMessage('Failed to delete document', 'error');
    }
  };

  const handleDownloadDocument = async (id, filename) => {
    try {
      const response = await profileAPI.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showMessage('Failed to download document', 'error');
    }
  };

  // Bookings functions
  const loadBookings = async () => {
    try {
      const response = bookingFilter === 'all' 
        ? await profileAPI.getBookings()
        : await profileAPI.getBookingsByStatus(bookingFilter);
      setBookings(response.data);
    } catch (error) {
      showMessage('Failed to load bookings', 'error');
    }
  };

  // Password change function
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      showMessage('Password changed successfully!');
    } catch (error) {
      showMessage(error.response?.data?.detail || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { bg: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg}`}>
        <Icon size={16} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.full_name || 'User Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-2">
                {user?.license_active ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle size={16} />
                    Active Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    <XCircle size={16} />
                    Inactive Account
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <AlertCircle size={20} />
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X size={20} />
            </button>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            {['profile', 'documents', 'bookings', 'password'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit2 size={20} />
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.date_of_birth}
                        onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Globe size={16} className="inline mr-2" />
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={profileData.nationality}
                        onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Briefcase size={16} className="inline mr-2" />
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={profileData.experience_years}
                        onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Globe size={16} className="inline mr-2" />
                        Preferred Country
                      </label>
                      <input
                        type="text"
                        value={profileData.preferred_country}
                        onChange={(e) => setProfileData({ ...profileData, preferred_country: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Previous Roles
                      </label>
                      <textarea
                        value={profileData.previous_roles}
                        onChange={(e) => setProfileData({ ...profileData, previous_roles: e.target.value })}
                        disabled={!editing}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills
                      </label>
                      <textarea
                        value={profileData.skills}
                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                        disabled={!editing}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Documents
                </h2>

                {/* Upload Form */}
                <form onSubmit={handleFileUpload} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upload New Document</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        <option value="cv">CV/Resume</option>
                        <option value="certificate">Certificate</option>
                        <option value="passport">Passport</option>
                        <option value="payment">Payment Proof</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Optional description"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !uploadFile}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Upload size={20} />
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>

                {/* Documents List */}
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No documents uploaded yet
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-4">
                          <FileText size={40} className="text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {doc.filename}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doc.category && `${doc.category} • `}
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                            {doc.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                            title="Download"
                          >
                            <Download size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Interview Bookings
                  </h2>
                  
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No bookings found
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-6 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                              Interview - {booking.purpose || 'General'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Booking ID: #{booking.id}
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Time:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {booking.time}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {booking.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {booking.admin_response && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              Admin Response:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {booking.admin_response}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Change Password
                </h2>

                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Lock size={16} className="inline mr-2" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Lock size={16} className="inline mr-2" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Lock size={16} className="inline mr-2" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Lock size={20} />
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}