import { useState, useEffect, useRef } from 'react';

const OtpPrompt = ({
  isOpen,
  title = "Enter OTP",
  message = "We've sent a verification code to your device",
  otpLength = 6,
  onConfirm,
  onCancel,
  confirmText = "Verify",
  cancelText = "Cancel",
  resendText = "Resend Code",
  onResend,
}) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take last character
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < otpLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (pasteData.length === otpLength && !isNaN(pasteData)) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      inputRefs.current[otpLength - 1].focus();
    }
  };

  const handleConfirm = () => {
    onConfirm(otp.join(''));
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({ length: otpLength }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength={1}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onResend}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {resendText}
          </button>
          <div className="text-gray-500 text-sm">
            {otp.filter(num => num !== '').length}/{otpLength}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={otp.join('').length !== otpLength}
            className={`px-4 py-2 text-white rounded-md transition ${
              otp.join('').length === otpLength 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-400 cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default OtpPrompt;