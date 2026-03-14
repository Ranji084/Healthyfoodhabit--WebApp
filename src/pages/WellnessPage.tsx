import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Moon, Info, CheckCircle2 } from 'lucide-react';

const WellnessPage: React.FC = () => {
  const navigate = useNavigate();
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState({ start: '', end: '' });
  const [showReport, setShowReport] = useState(false);

  const calculateSleepDuration = () => {
    if (!sleep.start || !sleep.end) return 0;
    const [h1, m1] = sleep.start.split(':').map(Number);
    const [h2, m2] = sleep.end.split(':').map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 24 * 60;
    return diff / 60;
  };

  const getWellnessScore = () => {
    let score = 0;
    if (water >= 8) score += 50;
    else score += (water / 8) * 50;
    
    const duration = calculateSleepDuration();
    if (duration >= 7 && duration <= 9) score += 50;
    else if (duration > 0) score += 25;
    
    return score;
  };

  return (
    <div className="bg-white min-h-screen p-6 space-y-8 animate-fade-in pb-32">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-green">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-dark-green uppercase">Wellness Tracker</h1>
      </header>

      <div className="space-y-6">
        {/* Water Intake */}
        <div className="bg-[#F5F5F5] rounded-[24px] p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-blue-500" />
                    <h2 className="font-bold text-dark-green">Water Intake</h2>
                </div>
                <span className="text-blue-600 font-bold">{water} / 8 Glasses</span>
            </div>
            
            <div className="flex justify-between items-center gap-2">
                {[...Array(8)].map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setWater(i + 1)}
                        className={`w-8 h-10 rounded-lg flex items-center justify-center transition-all ${i < water ? 'bg-blue-500 text-white' : 'bg-white border border-blue-200 text-blue-300'}`}
                    >
                        <Droplets className="w-4 h-4" />
                    </button>
                ))}
            </div>
        </div>

        {/* Sleep Tracker */}
        <div className="bg-[#F5F5F5] rounded-[24px] p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Moon className="w-6 h-6 text-indigo-500" />
                <h2 className="font-bold text-dark-green">Sleep Schedule</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bed Time</label>
                    <input 
                        type="time" 
                        value={sleep.start} 
                        onChange={e => setSleep({...sleep, start: e.target.value})}
                        className="w-full h-12 bg-white rounded-xl px-4 border border-slate-100 outline-none focus:ring-2 focus:ring-dark-green"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Wake Up</label>
                    <input 
                        type="time" 
                        value={sleep.end} 
                        onChange={e => setSleep({...sleep, end: e.target.value})}
                        className="w-full h-12 bg-white rounded-xl px-4 border border-slate-100 outline-none focus:ring-2 focus:ring-dark-green"
                    />
                </div>
            </div>
        </div>

        {/* Action Button */}
        <button 
            onClick={() => setShowReport(true)}
            className="w-full h-14 bg-dark-green text-white font-bold rounded-[28px] shadow-lg shadow-green-50 active:scale-95 transition"
        >
            Generate Wellness Report
        </button>

        {showReport && (
            <div className="bg-dark-green rounded-[32px] p-8 text-white space-y-6 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
                    <h2 className="text-xl font-bold">Your Report</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-sm opacity-70">Wellness Score</span>
                        <span className="text-4xl font-black">{getWellnessScore()}%</span>
                    </div>
                    
                    <div className="p-4 bg-white/10 rounded-2xl flex gap-3 italic text-sm">
                        <Info className="w-5 h-5 shrink-0" />
                        {getWellnessScore() > 80 ? "Excellent habits! Keep up the consistency." : "Minor improvements can boost your energy levels."}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WellnessPage;
