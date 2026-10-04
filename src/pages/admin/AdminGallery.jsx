import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getGallery, addGalleryPhoto, deleteGalleryPhoto } from '../../services/firestore';
import { uploadFile } from '../../services/firestore';
import { Image, Upload, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const unsub = getGallery((data) => { setPhotos(data); setLoading(false); });
    return unsub;
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const path = `gallery/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path, (pct) => setProgress(pct));
        await addGalleryPhoto({ url, caption, fileName: file.name });
      }
      toast.success('Photo(s) uploaded!');
      setCaption('');
      setProgress(0);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [caption]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  const handleDelete = async (photo) => {
    if (!confirm('Delete this photo?')) return;
    try { await deleteGalleryPhoto(photo); toast.success('Photo deleted'); }
    catch { toast.error('Failed to delete photo'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-dark">Gallery</h1>
        <p className="text-gray-500 text-sm">{photos.length} photos</p>
      </div>

      {/* Upload */}
      <div className="card p-5">
        <h3 className="font-bold text-dark mb-4">Upload Photos</h3>
        <div className="mb-3">
          <label className="form-label text-xs">Caption (optional)</label>
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            className="form-input text-sm"
            placeholder="e.g. Opening Ceremony 2083"
          />
        </div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-primary-500 bg-primary-50' :
            uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' :
            'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`mx-auto mb-2 ${uploading ? 'text-gray-300' : 'text-primary-400'}`} size={28} />
          {uploading ? (
            <div>
              <p className="text-gray-500 text-sm mb-2">Uploading... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm">{isDragActive ? 'Drop photos here' : 'Drag & drop or click to upload'}</p>
              <p className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP up to 5 MB each. Multiple files supported.</p>
            </>
          )}
        </div>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="card p-8 text-center text-gray-400">
          <Image className="mx-auto mb-2" size={40} />
          <p>No photos yet. Upload some above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square shadow-md">
              <img
                src={photo.url}
                alt={photo.caption || 'Gallery'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{photo.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(photo)}
                  className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
