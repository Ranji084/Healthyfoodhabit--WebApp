import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  Star, 
  Info, 
  ShieldCheck, 
  CircleHelp 
} from 'lucide-react';

interface SettingCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const SettingCard: React.FC<SettingCardProps> = ({ icon, iconBg, iconColor, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white rounded-[24px] p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0,04)] border border-slate-50 active:scale-[0.98] transition group"
  >
    <div className="flex items-center gap-4 text-left">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#2D4A43]">{title}</h3>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2D4A43] transition" />
  </button>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-sm font-bold text-[#2D4A43] opacity-60 mb-3 px-2">{title}</h2>
);

const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  return (
    <div className="bg-[#F8FAF9] min-h-screen animate-fade-in pb-32">
      {/* Header */}
      <div className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-[#2D4A43]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#2D4A43]">Settings ⚙️</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="p-6 space-y-8">
        {/* Profile Section */}
        <section>
          <SectionHeader title="Profile" />
          <SettingCard 
            icon={<User className="w-6 h-6" />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            title="Edit Profile"
            subtitle="Update your stats & goals"
            onClick={() => navigate('/edit-profile')}
          />
        </section>

        {/* Rate Us Section */}
        <section>
          <SectionHeader title="Rate Us" />
          <div className="bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0,04)] border border-slate-50">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-[#2D4A43] mb-1">Enjoying the app?</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Tap a star to rate your experience</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setRating(s)}
                  className="p-1 transition active:scale-90"
                >
                  <Star 
                    className={`w-8 h-8 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}`} 
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <SectionHeader title="About" />
          <SettingCard 
            icon={<Info className="w-6 h-6" />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            title="About App"
            subtitle="Learn more about Healthy Habit"
            onClick={() => navigate('/about')}
          />
        </section>

        {/* Support Section */}
        <section>
          <SectionHeader title="Support" />
          <div className="space-y-3">
            <SettingCard 
              icon={<ShieldCheck className="w-6 h-6" />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Privacy Policy"
              subtitle="How we handle your data"
              onClick={() => navigate('/privacy')}
            />
            <SettingCard 
              icon={<CircleHelp className="w-6 h-6" />}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              title="FAQs"
              subtitle="Frequently asked questions"
              onClick={() => navigate('/faq')}
            />
          </div>
        </section>

        {/* Logout */}
        <div className="pt-4 flex justify-center">
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-500 font-bold active:scale-95 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
