import api from './api';

// ADMIN-ONLY FUNCTIONS
const getAllUsers = () => api.get('/users');
const deleteUser = (id) => api.delete(`/users/${id}`);

// ✅ ADD THESE FUNCTIONS FOR LOGGED-IN USERS
const getCurrentUser = () => api.get('/users/me');
const updateProfile = (profileData) => api.put('/users/profile', profileData);

const userService = {
    getAllUsers,
    deleteUser,
    getCurrentUser, // Export new function
    updateProfile   // Export new function
};

export default userService;