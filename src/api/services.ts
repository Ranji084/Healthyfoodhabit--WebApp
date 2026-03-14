import apiClient from './apiClient';

export const authService = {
  register: (userData: any) => apiClient.post('/register', userData),
  login: (credentials: any) => apiClient.post('/login', credentials),
  forgotPassword: (email: string) => apiClient.post('/forgot_password', { email }),
  verifyOtp: (email: string, otp: string) => apiClient.post('/verify_otp', { email, otp }),
  resetPassword: (passwordData: any) => apiClient.post('/reset_password', passwordData),
  updateProfile: (profileData: any) => apiClient.post('/update_profile', profileData),
};

export const mealService = {
  addMeal: (mealData: any) => apiClient.post('/add_meal', mealData),
  getTodayMeals: (userId: number) => apiClient.get(`/meals/today/${userId}`),
  getViewInsights: (userId: number) => apiClient.post('/view_insights', { user_id: userId }),
};

export const wellnessService = {
  getDailyProgress: (userId: number) => apiClient.get(`/progress/${userId}`),
  getRecommendation: (userId: number) => apiClient.get(`/recommend/${userId}`),
  addReview: (reviewData: any) => apiClient.post('/add_review', reviewData),
  saveDate: (dateData: any) => apiClient.post('/save_date', dateData),
};
