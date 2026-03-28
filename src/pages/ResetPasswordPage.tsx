import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/services';
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    if (!email || !otp) {
        // Safety check to ensure we have the context
        React.useEffect(() => {
            navigate('/forgot-password');
        }, [navigate]);
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await authService.resetPassword({ email, otp, password });
            if (response.data.message === 'Password updated successfully') {
                setIsSuccess(true);
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Request failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="bg-green-50 p-8 rounded-[40px] flex flex-col items-center space-y-4 max-w-sm w-full text-center shadow-xl border border-green-100">
                    <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                    <h2 className="text-2xl font-bold text-[#1B5E20]">Password Reset!</h2>
                    <p className="text-gray-600">Your password has been successfully updated. Redirecting you to login...</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-4">
                        <div className="bg-green-500 h-full animate-progress-loading"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
             <div className="w-full max-w-md flex justify-between items-start pt-4 mb-8">
                <img src={leftLogo} alt="Left Logo" className="h-16 w-auto object-contain" />
                <img src={rightLogo} alt="Right Logo" className="h-16 w-auto object-contain" />
            </div>

            <div className="max-w-md w-full flex flex-col items-center space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-[#1B5E20]">New Password</h1>
                    <p className="text-gray-500 text-sm">Create a strong password to secure your account</p>
                </div>

                {error && (
                    <div className="w-full p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1B5E20] ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1B5E20] ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-12 h-10 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-sm rounded-lg shadow-md transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                        </button>
                    </div>
                </form>

                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-gray-500 font-medium hover:text-[#1B5E20] transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </button>
            </div>

            <div className="w-full py-4 mt-auto">
                <p className="text-xs text-center text-gray-400">
                    2026©powered by Engineering
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
