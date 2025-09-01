import React, { useState, useEffect } from "react";
import userService from "../../services/user.service";
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Trash2, 
    AlertTriangle,
    RefreshCw,
    Filter,
    Search,
    Users,
    Calendar,
    Shield
} from "lucide-react";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const loadUsers = () => {
        setLoading(true);
        userService
            .getAllUsers()
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not fetch users.");
                setLoading(false);
            });
    };

    const filterUsers = () => {
        let filtered = users;
        
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm) ||
                user.id.toString().includes(searchTerm)
            );
        }
        
        setFilteredUsers(filtered);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            setDeletingId(id);
            setError("");
            
            try {
                await userService.deleteUser(id);
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } catch (err) {
                // ✅ **THE FIX:** Use the error message from the server response.
            const errorMessage = err.response?.data?.error || `Failed to delete user #${id}. Please check for active bookings.`;
                setError(errorMessage);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                            <p className="text-blue-200 text-sm">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {users.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
                            </p>
                            <p className="text-green-200 text-sm">New This Month</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {users.filter(u => u.role === 'ADMIN').length || 1}
                            </p>
                            <p className="text-purple-200 text-sm">Admin Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Search Users</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-80"
                            />
                        </div>
                        <button
                            onClick={loadUsers}
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
                                <th className="text-left py-4 px-6 font-semibold text-white">Name</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Email</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Phone</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Address</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Joined</th>
                                <th className="text-left py-4 px-6 font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-4 px-6">
                                        <span className="text-blue-300 font-mono font-semibold">#{user.id}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-white font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="text-white">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="text-white">{user.phone || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span className="text-white text-sm">{user.address || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-white text-sm">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={deletingId === user.id}
                                            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === user.id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                            <span>Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 p-4 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                        <p className="text-blue-300 text-sm font-mono">#{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-4">
                            {/* Email */}
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Email</p>
                                    <p className="text-white font-medium break-all">{user.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 p-2 rounded-lg">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Phone</p>
                                    <p className="text-white font-medium">{user.phone || "Not provided"}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-500/20 p-2 rounded-lg">
                                    <MapPin className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-blue-200">Address</p>
                                    <p className="text-white font-medium">{user.address || "Not provided"}</p>
                                </div>
                            </div>

                            {/* Join Date */}
                            <div className="flex items-center space-x-3">
                                <div className="bg-yellow-500/20 p-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-200">Joined</p>
                                    <p className="text-white font-medium">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-white/10">
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={deletingId === user.id}
                                    className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    {deletingId === user.id ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    <span>Delete User</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
                        <Users className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-white mb-4">No Users Found</h3>
                        <p className="text-blue-200 mb-6">
                            {searchTerm 
                                ? "No users match your search criteria." 
                                : "No users have registered yet."
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Clear Search</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;