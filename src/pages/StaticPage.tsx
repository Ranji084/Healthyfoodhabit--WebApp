import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StaticPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/about': return 'About App';
      case '/privacy': return 'Privacy Policy';
      case '/faq': return 'FAQs';
      default: return 'Information';
    }
  };

  const getContent = () => {
    switch (location.pathname) {
      case '/about':
        return (
          <div className="space-y-4">
            <p>Welcome to Healthy Habit, your personal companion for a healthier lifestyle.</p>
            <p>Our app helps you track your meals, monitor your progress, and achieve your wellness goals with ease.</p>
            <p className="font-bold text-dark-green">Version 1.0.0</p>
          </div>
        );
      case '/privacy':
        return (
          <div className="space-y-4 text-sm text-slate-600">
            <h3 className="font-bold text-dark-green text-base">Data Collection</h3>
            <p>We collect minimal data to provide you with the best experience, including your meal logs and basic profile information.</p>
            <h3 className="font-bold text-dark-green text-base">Security</h3>
            <p>Your data is encrypted and stored securely. We do not share your personal information with third parties.</p>
          </div>
        );
      case '/faq':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-dark-green mb-1">How do I add a meal?</h3>
              <p className="text-sm text-slate-600">Go to the Dashboard and click the "+" button or the "Add Meal" card.</p>
            </div>
            <div>
              <h3 className="font-bold text-dark-green mb-1">Can I track my BMI?</h3>
              <p className="text-sm text-slate-600">Yes, you can check your BMI in the Wellness section based on your weight and height.</p>
            </div>
          </div>
        );
      default:
        return <p>Content coming soon...</p>;
    }
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen animate-fade-in pb-32">
      <div className="bg-white px-6 py-6 flex items-center gap-4 sticky top-0 z-10 border-b border-slate-50">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-[#2D4A43]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#2D4A43]">{getTitle()}</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
          {getContent()}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
