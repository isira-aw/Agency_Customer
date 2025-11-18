# Employee Agency Frontend

## Features

### Customer Portal (/)
- Home page with hero section and animations
- Gallery with lightbox view
- Multi-step registration form with localStorage persistence
- Interview booking system with calendar and time slots
- Dark mode support
- Fully responsive design

### Admin Portal (/admin)
- PIN-protected access (default PIN: 1234)
- Dashboard with statistics
- Bookings management (approve/reject/complete)
- Registration management (view details, add notes, approve)
- Settings (time slots, homepage content, gallery)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on http://localhost:3000

### 3. Build for Production
```bash
npm run build
```

## Tech Stack
- React 18
- Vite
- React Router 6
- TailwindCSS
- Framer Motion
- Axios
- Lucide Icons

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── customer/
│   │   │   └── CustomerLayout.jsx
│   │   └── admin/
│   │       └── AdminLayout.jsx
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Registration.jsx
│   │   │   └── Booking.jsx
│   │   └── admin/
│   │       ├── AdminPinScreen.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminBookings.jsx
│   │       ├── AdminRegistrations.jsx
│   │       └── AdminSettings.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Configuration
The frontend connects to the backend at `http://localhost:8000`. 
To change this, update the `API_BASE_URL` in `src/services/api.js`.

## Admin Access
- Navigate to `/admin`
- Enter PIN: 1234 (change in `AdminPinScreen.jsx`)
- Access admin portal at `/admin/portal`
