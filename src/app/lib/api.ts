import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: 'http://apisupportrobbit.asatullayev.uz/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. MUHIM: Login yoki Refresh so'rovlarida 401 bo'lsa, hech narsa qilma
    // Bu foydalanuvchi login sahifasida xato parol kiritganda redirect bo'lib ketmasligi uchun
    if (
      originalRequest.url.includes('/auth/login/') || 
      originalRequest.url.includes('/auth/refresh/')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // Refresh token yo'q bo'lsa, to'g'ridan-to'g'ri login'ga
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access; 
        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Faqat haqiqatda refresh o'xshamasa logout qilamiz
        console.error("Sessiya muddati tugadi");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Agar hozir login sahifasida bo'lmasakgina redirect qilamiz
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;