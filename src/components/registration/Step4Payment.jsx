import React from 'react';
import { useFormContext } from 'react-hook-form';
import ImageUpload from './ImageUpload';
import { Smartphone, ScanLine, ShieldCheck } from 'lucide-react';

const ESEWA_QR = 'https://i.ibb.co/NgmMY2tL/ustav-qr.jpg';
const ESEWA_ID = '9829423438';

export default function Step4Payment({ formData, setFormData }) {
  const { register, formState: { errors }, setValue } = useFormContext();

  register('screenshotFile');

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-xl font-heading font-bold text-dark mb-1">Payment Details</h2>
        <p className="text-gray-500 text-sm">
          Registration fee: <strong>₹500</strong>. Pay via <strong>eSewa</strong> and upload proof.
        </p>
      </div>

      {/* Payment method — eSewa only */}
      <div>
        <label className="form-label">Payment Method *</label>
        <label className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all border-primary-500 bg-primary-50">
          <input
            type="radio"
            value="eSewa"
            defaultChecked
            {...register('paymentMethod')}
            className="hidden"
          />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-500 text-white">
            <Smartphone size={16} />
          </div>
          <div>
            <p className="font-semibold text-dark text-sm">eSewa</p>
            <p className="text-gray-400 text-xs">Scan QR or pay to eSewa ID</p>
          </div>
        </label>
        {errors.paymentMethod && <p className="form-error">{errors.paymentMethod.message}</p>}
      </div>

      {/* eSewa QR */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <p className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <ScanLine size={16} /> Pay ₹500 with eSewa
        </p>
        <div className="bg-white rounded-xl p-3 flex flex-col items-center border border-blue-100">
          <img
            src={ESEWA_QR}
            alt="eSewa QR code for Husler Cup"
            className="w-52 h-52 object-contain rounded-lg"
            loading="eager"
          />
          <p className="mt-3 text-blue-700 text-sm">
            eSewa ID: <strong>{ESEWA_ID}</strong> (Husler Cup)
          </p>
        </div>
        <ol className="mt-3 text-blue-700 space-y-1 list-decimal list-inside">
          <li>Open eSewa and scan the QR above (or use ID {ESEWA_ID}).</li>
          <li>Pay exactly <strong>₹500</strong>.</li>
          <li>Copy the transaction ID and upload the payment screenshot below.</li>
        </ol>
        <p className="mt-2 flex items-center gap-1.5 text-blue-800 font-medium text-xs">
          <ShieldCheck size={14} /> Payment is verified by the organizers before approval.
        </p>
      </div>

      {/* Transaction ID */}
      <div>
        <label className="form-label" htmlFor="transactionId">
          Transaction ID / Reference *
        </label>
        <input
          id="transactionId"
          {...register('transactionId')}
          className="form-input"
          placeholder="e.g. TXN123456789"
        />
        {errors.transactionId && <p className="form-error">{errors.transactionId.message}</p>}
      </div>

      {/* Screenshot upload */}
      <ImageUpload
        id="screenshotFile"
        label="Payment Screenshot *"
        value={formData.screenshotFile}
        onChange={(file) => {
          setFormData(prev => ({ ...prev, screenshotFile: file }));
          setValue('screenshotFile', file);
        }}
        error={errors.screenshotFile?.message}
      />
    </div>
  );
}
