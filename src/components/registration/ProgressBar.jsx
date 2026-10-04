import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Team Info' },
  { id: 2, label: 'Captain' },
  { id: 3, label: 'Players' },
  { id: 4, label: 'Payment' },
  { id: 5, label: 'Review' },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full mb-8">
      {/* Desktop progress */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary-500 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
              step.id < currentStep
                ? 'bg-primary-500 border-primary-500 text-white'
                : step.id === currentStep
                ? 'bg-white border-primary-500 text-primary-500'
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step.id < currentStep ? <Check size={14} /> : step.id}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              step.id <= currentStep ? 'text-primary-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile progress */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-dark">Step {currentStep} of {steps.length}</span>
          <span className="text-sm font-semibold text-primary-500">{steps[currentStep - 1]?.label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
