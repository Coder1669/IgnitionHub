import React, { useState, useEffect } from 'react';
import bookingService from '../services/booking.service';
import { Link } from 'react-router-dom';
import { 
    Calendar, 
    Car, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Eye, 
    X,
    Loader,
    MapPin,
    CreditCard
} from 'lucide-react';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        bookingService.getMyBookings()
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not fetch your bookings.");
                setLoading(false);
            });
    }, []);

    const handleCancel = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            setCancellingId(bookingId);
            bookingService.cancelBooking(bookingId)
                .then(() => {
                    setSuccess(`Booking #${bookingId} cancelled successfully.`);
                    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
                    setCancellingId(null);
                    // Clear success message after 3 seconds
                    setTimeout(() => setSuccess(''), 3000);
                })
                .catch(err => {
                    setError(err.response?.data?.message || "Failed to cancel booking.");
                    setCancellingId(null);
                });
        }
    };

    const isCancellable = (booking) => {
        // ✅ Allow cancellation for both PENDING and CONFIRMED bookings
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
        return false;
    }
    const now = new Date();
    const startTime = new Date(booking.startDateTime);
    // The cutoff is 2 hours BEFORE the booking starts
    const cutoffTime = new Date(startTime.getTime() - 2 * 60 * 60 * 1000); 
    // You can cancel as long as the current time is before the cutoff
    return now < cutoffTime;
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-500/20',
                    textColor: 'text-green-400',
                    borderColor: 'border-green-500/50'
                };
            case 'CANCELLED':
                return {
                    icon: XCircle,
                    bgColor: 'bg-red-500/20',
                    textColor: 'text-red-400',
                    borderColor: 'border-red-500/50'
                };
            case 'PENDING':
                return {
                    icon: Clock,
                    bgColor: 'bg-yellow-500/20',
                    textColor: 'text-yellow-400',
                    borderColor: 'border-yellow-500/50'
                };
            default:
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-gray-500/20',
                    textColor: 'text-gray-400',
                    borderColor: 'border-gray-500/50'
                };
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
                    <p className="text-blue-200 text-lg">Manage your car rental reservations</p>
                    <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full mt-4"></div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm animate-pulse">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Bookings Content */}
                {bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
                            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-white mb-4">No Bookings Yet</h3>
                            <p className="text-blue-200 mb-6">You haven't made any car reservations yet.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 no-underline"
                            >
                                <Car className="w-5 h-5" />
                                <span>Browse Cars</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-b border-white/20">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold text-white">Booking ID</th>
                                            <th className="text-left py-4 px-6 font-semibold text-white">Car Details</th>
                                            <th className="text-left py-4 px-6 font-semibold text-white">Start Date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-white">End Date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {bookings.map(booking => {
                                            const statusConfig = getStatusConfig(booking.status);
                                            const StatusIcon = statusConfig.icon;
                                            
                                            return (
                                                <tr key={booking.id} className="hover:bg-white/5 transition-colors duration-200">
                                                    <td className="py-4 px-6">
                                                        <span className="text-blue-300 font-mono text-sm">#{booking.id}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <Link 
                                                            to={`/cars/${booking.carId}`} 
                                                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors no-underline"
                                                        >
                                                            <Car className="w-4 h-4" />
                                                            <span>Car #{booking.carId}</span>
                                                        </Link>
                                                    </td>
                                                    <td className="py-4 px-6 text-white">
                                                        {formatDateTime(booking.startDateTime)}
                                                    </td>
                                                    <td className="py-4 px-6 text-white">
                                                        {formatDateTime(booking.endDateTime)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{booking.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {isCancellable(booking) && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                disabled={cancellingId === booking.id}
                                                                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                                            >
                                                                {cancellingId === booking.id ? (
                                                                    <>
                                                                        <Loader className="w-4 h-4 animate-spin" />
                                                                        <span>Cancelling...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <X className="w-4 h-4" />
                                                                        <span>Cancel</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {bookings.map(booking => {
                                const statusConfig = getStatusConfig(booking.status);
                                const StatusIcon = statusConfig.icon;
                                
                                return (
                                    <div key={booking.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 border-b border-white/10">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-white">Booking #{booking.id}</h3>
                                                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{booking.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-4 space-y-4">
                                            {/* Car Details */}
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                                    <Car className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-blue-200">Vehicle</p>
                                                    <Link 
                                                        to={`/cars/${booking.carId}`} 
                                                        className="text-white font-medium hover:text-blue-300 transition-colors no-underline flex items-center space-x-1"
                                                    >
                                                        <span>Car #{booking.carId}</span>
                                                        <Eye className="w-4 h-4 ml-1" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Date Range */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-500/20 p-2 rounded-lg">
                                                        <Clock className="w-5 h-5 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-blue-200">Start Date</p>
                                                        <p className="text-white font-medium text-sm">
                                                            {formatDateTime(booking.startDateTime)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-red-500/20 p-2 rounded-lg">
                                                        <Clock className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-blue-200">End Date</p>
                                                        <p className="text-white font-medium text-sm">
                                                            {formatDateTime(booking.endDateTime)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {isCancellable(booking) && (
                                                <div className="pt-2">
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        disabled={cancellingId === booking.id}
                                                        className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                                    >
                                                        {cancellingId === booking.id ? (
                                                            <>
                                                                <Loader className="w-5 h-5 animate-spin" />
                                                                <span>Cancelling Booking...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X className="w-5 h-5" />
                                                                <span>Cancel Booking</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Quick Stats */}
                {bookings.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/20 p-3 rounded-xl">
                                    <Calendar className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{bookings.length}</p>
                                    <p className="text-blue-200 text-sm">Total Bookings</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 p-3 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {bookings.filter(b => b.status === 'COMPLETED').length}
                                    </p>
                                    <p className="text-blue-200 text-sm">Completed</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-500/20 p-3 rounded-xl">
                                    <XCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {bookings.filter(b => b.status === 'CANCELLED').length}
                                    </p>
                                    <p className="text-blue-200 text-sm">Cancelled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;