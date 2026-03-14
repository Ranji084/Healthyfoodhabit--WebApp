import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const BmiResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bmi = searchParams.get('bmi');
  const category = searchParams.get('category');

  const getColor = () => {
    if (category === 'Underweight') return '#3b82f6';
    if (category === 'Normal weight') return '#00C853';
    if (category === 'Overweight') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="bg-white min-h-screen p-6 space-y-8 animate-fade-in">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-green">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-dark-green uppercase">BMI Result</h1>
      </header>

      <div className="flex flex-col items-center space-y-10 py-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[16px] border-[#F5F5F5]" />
            <div 
                className="absolute inset-0 rounded-full border-[16px] transition-all duration-1000" 
                style={{ 
                    borderColor: getColor(),
                    clipPath: `inset(0 0 0 0)` // Simplified for now
                }} 
            />
            <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-dark-green tracking-tighter">{bmi}</span>
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your BMI</span>
            </div>
        </div>

        <div className="text-center space-y-3">
            <div 
                className="inline-block px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider"
                style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
            >
                {category}
            </div>
            <p className="max-w-[280px] text-slate-500 font-medium leading-relaxed">
                {category === 'Normal weight' 
                    ? "Great! Your BMI is in the healthy range. Keep maintaining your lifestyle."
                    : "Your BMI indicates you're outside the ideal range. Consider adjusting your diet and activity."}
            </p>
        </div>

        <button 
            onClick={() => navigate('/')}
            className="w-full h-14 bg-dark-green text-white font-bold rounded-[28px] shadow-lg active:scale-95 transition"
        >
            Back to Home
        </button>
      </div>
    </div>
  );
};

export default BmiResultPage;
