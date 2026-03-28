import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Moon, Info, CheckCircle2, User, Calendar, Award, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WellnessPage: React.FC = () => {
  const { user } = useAuth();
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
    
    return Math.round(score);
  };

  const getHealthAdvice = () => {
    const score = getWellnessScore();
    const duration = calculateSleepDuration();
    
    if (score >= 90) return "Outstanding! Your hydration and sleep patterns are optimal for peak performance. Keep this consistency to maintain long-term metabolic health.";
    if (water < 6 && duration < 6) return "Critical focus needed on both hydration and rest. Lack of sleep combined with dehydration can significantly slow your metabolism and mental focus.";
    if (water < 6) return "Increase your water intake to at least 2 more glasses today. Proper hydration is key to nutrient absorption and skin health.";
    if (duration < 7) return "Aim for 7-8 hours of rest tonight. Sleep is when your body repairs muscle tissue and regulates hormones that control hunger.";
    return "You're on the right track! Minor adjustments in your daily routine can further boost your natural energy levels.";
  };

  const handleDownloadPDF = () => {
    window.print();
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
        <div className="bg-[#F5F5F5] rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <Moon className="w-6 h-6 text-indigo-500" />
                </div>
                <h2 className="font-bold text-dark-green">Sleep Schedule</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bed Time</label>
                    <input 
                        type="time" 
                        value={sleep.start} 
                        onChange={e => setSleep({...sleep, start: e.target.value})}
                        className="w-full h-10 bg-white rounded-lg px-4 border border-slate-100 outline-none focus:ring-2 focus:ring-dark-green"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Wake Up</label>
                    <input 
                        type="time" 
                        value={sleep.end} 
                        onChange={e => setSleep({...sleep, end: e.target.value})}
                        className="w-full h-10 bg-white rounded-lg px-4 border border-slate-100 outline-none focus:ring-2 focus:ring-dark-green"
                    />
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
            <button 
                onClick={() => setShowReport(true)}
                className="px-10 h-10 bg-dark-green text-white font-semibold text-sm rounded-lg shadow-md active:scale-95 transition"
            >
                Generate Wellness Report
            </button>
        </div>

        {showReport && (
            <div className="bg-dark-green rounded-[32px] p-8 text-white space-y-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-32 h-32" />
                </div>
                
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                    <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
                    <h2 className="text-xl font-bold">Your Daily Report</h2>
                </div>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                        <span className="text-sm opacity-70">Overall Wellness Score</span>
                        <span className="text-4xl font-black">{getWellnessScore()}%</span>
                    </div>
                    
                    <div className="p-4 bg-white/10 rounded-2xl flex gap-3 italic text-sm border border-white/5">
                        <Info className="w-5 h-5 shrink-0 text-[#00C853]" />
                        {getHealthAdvice()}
                    </div>

                    <div className="flex justify-center mt-4">
                        <button 
                            onClick={handleDownloadPDF}
                            className="px-10 h-10 bg-white text-dark-green font-bold text-sm rounded-lg print:hidden transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Zap className="w-4 h-4" />
                            Download Detailed PDF
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Hidden Print-only Report Section */}
      <div id="print-report" className="hidden print:block fixed inset-0 bg-white p-12 z-[999]">
        <div className="max-w-4xl mx-auto space-y-10 border-2 border-slate-100 p-10 rounded-[40px]">
            {/* Report Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-50 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-dark-green tracking-tight uppercase mb-2">Wellness Report</h1>
                    <div className="flex items-center gap-6 text-slate-500 font-bold">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{user?.name || 'Valued User'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-dark-green text-white p-6 rounded-3xl text-center min-w-[140px]">
                    <span className="text-xs font-bold uppercase block opacity-70 mb-1">Health Score</span>
                    <span className="text-4xl font-black">{getWellnessScore()}%</span>
                </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                        <Droplets className="w-6 h-6 text-blue-500" />
                        <h3 className="font-black text-blue-900 uppercase">Hydration</h3>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-black text-blue-600">{water}</span>
                        <span className="text-blue-900/60 font-bold mb-1">/ 8 GLASSES</span>
                    </div>
                    <div className="h-3 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(water/8)*100}%` }}></div>
                    </div>
                    <p className="text-sm text-blue-800/70 font-medium">Goal progress: {Math.round((water/8)*100)}% of daily target reached.</p>
                </div>

                <div className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                        <Moon className="w-6 h-6 text-indigo-500" />
                        <h3 className="font-black text-indigo-900 uppercase">Rest & Recovery</h3>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-black text-indigo-600">{calculateSleepDuration().toFixed(1)}</span>
                        <span className="text-indigo-900/60 font-bold mb-1">HOURS SLEEP</span>
                    </div>
                    <div className="text-sm font-bold text-indigo-900/60 flex gap-4">
                        <span>{sleep.start || '--:--'} PM</span>
                        <span>→</span>
                        <span>{sleep.end || '--:--'} AM</span>
                    </div>
                    <p className="text-sm text-indigo-800/70 font-medium">Quality rating: {calculateSleepDuration() >= 7 ? 'Optimal' : calculateSleepDuration() > 0 ? 'Improvement needed' : 'Not recorded'}.</p>
                </div>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Metabolic State</span>
                    <span className="text-xl font-bold text-dark-green">{getWellnessScore() > 70 ? 'High Focus' : 'Recovery'}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hydration Level</span>
                    <span className="text-xl font-bold text-blue-600">{Math.round((water/8)*100)}%</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sleep Efficiency</span>
                    <span className="text-xl font-bold text-indigo-600">{calculateSleepDuration() >= 7 ? '98%' : 'Low'}</span>
                </div>
            </div>

            {/* AI Insights Section */}
            <div className="bg-[#f0f9f4] p-10 rounded-[40px] border border-[#dcf2e6] relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-dark-green" />
                        <h3 className="text-xl font-bold text-dark-green uppercase">Clinical Insights & Recommendations</h3>
                    </div>
                    <p className="text-lg text-[#2D4A43] leading-relaxed font-medium italic">
                        "{getHealthAdvice()}"
                    </p>
                </div>
                <div className="absolute bottom-0 right-0 p-8 opacity-5">
                    <Award className="w-32 h-32" />
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Generated by Aesthetic Health Assistant • Based on User-Logged Performance Metrics • {new Date().getFullYear()} Edition</p>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > * { visibility: hidden !important; }
          #print-report { visibility: visible !important; display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: auto !important; margin: 0 !important; padding: 40px 0 !important; }
          #print-report * { visibility: visible !important; }
          @page { size: auto; margin: 20mm; }
        }
      `}} />
    </div>
  );
};

export default WellnessPage;
