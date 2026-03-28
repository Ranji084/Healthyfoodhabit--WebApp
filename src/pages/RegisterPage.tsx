import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import leftLogo from '../assets/left_logo.jpeg';
import rightLogo from '../assets/right _logo.jpeg';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    goal: 'Maintenance'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      if (response.data.status === 'success') {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
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
      <div className="w-full max-w-md flex justify-between items-start mb-6">
        <img src={leftLogo} alt="Left Logo" className="h-16 w-auto object-contain" />
        <img src={rightLogo} alt="Right Logo" className="h-16 w-auto object-contain" />
      </div>

      <h1 className="text-2xl font-semibold text-[#1B5E20] mb-6">Healthy Food Habit</h1>

      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm">
          <div className="flex-1 py-2.5 text-center font-medium bg-[#004D40] text-white">
            Register
          </div>
          <Link
            to="/login"
            className="flex-1 py-2.5 text-center font-medium text-[#1B5E20] hover:bg-gray-50 transition"
          >
            Login
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1B5E20]">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1B5E20]">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1B5E20]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye size={20} strokeWidth={1.5} /> : <EyeOff size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1B5E20]">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <Eye size={20} strokeWidth={1.5} /> : <EyeOff size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1B5E20]">Health Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition appearance-none"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Muscle Gain">Muscle Gain</option>
            </select>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold rounded-lg shadow-md transition transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 pb-4">
        <p className="text-xs text-gray-400 text-center">
          2026©powered by Engineering
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
