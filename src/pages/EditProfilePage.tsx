import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { authService } from '../api/services';

const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const u: any = user;
  const [formData, setFormData] = useState({
    name: u?.name || '',
    email: u?.email || '',
    phone: u?.phone || '',
    age: u?.age || '',
    weight: u?.weight || '',
    height: u?.height || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.email) {
        await authService.updateProfile({ ...formData, email: user.email });
        updateUser({ name: formData.name });
      }
      setTimeout(() => {
        setLoading(false);
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen animate-fade-in pb-32">
      <div className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-10 border-b border-slate-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-[#2D4A43]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#2D4A43]">Edit Profile</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-6">

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Full Name</label>
              <input
                name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Age</label>
              <input
                name="age" type="number" value={formData.age} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Weight (kg)</label>
                <input
                  name="weight" type="number" value={formData.weight} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Height (cm)</label>
                <input
                  name="height" type="number" value={formData.height} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D4A43] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition mt-8 text-base"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
