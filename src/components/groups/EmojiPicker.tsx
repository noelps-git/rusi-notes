'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
  'Food & Drink': ['🍛', '🍚', '🍜', '🍝', '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🥗', '🍿', '🧈', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍳', '🥚', '🍱', '🍙', '🍘', '🍥', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉'],
  'Gestures': ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🙏', '✍️', '👏', '🙌', '👐', '🤲', '🤝'],
  'Hearts & Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '⭐', '✨', '💫', '⚡', '💥', '💯', '✅', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉'],
  'Objects': ['🎯', '🎲', '🎮', '🎰', '🧩', '🎭', '🎨', '🧵', '🪡', '🧶', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💾', '💿', '📀', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠'],
};

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Smileys');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
        title="Add emoji"
      >
        <Smile size={20} className="text-[#999999] hover:text-white" />
      </button>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker */}
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-[#1E1E1E] border border-[#333333] rounded-2xl shadow-[0_16px_64px_rgba(0,9,255,0.3)] w-80">
            {/* Header */}
            <div className="p-3 border-b border-[#333333]">
              <h3 className="text-sm font-semibold text-white">Pick an emoji 😊</h3>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 p-2 border-b border-[#333333] overflow-x-auto">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-[#00B14F] text-white'
                      : 'text-[#999999] hover:bg-[#333333] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-2xl hover:bg-[#333333] rounded-lg transition-colors"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[#333333] text-center">
              <p className="text-xs text-[#666666]">
                Click any emoji to add it 🎯
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
