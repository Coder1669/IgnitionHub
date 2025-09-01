import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { 
    User, 
    Mail, 
    Lock, 
    Phone, 
    MapPin, 
    Eye, 
    EyeOff, 
    UserPlus, 
    AlertCircle,
    CheckCircle,
    Car,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '', 
        address: '' 
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        
        try {
            await authService.register(
                formData.name,
                formData.email,
                formData.password,
                formData.phone,
                formData.address
            );
            setMessage('Registration successful! Please check your email to verify your account.');
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            
            <div className="relative w-full max-w-lg">
                {/* Main Registration Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Car className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
                        <p className="text-blue-200">Create your account to get started</p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm mb-6">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{message}</span>
                            </div>
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                    minLength="10"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter 10-digit phone number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Address Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Address <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your full address"
                                    required
                                />
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 space-y-4">
                        {/* Password Requirements */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-white font-medium text-sm mb-2">Password Requirements:</h4>
                            <ul className="text-slate-300 text-xs space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>• Include letters and numbers</li>
                                <li>• Use a unique password</li>
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-slate-900/50 text-slate-300">Already have an account?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border border-white/20"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 -right-8 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

export default RegisterPage;