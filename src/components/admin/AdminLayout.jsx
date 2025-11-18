import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
        </div>
        <nav className="space-y-2 px-4">
          <Link to="/admin/portal" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/portal/bookings" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700">
            <Calendar size={20} />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/portal/registrations" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700">
            <Users size={20} />
            <span>Registrations</span>
          </Link>
          <Link to="/admin/portal/settings" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700 w-full text-left">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
