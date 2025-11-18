import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { settingsAPI, galleryAPI } from '../../services/api';

export default function AdminSettings() {
  const [timeSlots, setTimeSlots] = useState({ slots: [] });
  const [homepage, setHomepage] = useState({
    hero_title: '', hero_subtitle: '', about_text: '', countries: []
  });
  const [newSlot, setNewSlot] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    loadSettings();
    loadGallery();
  }, []);

  const loadSettings = async () => {
    try {
      const [slotsRes, homepageRes] = await Promise.all([
        settingsAPI.getTimeSlots(),
        settingsAPI.getHomepageContent()
      ]);
      setTimeSlots(slotsRes.data.value);
      setHomepage(homepageRes.data.value);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGallery = () => {
    galleryAPI.getAll()
      .then(res => setGalleryImages(res.data))
      .catch(err => console.error(err));
  };

  const saveTimeSlots = async () => {
    try {
      await settingsAPI.updateTimeSlots(timeSlots);
      alert('Time slots updated');
    } catch (error) {
      alert('Error updating time slots');
    }
  };

  const saveHomepage = async () => {
    try {
      await settingsAPI.updateHomepageContent(homepage);
      alert('Homepage content updated');
    } catch (error) {
      alert('Error updating homepage');
    }
  };

  const addTimeSlot = () => {
    if (newSlot && !timeSlots.slots.includes(newSlot)) {
      setTimeSlots({ slots: [...timeSlots.slots, newSlot] });
      setNewSlot('');
    }
  };

  const removeTimeSlot = (slot) => {
    setTimeSlots({ slots: timeSlots.slots.filter(s => s !== slot) });
  };

  const addCountry = () => {
    if (newCountry && !homepage.countries.includes(newCountry)) {
      setHomepage({ ...homepage, countries: [...homepage.countries, newCountry] });
      setNewCountry('');
    }
  };

  const removeCountry = (country) => {
    setHomepage({ ...homepage, countries: homepage.countries.filter(c => c !== country) });
  };

  const uploadGalleryImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await galleryAPI.upload(file, '', '');
        loadGallery();
      } catch (error) {
        alert('Error uploading image');
      }
    }
  };

  const deleteGalleryImage = async (id) => {
    if (confirm('Delete this image?')) {
      try {
        await galleryAPI.delete(id);
        loadGallery();
      } catch (error) {
        alert('Error deleting image');
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-bold mb-4">Time Slots Management</h2>
          <div className="flex space-x-2 mb-4">
            <input
              type="time"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button onClick={addTimeSlot} className="bg-blue-600 text-white px-4 rounded">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {timeSlots.slots.map((slot, idx) => (
              <span key={idx} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                {slot}
                <button onClick={() => removeTimeSlot(slot)} className="ml-2 text-red-600">×</button>
              </span>
            ))}
          </div>
          <button onClick={saveTimeSlots} className="bg-green-600 text-white px-6 py-2 rounded">
            Save Time Slots
          </button>
        </motion.div>

        {/* Homepage Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-bold mb-4">Homepage Content</h2>
          <div className="space-y-4">
            <input
              value={homepage.hero_title}
              onChange={(e) => setHomepage({ ...homepage, hero_title: e.target.value })}
              placeholder="Hero Title"
              className="w-full p-2 border rounded"
            />
            <input
              value={homepage.hero_subtitle}
              onChange={(e) => setHomepage({ ...homepage, hero_subtitle: e.target.value })}
              placeholder="Hero Subtitle"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={homepage.about_text}
              onChange={(e) => setHomepage({ ...homepage, about_text: e.target.value })}
              placeholder="About Text"
              className="w-full p-2 border rounded h-24"
            />
            
            <div>
              <label className="font-semibold">Countries:</label>
              <div className="flex space-x-2 mt-2 mb-2">
                <input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="Add country"
                  className="flex-1 p-2 border rounded"
                />
                <button onClick={addCountry} className="bg-blue-600 text-white px-4 rounded">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {homepage.countries.map((country, idx) => (
                  <span key={idx} className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                    {country}
                    <button onClick={() => removeCountry(country)} className="ml-2 text-red-600">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={saveHomepage} className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
            Save Homepage Content
          </button>
        </motion.div>

        {/* Gallery Management */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-bold mb-4">Gallery Management</h2>
          <input
            type="file"
            accept="image/*"
            onChange={uploadGalleryImage}
            className="mb-4 p-2 border rounded w-full"
          />
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={`http://localhost:8000/${img.filepath}`}
                  alt={img.title}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => deleteGalleryImage(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
