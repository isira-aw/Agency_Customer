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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={`http://localhost:8000/${img.filepath}`}
              alt={img.title || 'Gallery image'}
              className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
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
          <img
            src={`http://localhost:8000/${selectedImage.filepath}`}
            alt={selectedImage.title}
            className="max-w-full max-h-full"
          />
        </motion.div>
      )}
    </div>
  );
}
