import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) setToken(urlToken);
        else setError('Invalid password reset link.');
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (!token) return;

        try {
            const res = await authService.resetPassword(token, newPassword);
            setMessage(res.data.message + ' Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
                {!token && error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

                {token && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}
                        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

                        <div>
                            <label className="block text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                >
                                    {showNewPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition">
                            Reset Password
                        </button>
                    </form>
                )}

                <p className="text-center text-gray-600 mt-4">
                    <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
