import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { Loader2, ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword(email);
      if (response.data.message === 'OTP sent to email') {
        // Navigate to the shared OTP verification page with 'forgot' type
        navigate('/verify-otp', { state: { email, type: 'forgot' } });
      } else {
        setError(response.data.message || 'Error sending reset code');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md flex justify-between items-start mb-12 pt-4">
        <img src={leftLogo} alt="Left Logo" className="h-16 w-auto object-contain" />
        <img src={rightLogo} alt="Right Logo" className="h-16 w-auto object-contain" />
      </div>

      <div className="max-w-md w-full flex flex-col items-center space-y-6 animate-fade-in px-2">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-[#1B5E20]">Forgot Password</h1>
            <p className="text-gray-500 text-sm">We'll send a 6-digit verification code to your email.</p>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        
        <form onSubmit={handleSendOtp} className="w-full space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-[#1B5E20] ml-1">Email Address</label>
                <div className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                    placeholder="Enter your email"
                    required
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                </div>
            </div>
            
            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 h-10 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-sm rounded-lg shadow-md transition transform active:scale-[0.98] flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                </button>
            </div>
        </form>

        <Link to="/login" className="flex items-center gap-2 text-[#1B5E20] font-bold hover:underline transition pt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
        </Link>
      </div>

      <div className="mt-auto py-6">
        <p className="text-xs text-gray-400 text-center">
          2026©powered by Engineering
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
