import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

import Layout from '../components/Layout';
import ProgressBar from '../components/registration/ProgressBar';
import Step1TeamInfo from '../components/registration/Step1TeamInfo';
import Step2Captain from '../components/registration/Step2Captain';
import Step3Players from '../components/registration/Step3Players';
import Step4Payment from '../components/registration/Step4Payment';
import Step5Consent from '../components/registration/Step5Consent';
import { registerTeam, uploadFile } from '../services/firestore';
import { TOURNAMENT } from '../utils/constants';

// ─── Zod Schema ──────────────────────────────────────────────────────
const playerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  jerseyNumber: z.string().min(1, 'Jersey number required'),
  dob: z.string().min(1, 'Date of birth required'),
  position: z.string().min(1, 'Position required'),
});

const schema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  city: z.string().min(2, 'City/School/Club is required'),
  logoFile: z.any().refine(f => f instanceof File, 'Team logo is required'),
  photoFile: z.any().refine(f => f instanceof File, 'Team photo is required'),

  captainName: z.string().min(2, 'Captain name required'),
  captainPhone: z.string().regex(/^[9][6-9]\d{8}$/, 'Enter a valid NP phone number'),
  captainEmail: z.string().email('Enter a valid email'),
  coachName: z.string().optional(),
  coachPhone: z.string().optional(),

  players: z.array(playerSchema)
    .min(5, 'All 5 players are required')
    .max(5, 'Only 5 players can register (Boys 5x5)'),

  paymentMethod: z.enum(['eSewa'], { required_error: 'Select a payment method' }),
  transactionId: z.string().min(3, 'Transaction ID is required'),
  screenshotFile: z.any().refine(f => f instanceof File, 'Payment screenshot is required'),

  acceptRules: z.literal(true, { errorMap: () => ({ message: 'You must accept the rules' }) }),
  acceptRisk: z.literal(true, { errorMap: () => ({ message: 'You must acknowledge the risk' }) }),
  signature: z.string().min(3, 'Signature (full name) is required'),
});

// Per-step fields for validation
const stepFields = {
  1: ['teamName', 'category', 'city', 'logoFile', 'photoFile'],
  2: ['captainName', 'captainPhone', 'captainEmail'],
  3: ['players'],
  4: ['paymentMethod', 'transactionId', 'screenshotFile'],
  5: ['acceptRules', 'acceptRisk', 'signature'],
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fileData, setFileData] = useState({ logoFile: null, photoFile: null, screenshotFile: null });
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: TOURNAMENT.categories[0],
      paymentMethod: 'eSewa',
      transactionId: '',
      screenshotFile: null,
      players: [
        { name: '', jerseyNumber: '', dob: '', position: 'Point Guard' },
        { name: '', jerseyNumber: '', dob: '', position: 'Shooting Guard' },
        { name: '', jerseyNumber: '', dob: '', position: 'Small Forward' },
        { name: '', jerseyNumber: '', dob: '', position: 'Power Forward' },
        { name: '', jerseyNumber: '', dob: '', position: 'Center' },
      ],
    },
    mode: 'onTouched',
  });

  const { handleSubmit, trigger, getValues } = methods;

  const nextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep(s => Math.min(s + 1, 5));
    else {
      const vals = getValues(fields);
      // Extra: check jersey duplicates at step 3
      if (step === 3) {
        const jerseys = vals.flatMap(p => p?.jerseyNumber).filter(Boolean);
        const hasDups = jerseys.length !== new Set(jerseys).size;
        if (hasDups) {
          toast.error('Duplicate jersey numbers detected. Please fix before continuing.');
          return;
        }
      }
    }
  };

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      setUploading(true);
      toast.loading('Uploading files...', { id: 'upload' });

      const teamId = `team_${Date.now()}`;

      const logoUrl = await uploadFile(
        fileData.logoFile,
        `teams/${teamId}/logo`,
        (pct) => setUploadProgress(p => ({ ...p, logo: pct }))
      );

      const photoUrl = await uploadFile(
        fileData.photoFile,
        `teams/${teamId}/photo`,
        (pct) => setUploadProgress(p => ({ ...p, photo: pct }))
      );

      let screenshotUrl = null;
      if (fileData.screenshotFile) {
        screenshotUrl = await uploadFile(
          fileData.screenshotFile,
          `teams/${teamId}/payment`,
          (pct) => setUploadProgress(p => ({ ...p, screenshot: pct }))
        );
      }

      setUploading(false);
      toast.dismiss('upload');
      toast.loading('Submitting registration...', { id: 'submit' });

      const { registrationId } = await registerTeam({
        teamName: data.teamName,
        category: data.category,
        city: data.city,
        logoUrl,
        photoUrl,
        captain: {
          name: data.captainName,
          phone: data.captainPhone,
          email: data.captainEmail,
        },
        coach: {
          name: data.coachName || '',
          phone: data.coachPhone || '',
        },
        players: data.players,
        payment: {
          method: data.paymentMethod,
          transactionId: data.transactionId || '',
          screenshotUrl: screenshotUrl || '',
          status: 'pending',
        },
        signature: data.signature,
      });

      toast.dismiss('submit');
      toast.success('Registration submitted successfully!');
      navigate(`/register/success?id=${registrationId}&team=${encodeURIComponent(data.teamName)}`);

    } catch (err) {
      console.error('Registration submit error:', err);
      toast.dismiss('upload');
      toast.dismiss('submit');
      toast.error(err.message || 'Registration failed. Please check your connection and try again.');
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-heading font-black mb-2">
            Register Your <span className="text-primary-500">Team</span>
          </h1>
          <p className="text-gray-300">Husler Cup 2083 · Registration fee: ₹{TOURNAMENT.fee}</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="card p-6 sm:p-8">
            <ProgressBar currentStep={step} />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 1 && <Step1TeamInfo formData={fileData} setFormData={setFileData} />}
                {step === 2 && <Step2Captain />}
                {step === 3 && <Step3Players />}
                {step === 4 && <Step4Payment formData={fileData} setFormData={setFileData} />}
                {step === 5 && <Step5Consent formValues={getValues()} />}

                {/* Upload progress */}
                {uploading && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(uploadProgress).map(([key, pct]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span className="capitalize">{key} upload</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(s => Math.max(s - 1, 1))}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      step === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={18} /> Back
                  </button>

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Submit Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </section>
    </Layout>
  );
}
