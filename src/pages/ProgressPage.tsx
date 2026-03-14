import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mealService } from '../api/services';
import { BarChart2, PieChart as PieChartIcon, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_id) {
      mealService.getViewInsights(user.user_id)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-dark-green border-t-transparent rounded-full animate-spin"></div></div>;

  const totals = data?.nutrition_totals || { protein: 0, carbs: 0, fat: 0, calories: 0 };
  const percentages = data?.nutrient_percentages || { protein_percent: 0, carbs_percent: 0, fat_percent: 0 };
  
  const pieData = [
    { name: 'Protein', value: percentages.protein_percent, color: '#00C853' },
    { name: 'Carbs', value: percentages.carbs_percent, color: '#2E7D32' },
    { name: 'Fat', value: percentages.fat_percent, color: '#FDF1E1' },
  ];

  const breakdown = data?.meal_breakdown || {};
  const barData = Object.keys(breakdown).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    calories: breakdown[key].reduce((acc: number, item: any) => acc + item.calories, 0)
  }));

  return (
    <div className="bg-white min-h-screen p-6 space-y-8 animate-fade-in pb-32">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-green">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-dark-green uppercase">Health Insights</h1>
      </header>

      {/* Nutrient Distribution Card */}
      <section className="bg-dark-green rounded-[32px] p-8 text-white space-y-8 shadow-xl">
        <div className="flex items-center gap-3">
          <PieChartIcon className="w-5 h-5 text-white/70" />
          <h2 className="text-lg font-bold">Nutrient Distribution</h2>
        </div>

        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', color: '#014D33' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black">{totals.calories?.toFixed(0) || 0}</span>
            <span className="text-[10px] font-bold opacity-60 uppercase">Kcal Total</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {pieData.map(item => (
            <div key={item.name} className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ backgroundColor: item.color }}></div>
              <span className="text-[10px] font-bold opacity-60 uppercase mb-1">{item.name}</span>
              <span className="text-lg font-black">{item.value?.toFixed(0) || 0}%</span>
            </div>
          ))}
        </div>

      </section>

      {/* Calories Bar Chart */}
      <section className="bg-white rounded-[24px] p-6 border border-slate-50 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-5 h-5 text-dark-green" />
          <h2 className="text-lg font-bold text-dark-green uppercase">Calories by Meal</h2>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
              <Bar dataKey="calories" fill="#014D33" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>



      {/* Meal Log */}
      <section className="bg-white rounded-[24px] p-6 border border-slate-50 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">🥗</span>
          <h2 className="text-lg font-bold text-dark-green uppercase">Today's Meals</h2>
        </div>
        
        <div className="space-y-6">
          {Object.keys(breakdown).filter(key => breakdown[key].length > 0).map(key => (
            <div key={key} className="space-y-3">
              <h3 className="font-bold text-slate-800 capitalize border-b border-slate-100 pb-2">{key}</h3>
              <div className="space-y-3">
                {breakdown[key].map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
                    <p className="font-semibold text-slate-700 capitalize">{item.food || 'Meal item'}</p>
                    <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase">
                      <span className="text-dark-green">{item.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(breakdown).every(key => breakdown[key].length === 0) && (
            <p className="text-center text-slate-400 font-medium py-4">No meals added today.</p>
          )}
        </div>
      </section>

      {/* AI Coach Suggestions */}
      {(data?.ai_suggestion || data?.ai_advice || data?.advice || data?.nutritionAdvice || data?.ai_tip) && (
        <section className="space-y-4 pt-4">
          <h2 className="text-[14px] font-bold text-[#2D4A43]">AI Coach Suggestions</h2>
          <div className="bg-[#EAF7ED] rounded-[24px] p-5 flex gap-4 items-start shadow-sm border border-[#D5EFE0]">
            <div className="bg-[#2D4A43] rounded-full p-1 mt-0.5 shrink-0 flex items-center justify-center w-6 h-6">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#2D4A43] text-[15px]">Personalized Advice</h3>
              <p className="text-[#5F7C73] text-[13px] leading-relaxed">
                {data?.ai_suggestion || data?.ai_advice || data?.advice || data?.nutritionAdvice || data?.ai_tip}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProgressPage;
