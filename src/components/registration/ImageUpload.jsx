import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { validateImageFile } from '../../utils/helpers';

export default function ImageUpload({ label, value, onChange, error, id }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) return;
    onChange(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const clear = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      {preview || value ? (
        <div className="relative inline-block">
          <img
            src={preview || (typeof value === 'string' ? value : URL.createObjectURL(value))}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-xl border-2 border-primary-300"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          id={id}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {isDragActive ? <Upload className="text-primary-500" size={20} /> : <Image className="text-gray-400" size={20} />}
            </div>
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5 MB</p>
          </div>
        </div>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
