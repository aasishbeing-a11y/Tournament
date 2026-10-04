import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getGallery } from '../services/firestore';
import { Image, X } from 'lucide-react';
import { PageSkeleton } from '../components/Skeletons';

const PhotoModal = ({ photo, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
        >
          <X size={28} />
        </button>
        <img
          src={photo.url}
          alt={photo.caption || 'Gallery photo'}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />
        {photo.caption && (
          <p className="text-white text-center mt-3 text-sm">{photo.caption}</p>
        )}
      </div>
    </div>
  );
};

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = getGallery((data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <Layout><PageSkeleton /></Layout>;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-black mb-2">
            <span className="text-primary-500">Gallery</span>
          </h1>
          <p className="text-gray-300">Moments from the court</p>
        </div>
      </section>

      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {photos.length === 0 ? (
            <div className="text-center py-20 card p-10">
              <Image className="mx-auto text-gray-300 mb-4" size={56} />
              <h3 className="text-xl font-heading font-bold text-dark mb-2">Gallery Coming Soon</h3>
              <p className="text-gray-500">Photos will be uploaded during and after the tournament.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-md hover:shadow-xl"
                  onClick={() => setSelected(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Gallery'}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <PhotoModal photo={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
}
