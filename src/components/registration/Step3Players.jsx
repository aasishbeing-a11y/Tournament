import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, User, Users } from 'lucide-react';

const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

export default function Step3Players() {
  const { register, control, formState: { errors }, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'players' });
  const players = watch('players') || [];

  const addPlayer = () => {
    if (fields.length < 5) {
      const defaultPositions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
      append({ name: '', jerseyNumber: '', dob: '', position: defaultPositions[fields.length] || 'Point Guard' });
    }
  };

  // Check for duplicate jersey numbers
  const usedNumbers = players.map(p => p.jerseyNumber).filter(Boolean);
  const isDuplicateJersey = (num, index) => {
    if (!num) return false;
    return usedNumbers.filter((n, i) => n === num && i !== index).length > 0;
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-dark mb-1 flex items-center gap-2">
            <Users className="text-primary-500" size={20} /> 5 Players (Boys 5x5)
          </h2>
          <p className="text-gray-500 text-sm">Register your 5 players. Exactly 5 players are required.</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold font-heading ${fields.length === 5 ? 'text-green-500' : 'text-primary-500'}`}>
            {fields.length}
          </span>
          <span className="text-gray-400 text-sm font-medium"> / 5</span>
        </div>
      </div>

      {errors.players?.root && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errors.players.root.message}
        </p>
      )}

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <User className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-400 mb-3">No players added. Exactly 5 are required.</p>
          <button type="button" onClick={addPlayer} className="btn-secondary text-xs">
            <Plus size={14} /> Add First Player
          </button>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const jerseyNum = watch(`players.${index}.jerseyNumber`);
          const hasDuplicate = isDuplicateJersey(jerseyNum, index);

          return (
            <div key={field.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-primary-600 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  Player {index + 1}
                </span>
                {fields.length > 5 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove player"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs" htmlFor={`player-name-${index}`}>Full Name *</label>
                  <input
                    id={`player-name-${index}`}
                    {...register(`players.${index}.name`)}
                    className="form-input text-sm"
                    placeholder="Player full name"
                  />
                  {errors.players?.[index]?.name && (
                    <p className="form-error">{errors.players[index].name.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label text-xs" htmlFor={`player-jersey-${index}`}>
                    Jersey Number *
                    {hasDuplicate && <span className="text-red-500 ml-1 font-semibold">(Duplicate!)</span>}
                  </label>
                  <input
                    id={`player-jersey-${index}`}
                    type="number"
                    min="0"
                    max="99"
                    {...register(`players.${index}.jerseyNumber`)}
                    className={`form-input text-sm ${hasDuplicate ? 'border-red-400 focus:ring-red-400 bg-red-50' : ''}`}
                    placeholder="e.g. 23"
                  />
                  {errors.players?.[index]?.jerseyNumber && (
                    <p className="form-error">{errors.players[index].jerseyNumber.message}</p>
                  )}
                  {hasDuplicate && <p className="form-error">Jersey number already assigned to another player</p>}
                </div>
                <div>
                  <label className="form-label text-xs" htmlFor={`player-dob-${index}`}>Date of Birth *</label>
                  <input
                    id={`player-dob-${index}`}
                    type="date"
                    {...register(`players.${index}.dob`)}
                    className="form-input text-sm"
                  />
                  {errors.players?.[index]?.dob && (
                    <p className="form-error">{errors.players[index].dob.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label text-xs" htmlFor={`player-position-${index}`}>Position *</label>
                  <select
                    id={`player-position-${index}`}
                    {...register(`players.${index}.position`)}
                    className="form-input text-sm"
                  >
                    <option value="">Select position</option>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.players?.[index]?.position && (
                    <p className="form-error">{errors.players[index].position.message}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fields.length < 5 && (
        <button
          type="button"
          onClick={addPlayer}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary-300 text-primary-500 hover:border-primary-500 hover:bg-primary-50 font-semibold text-sm transition-all"
        >
          <Plus size={18} />
          Add Player ({fields.length}/5)
        </button>
      )}
    </div>
  );
}
