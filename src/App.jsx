import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/customer/CustomerLayout';
import Home from './pages/customer/Home';
import Gallery from './pages/customer/Gallery';
import Registration from './pages/customer/Registration';
import Booking from './pages/customer/Booking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="register" element={<Registration />} />
          <Route path="booking" element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
