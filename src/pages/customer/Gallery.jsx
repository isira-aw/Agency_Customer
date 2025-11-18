import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { galleryAPI } from '../../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = () => {
    galleryAPI.getAll()
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">Gallery</h1>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={`http://localhost:8000/${img.filepath}`}
              alt={img.title || 'Gallery image'}
              className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
            />

            {/* Image Info */}
            <div className="p-4">
              <h2 className="text-lg font-semibold dark:text-white">{img.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{img.description}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {new Date(img.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Popup */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <div className="text-center">
            <img
              src={`http://localhost:8000/${selectedImage.filepath}`}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] mx-auto rounded-lg"
            />

            {/* Title + Description + Date inside lightbox */}
            <h2 className="text-white text-2xl font-bold mt-4">{selectedImage.title}</h2>
            <p className="text-gray-300 mt-2">{selectedImage.description}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(selectedImage.created_at).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
