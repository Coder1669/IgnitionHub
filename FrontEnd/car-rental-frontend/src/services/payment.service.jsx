import api from './api';

const createPaypalOrder = (bookingId) => {
  return api.post('/payment/paypal/create-order', { bookingId });
};

const capturePaypalOrder = (orderId, bookingId) => {
  return api.post('/payment/paypal/capture-order', { orderId, bookingId });
};

const paymentService = {
    createPaypalOrder,
    capturePaypalOrder,
};

export default paymentService;