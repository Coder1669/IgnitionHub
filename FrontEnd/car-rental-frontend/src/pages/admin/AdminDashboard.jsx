import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
    Calendar, 
    Car, 
    Users, 
    Shield, 
    Menu, 
    X,
    ChevronRight,
    Settings,
    BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigationItems = [
        {
            path: '/admin/bookings',
            label: 'Manage Bookings',
            icon: Calendar,
            description: 'View and manage all bookings'
        },
        {
            path: '/admin/cars',
            label: 'Manage Cars',
            icon: Car,
            description: 'Add, edit, and manage vehicles'
        },
        {
            path: '/admin/users',
            label: 'Manage Users',
            icon: Users,
            description: 'View and manage user accounts'
        }
    ];

    const isActivePath = (path) => location.pathname.includes(path);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl
                    transform transition-transform duration-300 ease-in-out lg:transform-none
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                                    <p className="text-blue-200 text-sm">Dashboard Control</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6">
                        <div className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActivePath(item.path);
                                
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            group flex items-center justify-between p-4 rounded-xl transition-all duration-200 no-underline
                                            ${active 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg transition-colors ${
                                                active ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
                                            }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{item.label}</p>
                                                <p className={`text-xs ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${
                                            active ? 'rotate-90' : 'group-hover:translate-x-1'
                                        }`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Admin Stats Section */}
                        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center space-x-3 mb-3">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Quick Stats</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-300">
                                    <span>Active Sessions</span>
                                    <span className="text-green-400 font-semibold">24</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                    <span>System Status</span>
                                    <span className="text-green-400 font-semibold">Online</span>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:ml-0">
                    {/* Mobile Header */}
                    <header className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <Shield className="w-6 h-6 text-blue-400" />
                                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                            </div>
                            <div className="w-10"></div> {/* Spacer for balance */}
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-4 lg:p-8">
                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                                    {/* Breadcrumb */}
                                    <div className="flex items-center space-x-2 text-sm text-blue-200 mb-4">
                                        <Shield className="w-4 h-4" />
                                        <span>Admin</span>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="text-white">
                                            {location.pathname.includes('/admin/bookings') && 'Bookings Management'}
                                            {location.pathname.includes('/admin/cars') && 'Cars Management'}
                                            {location.pathname.includes('/admin/users') && 'Users Management'}
                                        </span>
                                    </div>

                                    {/* Current Page Title */}
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                                        {location.pathname.includes('/admin/bookings') && 'Manage Bookings'}
                                        {location.pathname.includes('/admin/cars') && 'Manage Cars'}
                                        {location.pathname.includes('/admin/users') && 'Manage Users'}
                                        {!location.pathname.includes('/admin/bookings') && 
                                         !location.pathname.includes('/admin/cars') && 
                                         !location.pathname.includes('/admin/users') && 'Dashboard Overview'}
                                    </h2>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl min-h-[600px]">
                                <div className="p-6 lg:p-8">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;