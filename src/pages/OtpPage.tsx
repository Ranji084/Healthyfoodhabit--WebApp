import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/services';
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Refs for input focus management
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { email, type } = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate('/login');
        } else {
            // Auto focus first input on mount
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Only take last character
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').trim();
        if (data.length === 6 && !isNaN(Number(data))) {
            const pastedOtp = data.split('');
            setOtp(pastedOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            console.log('Verifying OTP for:', email, 'type:', type, 'OTP:', otpString);
            const response = await authService.verifyOtp(email, otpString);
            
            // Loosened check: Support status 200 or exact message match
            const isSuccess = response.status === 200 || 
                             response.data.message?.toLowerCase().includes('verified') ||
                             response.data.status === 'success';

            if (isSuccess && response.data.message !== 'Invalid OTP') {
                if (type === 'forgot') {
                    console.log('Success! Navigating to Reset Password page.');
                    navigate('/reset-password', { state: { email, otp: otpString } });
                } else {
                    console.log('Success! Navigating back to Login.');
                    navigate('/login', { state: { message: 'Verification successful!' } });
                }
            } else {
                setError(response.data.message || 'Invalid verification code');
            }
        } catch (err: any) {
            console.error('Verify Error:', err);
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsLoading(true);
        try {
            // NOTE: Resend currently calls forgotPassword which might fail for registration
            // if the backend expects a different route.
            await authService.forgotPassword(email);
            setTimer(30);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']); 
            setError('');
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError('Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
            <div className="w-full max-w-md flex justify-between items-start pt-4 mb-8">
                <img src={leftLogo} alt="Left Logo" className="h-16 w-auto object-contain" />
                <img src={rightLogo} alt="Right Logo" className="h-16 w-auto object-contain" />
            </div>

            <div className="max-w-md w-full flex flex-col items-center space-y-8 animate-fade-in">
                <div className="bg-[#E8F5E9] p-4 rounded-full">
                    <ShieldCheck className="w-12 h-12 text-[#1B5E20]" />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-[#1B5E20]">Verify Your Email</h1>
                    <p className="text-gray-500 text-sm px-4">
                        We've sent a 6-digit verification code to
                        <br />
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="w-full p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="w-full space-y-8">
                    <div className="flex justify-between gap-2 px-2" onPaste={handlePaste}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={data}
                                onChange={e => handleChange(e.target.value, index)}
                                onKeyDown={e => handleBackspace(e, index)}
                                onFocus={e => e.target.select()}
                                className="w-12 h-11 border border-gray-300 rounded-lg text-center text-xl font-bold text-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition bg-gray-50"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-12 h-10 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-sm rounded-lg shadow-md transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-2 text-sm">
                            <span className="text-gray-500">Didn't receive the code?</span>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend || isLoading}
                                className={`font-bold flex items-center gap-1 ${canResend ? 'text-[#1B5E20] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                                <RefreshCw className={`w-4 h-4 ${!canResend && 'opacity-50'}`} />
                                {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                            </button>
                        </div>
                    </div>
                </form>

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 font-medium hover:text-[#1B5E20] transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
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

export default OtpPage;
