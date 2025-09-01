import api from './api';

const createBooking = (bookingData) => api.post('/bookings', bookingData);
// ADD these two functions for the user
const getMyBookings = () => api.get('/bookings/me');
const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// Admin functions
const getAllBookings = () => api.get('/bookings');
const confirmPickup = (bookingId) => api.post(`/bookings/${bookingId}/confirm-pickup`);
const completeBooking = (bookingId) => api.post(`/bookings/${bookingId}/complete`);

const bookingService = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    confirmPickup,
    completeBooking
};
export default bookingService;