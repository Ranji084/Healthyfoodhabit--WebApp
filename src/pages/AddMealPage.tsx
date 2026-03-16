import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mealService } from '../api/services';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AddMealPage: React.FC = () => {
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [mealInput, setMealInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const mealTypes = [
    { name: 'Breakfast', emoji: '🍳' },
    { name: 'Lunch', emoji: '🥗' },
    { name: 'Snack', emoji: '🍎' },
    { name: 'Dinner', emoji: '🍛' }
  ];

  const handleAddMeal = async () => {
    if (!mealInput.trim() || !user) return;
    setIsLoading(true);

    try {
      setErrorMsg('');
      const response = await mealService.addMeal({
        user_id: user.user_id,
        meal_type: selectedMealType.toLowerCase(),
        food_text: mealInput.trim()
      });

      if (response.data) {
        const res = response.data;
        if (res.status === 'fail') {
          setErrorMsg(res.message || "We couldn't analyze that food. Try being more specific.");
          return;
        }

        const queryParams = new URLSearchParams({
          calories: (res.nutrition?.calories || res.calories || 0).toString(),
          protein: (res.nutrition?.protein || res.protein || 0).toString(),
          carbs: (res.nutrition?.carbs || res.carbs || 0).toString(),
          fat: (res.nutrition?.fat || res.fat || 0).toString(),
          advice: res.ai_tip || res.nutritionAdvice || '',
          bmi: (res.bmi || 0).toString(),
          category: res.bmiCategory || '',
          food: mealInput.trim(),
          type: selectedMealType.toLowerCase()
        });
        navigate(`/meal_result?${queryParams.toString()}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to connect to the server. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 animate-fade-in p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-green">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[22px] font-bold text-dark-green uppercase tracking-tight">Add Daily Meal</h1>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center shadow-sm animate-in zoom-in duration-300 mt-6 font-sans mb-8">
          <p className="text-red-600 font-bold text-lg mb-2">Oops!</p>
          <p className="text-red-500 font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="space-y-10">
        {/* Meal Type Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          {mealTypes.map((meal) => (
            <button
              key={meal.name}
              onClick={() => setSelectedMealType(meal.name)}
              className={`flex-shrink-0 w-[90px] h-[100px] rounded-[20px] flex flex-col items-center justify-center gap-2 transition-all ${selectedMealType === meal.name ? 'bg-dark-green text-white shadow-lg' : 'bg-[#F5F5F5] text-dark-green'
                }`}
            >
              <span className="text-2xl">{meal.emoji}</span>
              <span className="text-[12px] font-bold">{meal.name}</span>
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="space-y-4">
          <textarea
            value={mealInput}
            onChange={e => setMealInput(e.target.value)}
            placeholder="e.g. rice, chicken, apple"
            className="w-full h-40 bg-white border border-slate-200 rounded-[16px] p-6 focus:ring-2 focus:ring-dark-green outline-none transition text-lg resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddMeal}
          disabled={isLoading || !mealInput.trim()}
          className="w-full h-14 bg-dark-green text-white font-bold rounded-[28px] shadow-lg flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Calculate Nutrients'}
        </button>
      </div>
    </div>
  );
};

export default AddMealPage;
