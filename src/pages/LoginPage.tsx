import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/services';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      if (response.data.status === 'success') {
        login({
          user_id: response.data.user_id,
          name: response.data.name,
          email: email
        });
        navigate('/');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('Connection failed. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      {/* Top Logos */}
      <div className="w-full max-w-md flex justify-between items-start mb-8">
        <img src={leftLogo} alt="Left Logo" className="h-20 w-auto object-contain" />
        <img src={rightLogo} alt="Right Logo" className="h-20 w-auto object-contain" />
      </div>

      <h1 className="text-2xl font-semibold text-[#1B5E20] mb-8">Healthy Food Habit</h1>

      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex bg-white border border-gray-200 rounded-2xl mb-8 overflow-hidden shadow-sm">
          <Link
            to="/register"
            className="flex-1 py-4 text-center font-medium text-[#1B5E20] hover:bg-gray-50 transition"
          >
            Register
          </Link>
          <div className="flex-1 py-4 text-center font-medium bg-[#004D40] text-white">
            Login
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#1B5E20]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#1B5E20]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={24} strokeWidth={1.5} /> : <Eye size={24} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" title="Forgot Password Page" className="text-sm text-[#1B5E20] hover:underline font-medium">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold py-5 rounded-3xl shadow-md transition transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 pb-4">
        <p className="text-xs text-gray-400 text-center">
          2026©powered by Engineering
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
