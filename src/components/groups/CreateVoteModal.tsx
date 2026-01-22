'use client';

import { useState } from 'react';
import { X, Plus, Trash2, BarChart3 } from 'lucide-react';

interface CreateVoteModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (question: string, options: string[], expiresInHours?: number) => Promise<void>;
}

export default function CreateVoteModal({
  groupId,
  isOpen,
  onClose,
  onCreate,
}: CreateVoteModalProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [expiresInHours, setExpiresInHours] = useState<number>(24);
  const [hasExpiry, setHasExpiry] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const validOptions = options.filter((opt) => opt.trim().length > 0);
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    setCreating(true);

    try {
      await onCreate(
        question.trim(),
        validOptions.map((opt) => opt.trim()),
        hasExpiry ? expiresInHours : undefined
      );

      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setExpiresInHours(24);
      setHasExpiry(true);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create poll');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-2xl shadow-[0_16px_64px_rgba(0,9,255,0.3)] max-w-lg w-full p-6 pointer-events-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00B14F]/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#00B14F]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Poll 📊</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
            >
              <X size={20} className="text-[#999999] hover:text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Question <span className="text-[#00B14F]">*</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Where should we eat this weekend? 🍛"
                className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Options <span className="text-[#00B14F]">*</span>
                <span className="text-[#666666] text-xs ml-2">(min 2, max 10)</span>
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 bg-[#111111] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#00B14F] transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-3 flex items-center gap-2 px-4 py-2 text-[#00B14F] hover:bg-[#00B14F]/10 rounded-lg transition-all text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Option
                </button>
              )}
            </div>

            {/* Expiry */}
            <div>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={hasExpiry}
                  onChange={(e) => setHasExpiry(e.target.checked)}
                  className="w-4 h-4 accent-[#00B14F]"
                />
                <span className="text-sm font-medium text-white">Set expiry time ⏰</span>
              </label>

              {hasExpiry && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={expiresInHours}
                    onChange={(e) => setExpiresInHours(parseInt(e.target.value) || 24)}
                    min="1"
                    max="168"
                    className="w-24 px-4 py-2 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00B14F] transition-all"
                  />
                  <span className="text-sm text-[#999999]">hours (max 7 days)</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#333333] text-white rounded-[100px] hover:bg-[#333333] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-6 py-3 bg-[#00B14F] text-white rounded-[100px] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Poll 🚀'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
