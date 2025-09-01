import React, { useState, useEffect } from "react";
import bookingService from "../../services/booking.service";
import { 
    Calendar, 
    Car, 
    User, 
    DollarSign, 
    CheckCircle, 
    XCircle, 
    Clock, 
    AlertTriangle,
    Eye,
    RefreshCw,
    Filter,
    Search
} from "lucide-react";

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [bookings, searchTerm, statusFilter]);

    const loadBookings = () => {
        setLoading(true);
        bookingService
            .getAllBookings()
            .then((response) => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch bookings.");
                setLoading(false);
            });
    };

    const filterBookings = () => {
        let filtered = bookings;
        
        if (searchTerm) {
            filtered = filtered.filter(booking => 
                booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.id.toString().includes(searchTerm) ||
                booking.carId.toString().includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }
        
        setFilteredBookings(filtered);
    };

    const handleStatusChange = async (action, bookingId) => {
        setUpdatingId(bookingId);
        setError("");
        
        try {
            const apiCall = action === "confirm"
                ? bookingService.confirmPickup(bookingId)
                : bookingService.completeBooking(bookingId);

            const response = await apiCall;
            const updatedBooking = response.data;
            setBookings((prev) =>
                prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
            );
        } catch (err) {
            setError(`Failed to update booking #${bookingId}.`);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "CONFIRMED":
                return {
                    icon: CheckCircle,
                    bgColor: "bg-blue-500/20",
                    textColor: "text-blue-400",
                    borderColor: "border-blue-500/50"
                };
            case "IN_PROGRESS":
                return {
                    icon: Clock,
                    bgColor: "bg-yellow-500/20",
                    textColor: "text-yellow-400",
                    borderColor: "border-yellow-500/50"
                };
            case "COMPLETED":
                return {
                    icon: CheckCircle,
                    bgColor: "bg-green-500/20",
                    textColor: "text-green-400",
                    borderColor: "border-green-500/50"
                };
            case "CANCELLED":
                return {
                    icon: XCircle,
                    bgColor: "bg-red-500/20",
                    textColor: "text-red-400",
                    borderColor: "border-red-500/50"
                };
            case "PENDING":
                return {
                    icon: Clock,
                    bgColor: "bg-purple-500/20",
                    textColor: "text-purple-400",
                    borderColor: "border-purple-500/50"
                };
            default:
                return {
                    icon: AlertTriangle,
                    bgColor: "bg-gray-500/20",
                    textColor: "text-gray-400",
                    borderColor: "border-gray-500/50"
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
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{bookings.length}</p>
                            <p className="text-blue-200 text-sm">Total Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {bookings.filter(b => b.status === 'COMPLETED').length}
                            </p>
                            <p className="text-green-200 text-sm">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-8 h-8 text-yellow-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length}
                            </p>
                            <p className="text-yellow-200 text-sm">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl p-4 border border-red-500/30">
                    <div className="flex items-center space-x-3">
                        <XCircle className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {bookings.filter(b => b.status === 'CANCELLED').length}
                            </p>
                            <p className="text-red-200 text-sm">Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Filter Bookings</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by email, booking ID, or car ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
                            />
                        </div>
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" className="bg-slate-800">All Statuses</option>
                            <option value="PENDING" className="bg-slate-800">Pending</option>
                            <option value="CONFIRMED" className="bg-slate-800">Confirmed</option>
                            <option value="IN_PROGRESS" className="bg-slate-800">In Progress</option>
                            <option value="COMPLETED" className="bg-slate-800">Completed</option>
                            <option value="CANCELLED" className="bg-slate-800">Cancelled</option>
                        </select>
                        <button
                            onClick={loadBookings}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-white/20">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-white">ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">User</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Car</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Start Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">End Date</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Total</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredBookings.map((booking) => {
                                const statusConfig = getStatusConfig(booking.status);
                                const StatusIcon = statusConfig.icon;
                                
                                return (
                                    <tr key={booking.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="py-4 px-6">
                                            <span className="text-blue-300 font-mono font-semibold">#{booking.id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">{booking.user?.email || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                <Car className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">Car #{booking.carId}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-white text-sm">
                                            {formatDateTime(booking.startDateTime)}
                                        </td>
                                        <td className="py-4 px-6 text-white text-sm">
                                            {formatDateTime(booking.endDateTime)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-1">
                                                <DollarSign className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400 font-semibold">
                                                    {booking.totalPrice?.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{booking.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex space-x-2">
                                                {booking.status === "CONFIRMED" && (
                                                    <button
                                                        onClick={() => handleStatusChange("confirm", booking.id)}
                                                        disabled={updatingId === booking.id}
                                                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingId === booking.id ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                        <span>Confirm Pickup</span>
                                                    </button>
                                                )}
                                                {booking.status === "IN_PROGRESS" && (
                                                    <button
                                                        onClick={() => handleStatusChange("complete", booking.id)}
                                                        disabled={updatingId === booking.id}
                                                        className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingId === booking.id ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                        <span>Complete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                        <div key={booking.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 p-4 border-b border-white/10">
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
                                {/* User Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-500/20 p-2 rounded-lg">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-200">Customer</p>
                                        <p className="text-white font-medium">{booking.user?.email || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Car Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-500/20 p-2 rounded-lg">
                                        <Car className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-200">Vehicle</p>
                                        <p className="text-white font-medium">Car #{booking.carId}</p>
                                    </div>
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500/20 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-200">Start</p>
                                            <p className="text-white font-medium text-sm">
                                                {formatDateTime(booking.startDateTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-red-500/20 p-2 rounded-lg">
                                            <Calendar className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-200">End</p>
                                            <p className="text-white font-medium text-sm">
                                                {formatDateTime(booking.endDateTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-500/20 p-2 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-200">Total Amount</p>
                                        <p className="text-green-400 font-bold text-lg">${booking.totalPrice?.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {(booking.status === "CONFIRMED" || booking.status === "IN_PROGRESS") && (
                                    <div className="pt-4 border-t border-white/10">
                                        {booking.status === "CONFIRMED" && (
                                            <button
                                                onClick={() => handleStatusChange("confirm", booking.id)}
                                                disabled={updatingId === booking.id}
                                                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                            >
                                                {updatingId === booking.id ? (
                                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                                <span>Confirm Pickup</span>
                                            </button>
                                        )}
                                        {booking.status === "IN_PROGRESS" && (
                                            <button
                                                onClick={() => handleStatusChange("complete", booking.id)}
                                                disabled={updatingId === booking.id}
                                                className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                            >
                                                {updatingId === booking.id ? (
                                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5" />
                                                )}
                                                <span>Mark Complete</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
                        <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-white mb-4">No Bookings Found</h3>
                        <p className="text-blue-200 mb-6">
                            {searchTerm || statusFilter 
                                ? "No bookings match your current filters." 
                                : "No bookings have been made yet."
                            }
                        </p>
                        {(searchTerm || statusFilter) && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("");
                                }}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Clear Filters</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;