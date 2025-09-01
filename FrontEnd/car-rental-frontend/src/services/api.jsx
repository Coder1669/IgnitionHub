import axios from 'axios';

const VITE_API_URL = 'http://localhost:8081'; 

const api = axios.create({
  baseURL: VITE_API_URL,
});

// Request Interceptor: Adds the auth token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles token expiration and refresh
api.interceptors.response.use(
  (res) => res, // If the response is successful, just return it
  async (err) => {
    const originalConfig = err.config;

    // Check if the error is 401 and it's not a retry request
    if (originalConfig.url !== '/auth/login' && err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true; // Mark it as a retry to prevent infinite loops

      try {
        const localRefreshToken = localStorage.getItem('refreshToken');
        if (!localRefreshToken) {
            // No refresh token, logout and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(err);
        }

        // Attempt to refresh the token
        const rs = await api.post('/auth/refresh', { refreshToken: localRefreshToken });
        
        const { accessToken, refreshToken } = rs.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Update the header of the original request with the new token
        originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalConfig);
      } catch (_error) {
        // If refresh fails, log the user out and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default api;