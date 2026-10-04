import React from 'react';
import { useFormContext } from 'react-hook-form';
import ImageUpload from './ImageUpload';
import { TOURNAMENT } from '../../utils/constants';

export default function Step1TeamInfo({ formData, setFormData }) {
  const { register, formState: { errors }, setValue, watch } = useFormContext();

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark mb-1">Team Information</h2>
        <p className="text-gray-500 text-sm">Fill in your team's basic details</p>
      </div>

      <div>
        <label className="form-label" htmlFor="teamName">Team Name *</label>
        <input
          id="teamName"
          {...register('teamName')}
          className="form-input"
          placeholder="e.g. Chitwan Warriors"
        />
        {errors.teamName && <p className="form-error">{errors.teamName.message}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="category">Category *</label>
        <select id="category" {...register('category')} className="form-input">
          {TOURNAMENT.categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category.message}</p>}
      </div>

      <div>
        <label className="form-label" htmlFor="city">City / School / Club *</label>
        <input
          id="city"
          {...register('city')}
          className="form-input"
          placeholder="e.g. Bharatpur-10, Chitwan"
        />
        {errors.city && <p className="form-error">{errors.city.message}</p>}
      </div>

      <ImageUpload
        id="logoFile"
        label="Team Logo (max 5 MB) *"
        value={formData.logoFile}
        onChange={(file) => {
          setFormData(prev => ({ ...prev, logoFile: file }));
          setValue('logoFile', file);
        }}
        error={errors.logoFile?.message}
      />

      <ImageUpload
        id="photoFile"
        label="Team Photo (max 5 MB) *"
        value={formData.photoFile}
        onChange={(file) => {
          setFormData(prev => ({ ...prev, photoFile: file }));
          setValue('photoFile', file);
        }}
        error={errors.photoFile?.message}
      />
    </div>
  );
}
