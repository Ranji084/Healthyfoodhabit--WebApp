import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mealService } from '../api/services';
import { User as Person } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';



const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bmiInputs, setBmiInputs] = useState({ height: '', weight: '' });

  useEffect(() => {
    if (user?.user_id) {
       mealService.getViewInsights(user.user_id)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const score = data?.health_percentage || 0;
  const totals = data?.nutrition_totals || { protein: 0, carbs: 0, fat: 0 };

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(bmiInputs.height);
    const w = parseFloat(bmiInputs.weight);
    if (h && w) {
      const bmiValue = w / (h / 100) ** 2;
      const category = 
        bmiValue < 18.5 ? 'Underweight' :
        bmiValue < 25 ? 'Normal weight' :
        bmiValue < 30 ? 'Overweight' : 'Obese';
      navigate(`/bmi_result?bmi=${bmiValue.toFixed(1)}&category=${category}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="bg-white min-h-screen relative animate-fade-in pb-32">
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-[26px] font-bold text-dark-green">Hi, {user?.name || 'Friend'} ! 👋</h1>
                <Link to="/profile" className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-dark-green transition hover:bg-green-100">
                    <Person className="w-6 h-6" />
                </Link>
            </div>

            {/* Health Card (Replicating exact card design) */}
            <div className="bg-dark-green rounded-[32px] p-7 text-white shadow-xl flex flex-col items-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="72" cy="72" r="64"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        <circle
                            cx="72" cy="72" r="64"
                            stroke="#00C853"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 64}
                            strokeDashoffset={2 * Math.PI * 64 * (1 - score / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold">{score}%</span>
                        <span className="text-[10px] text-white/80 font-medium">Health Score</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full mt-8">
                    <div className="text-center">
                        <p className="text-xl font-bold">{totals.protein?.toFixed(0) || 0}g</p>
                        <p className="text-[12px] text-white/70">Protein</p>
                    </div>
                    <div className="text-center border-x border-white/10">
                        <p className="text-xl font-bold">{totals.carbs?.toFixed(0) || 0}g</p>
                        <p className="text-[12px] text-white/70">Carbs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{totals.fat?.toFixed(0) || 0}g</p>
                        <p className="text-[12px] text-white/70">Fats</p>
                    </div>
                </div>
            </div>

            {/* BMI Calculator Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-50 space-y-6">
                <h2 className="text-lg font-bold text-dark-green">BMI Calculator</h2>
                <form onSubmit={calculateBMI} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="number"
                            placeholder="Height (cm)"
                            value={bmiInputs.height}
                            onChange={e => setBmiInputs({...bmiInputs, height: e.target.value})}
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none"
                        />
                        <input 
                            type="number"
                            placeholder="Weight (kg)"
                            value={bmiInputs.weight}
                            onChange={e => setBmiInputs({...bmiInputs, weight: e.target.value})}
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-dark-green outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full h-12 bg-dark-green text-white font-bold rounded-xl shadow-md transition transform active:scale-95">
                        Calculate BMI
                    </button>
                </form>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <Link to="/add-meal" className="w-full h-14 bg-dark-green text-white font-bold rounded-[28px] flex items-center justify-center shadow-lg transition transform active:scale-95">
                    Add Today's Meal
                </Link>
                <Link to="/progress" className="w-full h-14 bg-white border-2 border-dark-green text-dark-green font-bold rounded-[28px] flex items-center justify-center transition transform active:scale-95">
                    View Insights
                </Link>
            </div>
        </div>


    </div>
  );
};

export default DashboardPage;
