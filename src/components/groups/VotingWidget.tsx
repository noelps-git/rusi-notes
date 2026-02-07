'use client';

import { useState } from 'react';
import { BarChart3, CheckCircle, Clock } from 'lucide-react';

interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

interface VotingWidgetProps {
  voteId: string;
  question: string;
  options: VoteOption[];
  expiresAt: string | null;
  totalVotes: number;
  userResponse: string | null;
  onVote: (voteId: string, optionId: string) => Promise<void>;
}

export default function VotingWidget({
  voteId,
  question,
  options,
  expiresAt,
  totalVotes,
  userResponse,
  onVote,
}: VotingWidgetProps) {
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(userResponse);

  const isExpired = expiresAt && new Date(expiresAt) < new Date();
  const hasVoted = !!selectedOption;

  const handleVote = async (optionId: string) => {
    if (voting || isExpired) return;

    setVoting(true);
    try {
      await onVote(voteId, optionId);
      setSelectedOption(optionId);
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getTimeRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#333333] rounded-2xl p-5 my-3 max-w-md">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#e52020]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-[#e52020]" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{question}</h4>
          <div className="flex items-center gap-3 text-xs text-[#999999]">
            <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
            {expiresAt && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className={isExpired ? 'text-red-400' : ''}>
                  {getTimeRemaining()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isDisabled = isExpired || voting;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isDisabled}
              className={`w-full text-left transition-all ${
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div
                className={`relative p-3 rounded-lg border-2 transition-all overflow-hidden ${
                  isSelected
                    ? 'border-[#e52020] bg-[#e52020]/10'
                    : 'border-[#333333] hover:border-[#666666]'
                }`}
              >
                {/* Background bar for results */}
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-[#e52020]/10 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-[#e52020] flex-shrink-0" />
                    )}
                    <span className="text-sm text-white">{option.text}</span>
                  </div>
                  {hasVoted && (
                    <span className="text-xs font-medium text-[#e52020] ml-2">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {isExpired && (
        <div className="mt-3 text-center">
          <p className="text-xs text-red-400">This poll has ended 🏁</p>
        </div>
      )}
      {!hasVoted && !isExpired && (
        <div className="mt-3 text-center">
          <p className="text-xs text-[#666666]">Click an option to vote 🗳️</p>
        </div>
      )}
    </div>
  );
}
