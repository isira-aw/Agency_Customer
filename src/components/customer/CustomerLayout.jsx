import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <nav className="bg-blue-600 dark:bg-blue-800 text-white sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold">
                EmployeeAgency
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="hover:text-blue-200">Home</Link>
                <Link to="/gallery" className="hover:text-blue-200">Gallery</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
                <Link to="/booking" className="hover:text-blue-200">Book Interview</Link>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="p-2 hover:bg-blue-700 rounded">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                  className="md:hidden p-2 hover:bg-blue-700 rounded"
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden pb-4"
              >
                <Link to="/" className="block py-2 hover:text-blue-200">Home</Link>
                <Link to="/gallery" className="block py-2 hover:text-blue-200">Gallery</Link>
                <Link to="/register" className="block py-2 hover:text-blue-200">Register</Link>
                <Link to="/booking" className="block py-2 hover:text-blue-200">Book Interview</Link>
              </motion.div>
            )}
          </div>
        </nav>

        <main>
          <Outlet />
        </main>

        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Employee Agency. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
