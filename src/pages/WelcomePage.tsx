import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/services';
import { Settings, Eye as Visibility, EyeOff as VisibilityOff, Loader2 } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const [isRegisterSelected, setIsRegisterSelected] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('Weight Loss');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    if (isRegisterSelected && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const payload = isRegisterSelected 
        ? { name, email, password, age: parseInt(age), goal }
        : { email, password };

      const response = isRegisterSelected 
        ? await authService.register(payload)
        : await authService.login(payload);

      if (response.data.status === 'success') {
        const userData = {
          user_id: response.data.user_id || response.data.id,
          name: response.data.name || name,
          email: email
        };
        login(userData);
        navigate('/');
      } else {
        setError(response.data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection Error. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients (simulating Brush.verticalGradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F5] to-white pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10 space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex justify-between items-center px-2">
            <div className="w-10" /> {/* Spacer */}
            <h1 className="text-2xl font-bold text-center text-brand-green">Healthy Food Habit</h1>
            <button className="p-2 text-dark-green transition hover:bg-green-50 rounded-full">
                <Settings className="w-6 h-6" />
            </button>
        </div>

        {/* Logos (Placeholders for R.drawable.left_logo / right_logo) */}
        <div className="flex justify-between px-4">
          <div className="w-24 h-24 bg-dark-green/5 rounded-2xl flex items-center justify-center text-dark-green font-bold text-xs p-2 text-center">Left Logo</div>
          <div className="w-24 h-24 bg-dark-green/5 rounded-2xl flex items-center justify-center text-dark-green font-bold text-xs p-2 text-center">Right Logo</div>
        </div>

        {/* Auth Toggle (Surface/clickable emulation) */}
        <div className="bg-white rounded-[16px] h-14 flex p-1 shadow-sm border border-slate-100 items-stretch overflow-hidden">
            <button 
                onClick={() => setIsRegisterSelected(true)}
                className={`flex-1 rounded-xl font-bold transition-all duration-300 ${isRegisterSelected ? 'bg-dark-green text-white shadow-md' : 'text-dark-green bg-transparent'}`}
            >
                Register
            </button>
            <button 
                onClick={() => setIsRegisterSelected(false)}
                className={`flex-1 rounded-xl font-bold transition-all duration-300 ${!isRegisterSelected ? 'bg-dark-green text-white shadow-md' : 'text-dark-green bg-transparent'}`}
            >
                Login
            </button>
        </div>

        {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-bounce text-center">
                {error}
            </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-green ml-1 block">Email Address</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-green ml-1 block">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 pr-12 focus:ring-2 focus:ring-dark-green outline-none transition"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-green"
                        >
                            {showPassword ? <Visibility className="w-5 h-5" /> : <VisibilityOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {!isRegisterSelected && (
                    <div className="flex justify-end pr-1">
                        <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-dark-green font-medium">Forgot Password?</button>
                    </div>
                )}

                {isRegisterSelected && (
                   <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-green ml-1 block">Confirm Password</label>
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm"
                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-green ml-1 block">Full Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none transition"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-dark-green ml-1 block">Age</label>
                        <input 
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="25"
                            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none transition"
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <label className="text-sm font-bold text-dark-green ml-1 block">Choose Your Goal</label>
                        <div className="space-y-2">
                            {['Weight Loss', 'Maintain Weight', 'Muscle Gain'].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGoal(g)}
                                    className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all text-left ${goal === g ? 'bg-dark-green text-white border-dark-green' : 'bg-white text-dark-green border-dark-green'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                   </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[60px] bg-[#4CAF50] text-white font-bold text-lg rounded-[20px] shadow-lg shadow-green-100 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRegisterSelected ? 'Create Account' : 'Login')}
            </button>
        </form>

        <p className="text-xs text-center text-gray-400 font-medium pt-8">
            2026©powered by SIMATS Engineering
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
