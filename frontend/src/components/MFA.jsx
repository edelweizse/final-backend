import React, { useState, useRef } from 'react';
import { useMFAStore } from '../stores/mfaStore';
import { useNavigate, Link } from 'react-router-dom';

const MFA = ({userId}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { verify, error, isLoading, user } = useMFAStore();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = code.join('');

    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      await verify(otpCode, navigate);
    } catch (err) {
      console.error('Error verifying OTP:', err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <h2 className="text-white text-4xl font-semibold pb-4 border-b-2 border-white mb-8">
        Verify 2FA Code
      </h2>
      <p className="text-center text-gray-300 mb-6">
        Enter the 6-digit code from your authenticator.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none mx-2"
            />
          ))}
        </div>
        {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
        <button
          className={`w-full py-4 bg-green-500 text-white uppercase rounded-lg hover:bg-green-700 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={isLoading || code.some((digit) => !digit)}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <Link to="/auth/login">
        <p className="text-green-500 hover:text-green-700 transition-colors mt-4">
          Go back
        </p>
      </Link>
    </div>
  );
};

export default MFA;
