import React, { useState } from 'react';

const RatingFeedbackPrompt = ({
  isOpen,
  title = "Rate Your Experience",
  message = "How would you rate your experience?",
  onConfirm,
  onCancel,
  confirmText = "Submit",
  cancelText = "Cancel",
  feedbackPlaceholder = "Additional feedback (optional)...",
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ rating, feedback });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && rating > 0) {
      handleConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        {/* Star Rating */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <svg
                className={`w-10 h-10 mx-1 ${
                  (hoverRating || rating) >= star 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        
        {/* Feedback Textarea */}
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder={feedbackPlaceholder}
          rows="3"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        {/* Rating Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Not satisfied</span>
          <span>Very satisfied</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={rating === 0}
            className={`px-4 py-2 text-white rounded-md transition ${
              rating > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-400 cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingFeedbackPrompt;