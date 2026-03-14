import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import AddMealPage from './pages/AddMealPage';
import ProgressPage from './pages/ProgressPage';
import WellnessPage from './pages/WellnessPage';
import ProfilePage from './pages/ProfilePage';
import BmiResultPage from './pages/BmiResultPage';
import StaticPage from './pages/StaticPage';
import EditProfilePage from './pages/EditProfilePage';

// Simple Result Screen for Meal Analysis
const MealResultPage = () => {
    const params = new URLSearchParams(window.location.search);
    return (
        <div className="p-6 space-y-8 animate-fade-in text-center pb-32">
            <h1 className="text-2xl font-bold text-dark-green uppercase">Nutritional Analysis</h1>
            <div className="bg-dark-green p-8 rounded-[32px] text-white space-y-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/10 rounded-[24px] border border-white/5">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Calories</p>
                        <p className="text-3xl font-black">{params.get('calories')}</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-[24px] border border-white/5">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Protein</p>
                        <p className="text-3xl font-black">{params.get('protein')}g</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-[24px] border border-white/5">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Carbs</p>
                        <p className="text-3xl font-black">{params.get('carbs')}g</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-[24px] border border-white/5">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Fats</p>
                        <p className="text-3xl font-black">{params.get('fat')}g</p>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-[24px] italic text-sm border border-white/5">
                    "{params.get('advice')}"
                </div>
            </div>
            <button onClick={() => window.history.back()} className="w-full h-14 bg-dark-green text-white font-bold rounded-[28px] shadow-lg active:scale-95 transition">Done</button>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<WelcomePage />} />
          <Route path="/register" element={<WelcomePage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/add-meal" element={<AddMealPage />} />
              <Route path="/meal_result" element={<MealResultPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/settings" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/bmi_result" element={<BmiResultPage />} />
              <Route path="/about" element={<StaticPage />} />
              <Route path="/privacy" element={<StaticPage />} />
              <Route path="/faq" element={<StaticPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
