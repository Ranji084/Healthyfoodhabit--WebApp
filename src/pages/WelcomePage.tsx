import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/services';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

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
    <div className="min-h-screen bg-white flex flex-col items-center p-6 relative">
      <div className="max-w-md w-full flex flex-col items-center space-y-8 animate-fade-in flex-1">
        {/* Top Logos */}
        <div className="w-full flex justify-between items-start pt-4">
          <img src={leftLogo} alt="Left Logo" className="h-20 w-auto object-contain" />
          <img src={rightLogo} alt="Right Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1B5E20]">Healthy Food Habit</h1>

        {/* Auth Toggle */}
        <div className="w-full flex bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setIsRegisterSelected(true)}
            className={`flex-1 py-4 font-bold transition-all duration-300 ${isRegisterSelected ? 'bg-[#004D40] text-white shadow-md' : 'bg-transparent text-[#1B5E20]'}`}
          >
            Register
          </button>
          <button
            onClick={() => setIsRegisterSelected(false)}
            className={`flex-1 py-4 font-bold transition-all duration-300 ${!isRegisterSelected ? 'bg-[#004D40] text-white shadow-md' : 'bg-transparent text-[#1B5E20]'}`}
          >
            Login
          </button>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleAuth} className="w-full space-y-6">
          <div className="space-y-4">
            {isRegisterSelected && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 pr-12 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye size={24} strokeWidth={1.5} /> : <EyeOff size={24} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {isRegisterSelected && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B5E20] ml-1 block">Health Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full h-14 bg-white border border-gray-300 rounded-2xl px-4 focus:ring-2 focus:ring-[#1B5E20] outline-none transition appearance-none"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                  </select>
                </div>
              </>
            )}

            {!isRegisterSelected && (
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-[#1B5E20] font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 mt-4 bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-lg rounded-[24px] shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRegisterSelected ? 'Create Account' : 'Login')}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full py-4 mt-auto">
        <p className="text-xs text-center text-gray-400">
          2026©powered by Engineering
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
