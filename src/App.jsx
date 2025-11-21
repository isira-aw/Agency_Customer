import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CustomerLayout from './components/customer/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/customer/Home';
import Gallery from './pages/customer/Gallery';
import Registration from './pages/customer/Registration';
import Booking from './pages/customer/Booking';
import Login from './pages/customer/Login';
import Profile from './pages/customer/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="register" element={<Registration />} />
            <Route path="booking" element={<Booking />} />
            <Route path="login" element={<Login />} />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;