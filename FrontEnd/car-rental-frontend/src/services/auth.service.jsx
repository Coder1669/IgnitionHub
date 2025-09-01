import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data;
};

const register = (name, email, password, phone, address) => {
  return api.post('/auth/register', { name, email, password, phone, address });
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const verifyEmail = (token) => {
  return api.get(`/auth/verify-email-api?token=${token}`);
};

const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

// CHANGE THIS FUNCTION
const resetPassword = (token, newPassword) => {
  // Add '-api' to the end of the URL
  return api.post('/auth/reset-password-api', { token, newPassword });
};

const authService = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

export default authService;