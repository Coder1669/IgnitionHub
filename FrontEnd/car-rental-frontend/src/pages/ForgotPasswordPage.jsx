import React, { useState } from 'react';
import authService from '../services/auth.service';
import { Link } from 'react-router-dom';
import { 
    Mail, 
    ArrowLeft, 
    Send, 
    AlertCircle,
    CheckCircle,
    Car,
    RefreshCw,
    Shield
} from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(''); 
        setError('');
        
        try {
            const res = await authService.forgotPassword(email);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while sending reset link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            
            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-blue-200 text-sm leading-relaxed">
                            Enter your email address and we'll send you a link to reset your password
                        </p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm mb-6">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium mb-1">Reset Link Sent!</p>
                                    <p className="text-sm">{message}</p>
                                </div>
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Reset Link</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 space-y-4">
                        {/* Help Text */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="text-white font-medium text-sm mb-2">Need help?</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                If you don't receive an email within a few minutes, check your spam folder or contact support.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-slate-900/50 text-slate-300">Remember your password?</span>
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

                {/* Floating Background Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 -right-6 w-12 h-12 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;