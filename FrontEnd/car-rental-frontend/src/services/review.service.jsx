import api from './api';

const getReviewsForCar = (carId) => {
  return api.get(`/cars/${carId}/reviews`);
};

const addReviewForCar = (carId, reviewData) => {
  // reviewData should be an object like { rating, comment }
  return api.post(`/cars/${carId}/reviews`, reviewData);
};

// --- NEW: Function to update a review ---
const updateReview = (carId, reviewId, reviewData) => {
  return api.put(`/cars/${carId}/reviews/${reviewId}`, reviewData);
};

// --- NEW: Function to delete a review ---
const deleteReview = (carId, reviewId) => {
  return api.delete(`/cars/${carId}/reviews/${reviewId}`);
};

const reviewService = {
  getReviewsForCar,
  addReviewForCar,
  updateReview, // <-- Add to export
  deleteReview, // <-- Add to export
};

export default reviewService;