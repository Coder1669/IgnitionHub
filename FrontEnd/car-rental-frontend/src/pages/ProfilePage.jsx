import React, { useState, useEffect } from 'react';
import userService from '../services/user.service';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        userService.getCurrentUser()
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch profile data.");
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        // Only send the fields that can be updated
        const profileData = {
            name: user.name,
            phone: user.phone,
            address: user.address
        };

        userService.updateProfile(profileData)
            .then(response => {
                setSuccess(response.data.message || "Profile updated successfully!");
                setSaving(false);
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            })
            .catch(err => {
                setError(err.response?.data?.error || "An error occurred while updating the profile.");
                setSaving(false);
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-blue-200 text-lg">Manage your account information</p>
                    <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full mt-4"></div>
                </div>

                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
                        <h2 className="text-2xl font-semibold text-white flex items-center">
                            <User className="w-6 h-6 mr-3" />
                            Account Details
                        </h2>
                        <p className="text-blue-200 mt-1">Update your personal information below</p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mx-6 mt-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mx-6 mt-6 bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm animate-pulse">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span>{success}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Email Field (Disabled) */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-blue-200 mb-3">
                                <Mail className="w-4 h-4 mr-2" />
                                Email Address
                                <span className="ml-auto text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">Read Only</span>
                            </label>
                            <input
                                type="email"
                                value={user.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-400 cursor-not-allowed focus:outline-none"
                            />
                            <p className="text-xs text-slate-400 mt-1">Email cannot be changed for security reasons</p>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-blue-200 mb-3">
                                <User className="w-4 h-4 mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={user.name || ''}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-blue-200 mb-3">
                                <Phone className="w-4 h-4 mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={user.phone || ''}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-blue-200 mb-3">
                                <MapPin className="w-4 h-4 mr-2" />
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={user.address || ''}
                                onChange={handleChange}
                                placeholder="Enter your complete address"
                                rows="3"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Additional Info Section */}
                    <div className="px-6 pb-6">
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
                                Account Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <p className="text-slate-400 mb-1">Account Status</p>
                                    <p className="text-green-400 font-semibold flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Active
                                    </p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <p className="text-slate-400 mb-1">Member Since</p>
                                    <p className="text-white font-semibold">
                                        {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                <p className="text-blue-200 text-sm">
                                    <strong>Security Note:</strong> Your email address cannot be changed for security reasons. 
                                    If you need to update your email, please contact support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;