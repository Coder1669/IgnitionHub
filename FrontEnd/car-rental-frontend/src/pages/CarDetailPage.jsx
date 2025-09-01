import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import carService from '../services/car.service';
import bookingService from '../services/booking.service';
import paymentService from '../services/payment.service';
import reviewService from '../services/review.service';
import ReviewList from '../components/ReviewList';
import AddReview from '../components/AddReview';
import EditReviewModal from '../components/EditReviewModal';
import { 
    Car, 
    Calendar, 
    Clock, 
    CreditCard, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    Users,
    Fuel,
    Settings,
    Palette,
    MapPin,
    Star,
    Loader,
    ArrowLeft
} from 'lucide-react';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const CarDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('14:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('14:00');
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const isLoggedIn = !!localStorage.getItem('accessToken');
    const [reviews, setReviews] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            carService.getCarById(id),
            reviewService.getReviewsForCar(id)
        ])
        .then(([carRes, reviewsRes]) => {
            setCar(carRes.data);
            setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
            setLoading(false);
        })
        .catch(() => {
            setError('Failed to load car details.');
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (startDate && startTime && endDate && endTime) {
            setCheckingAvailability(true);
            const startDateTime = `${startDate}T${startTime}:00`;
            const endDateTime = `${endDate}T${endTime}:00`;

            if (new Date(endDateTime) <= new Date(startDateTime)) {
                setIsAvailable(true);
                setCheckingAvailability(false);
                return;
            }

            carService.checkAvailability(id, startDateTime, endDateTime)
                .then(response => setIsAvailable(response.data.available))
                .catch(() => setIsAvailable(true))
                .finally(() => setCheckingAvailability(false));
        }
    }, [id, startDate, startTime, endDate, endTime]);

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return navigate('/login');
        setError(''); setSuccess('');
        if (!startDate || !endDate || !startTime || !endTime) { 
            setError('Please select all dates and times.'); 
            return; 
        }

        const startDateTime = `${startDate}T${startTime}:00`;
        const endDateTime = `${endDate}T${endTime}:00`;

        try {
            const res = await bookingService.createBooking({ carId: id, startDateTime, endDateTime });
            setBooking(res.data);
            setSuccess(`Booking created! Proceed to payment.`);
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed.');
        }
    };

    const handleReviewSubmitted = (newReview) => setReviews([newReview, ...reviews]);
    const handleOpenEditModal = (review) => { setReviewToEdit(review); setShowEditModal(true); };
    const handleReviewUpdated = (updatedReview) => { 
        setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r)); 
        setShowEditModal(false); 
    };
    const handleReviewDeleted = async (reviewId) => { 
        if (window.confirm("Delete this review?")) { 
            await reviewService.deleteReview(id, reviewId); 
            setReviews(reviews.filter(r => r.id !== reviewId)); 
        } 
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getTotalPrice = () => {
        const days = calculateDays();
        return days * (car?.pricePerDay || 0);
    };

    const getAvailabilityStatus = () => {
        if (checkingAvailability) {
            return { icon: Loader, text: 'Checking...', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
        }
        if (!isAvailable) {
            return { icon: XCircle, text: 'Not Available', color: 'text-red-400', bgColor: 'bg-red-500/20' };
        }
        return { icon: CheckCircle, text: 'Available', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading car details...</p>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Car Not Found</h2>
                    <p className="text-blue-200 mb-6">The car you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 no-underline"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center space-x-2 text-blue-300 hover:text-white transition-colors duration-200 mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span>Back to Cars</span>
                    </button>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Car Information - Takes 2 columns */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Car Image and Basic Info */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                                <div className="relative">
                                    <img 
                                        src={car.imageUrl || 'https://via.placeholder.com/800x400/1e293b/64748b?text=Car+Image'} 
                                        alt={`${car.brand} ${car.model}`} 
                                        className="w-full h-64 md:h-80 object-cover"
                                    />
                                    {!isAvailable && (
                                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-center">
                                                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                                <span className="text-3xl font-bold text-white tracking-wider">UNAVAILABLE</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                                            <span className="text-white font-bold text-lg">${car.pricePerDay}/day</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                                {car.brand} {car.model}
                                            </h1>
                                            <p className="text-blue-200 text-lg">{car.description}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                <span className="text-white font-semibold">
                                                    {reviews.length > 0 
                                                        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                                                        : 'New'
                                                    }
                                                </span>
                                                <span className="text-blue-200">({reviews.length} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Car Specifications */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                                    <Car className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Category</p>
                                                    <p className="text-white font-semibold">{car.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-500/20 p-2 rounded-lg">
                                                    <Calendar className="w-5 h-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Year</p>
                                                    <p className="text-white font-semibold">{car.year}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-purple-500/20 p-2 rounded-lg">
                                                    <Users className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Seats</p>
                                                    <p className="text-white font-semibold">{car.seats}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-red-500/20 p-2 rounded-lg">
                                                    <Palette className="w-5 h-5 text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Color</p>
                                                    <p className="text-white font-semibold">{car.color}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-orange-500/20 p-2 rounded-lg">
                                                    <Fuel className="w-5 h-5 text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Fuel Type</p>
                                                    <p className="text-white font-semibold">{car.fuelType}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-indigo-500/20 p-2 rounded-lg">
                                                    <Settings className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm">Transmission</p>
                                                    <p className="text-white font-semibold">{car.transmission}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Section - Takes 1 column */}
                        <div className="xl:col-span-1">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden sticky top-4">
                                {/* Booking Header */}
                                <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-6 border-b border-white/10">
                                    <h3 className="text-2xl font-semibold text-white flex items-center">
                                        <CreditCard className="w-6 h-6 mr-3" />
                                        Book This Car
                                    </h3>
                                    <p className="text-blue-200 mt-1">Select your rental period</p>
                                </div>

                                <div className="p-6">
                                    {/* Alerts */}
                                    {error && (
                                        <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                                            <div className="flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                                                <span className="text-sm">{error}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {success && !booking && (
                                        <div className="mb-4 bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                                <span className="text-sm">{success}</span>
                                            </div>
                                        </div>
                                    )}

                                    {!booking ? (
                                        <form className="space-y-6" onSubmit={handleCreateBooking}>
                                            {/* Date Selection */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={e => setStartDate(e.target.value)}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Start Time
                                                        </label>
                                                        <input
                                                            type="time"
                                                            value={startTime}
                                                            onChange={e => setStartTime(e.target.value)}
                                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={e => setEndDate(e.target.value)}
                                                            min={startDate || new Date().toISOString().split('T')[0]}
                                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="flex items-center text-sm font-medium text-blue-200 mb-2">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            End Time
                                                        </label>
                                                        <input
                                                            type="time"
                                                            value={endTime}
                                                            onChange={e => setEndTime(e.target.value)}
                                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Availability Status */}
                                            {(startDate && endDate && startTime && endTime) && (
                                                (() => {
                                                    const statusConfig = getAvailabilityStatus();
                                                    const StatusIcon = statusConfig.icon;
                                                    return (
                                                        <div className={`p-4 rounded-xl border ${statusConfig.bgColor} border-white/20`}>
                                                            <div className="flex items-center space-x-3">
                                                                <StatusIcon className={`w-5 h-5 ${statusConfig.color} ${checkingAvailability ? 'animate-spin' : ''}`} />
                                                                <div>
                                                                    <p className={`font-semibold ${statusConfig.color}`}>
                                                                        {statusConfig.text}
                                                                    </p>
                                                                    {calculateDays() > 0 && (
                                                                        <p className="text-blue-200 text-sm">
                                                                            {calculateDays()} day(s) • Total: ${getTotalPrice()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()
                                            )}

                                            {/* Book Button */}
                                            <button 
                                                type="submit"
                                                disabled={!isAvailable || checkingAvailability || !isLoggedIn}
                                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                                                    !isAvailable || checkingAvailability || !isLoggedIn
                                                        ? 'bg-slate-600 cursor-not-allowed' 
                                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                                                }`}
                                            >
                                                {!isLoggedIn ? 'Login Required' : 
                                                 checkingAvailability ? 'Checking Availability...' : 
                                                 !isAvailable ? 'Unavailable for Selected Dates' : 
                                                 'Create Booking & Pay'}
                                            </button>

                                            {!isLoggedIn && (
                                                <p className="text-center text-blue-200 text-sm mt-2">
                                                    <button
                                                        onClick={() => navigate('/login')}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors underline"
                                                    >
                                                        Sign in to book this car
                                                    </button>
                                                </p>
                                            )}
                                        </form>
                                    ) : (
                                        /* Payment Section */
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-xl border border-white/20">
                                                <h4 className="font-semibold text-white mb-2 flex items-center">
                                                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                                                    Booking Created Successfully
                                                </h4>
                                                <p className="text-2xl font-bold text-green-400">
                                                    Total: ${booking.totalPrice.toFixed(2)}
                                                </p>
                                                <p className="text-blue-200 text-sm mt-1">Complete payment to confirm your booking</p>
                                            </div>

                                            <div className="bg-white/5 p-4 rounded-xl">
                                                <PayPalButtons
                                                    style={{
                                                        layout: "vertical",
                                                        color: "blue",
                                                        shape: "rect",
                                                        label: "paypal"
                                                    }}
                                                    createOrder={async () => (await paymentService.createPaypalOrder(booking.id)).data.orderId}
                                                    onApprove={async (data) => {
                                                        await paymentService.capturePaypalOrder(data.orderID, booking.id);
                                                        setBooking(null);
                                                        setSuccess("Payment successful! Booking confirmed.");
                                                        setTimeout(() => navigate('/my-bookings'), 3000);
                                                    }}
                                                    onError={() => setError("Payment failed. Please try again.")}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-6 border-b border-white/10">
                            <h3 className="text-2xl font-semibold text-white flex items-center">
                                <Star className="w-6 h-6 mr-3" />
                                Customer Reviews
                            </h3>
                            <p className="text-blue-200 mt-1">
                                {reviews.length > 0 
                                    ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''} from our customers`
                                    : 'Be the first to review this car'
                                }
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {isLoggedIn && <AddReview carId={id} onReviewSubmitted={handleReviewSubmitted} />}
                            <ReviewList reviews={reviews} onEdit={handleOpenEditModal} onDelete={handleReviewDeleted} />
                        </div>
                    </div>

                    {reviewToEdit && (
                        <EditReviewModal 
                            show={showEditModal} 
                            onHide={() => setShowEditModal(false)} 
                            review={reviewToEdit} 
                            carId={id} 
                            onReviewUpdated={handleReviewUpdated} 
                        />
                    )}
                </div>
            </div>
        </PayPalScriptProvider>
    );
};

export default CarDetailPage;