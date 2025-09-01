import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/car.service';
import userService from '../services/user.service';

const HomePage = () => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        transmission: '',
        fuelType: '',
        seats: '',
        year: '',
        sort: ''
    });

    useEffect(() => {
        fetchAllCars();
        const token = localStorage.getItem('accessToken');
        if (token) {
            userService.getCurrentUser()
                .then(response => {
                    setCurrentUser(response.data);
                })
                .catch(error => {
                    console.error("Could not fetch current user:", error);
                });
        }
    }, []);

    const fetchAllCars = () => {
        setError('');
        setIsLoading(true);
        carService.getAllCars()
            .then(response => {
                setCars(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching cars:", error);
                setError("Could not load cars. Please try again later.");
                setIsLoading(false);
            });
    };
    
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const apiFilters = {
            ...filters,
            minSeats: filters.seats,
            maxSeats: filters.seats,
            minYear: filters.year,
            maxYear: filters.year
        };
        delete apiFilters.seats;
        delete apiFilters.year;

        carService.filterCars(apiFilters)
            .then(response => {
                setCars(response.data.content || []);
                if (response.data.content && response.data.content.length === 0) {
                    setError("No cars match the selected filters.");
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error filtering cars:", error);
                setError("An error occurred while filtering.");
                setIsLoading(false);
            });
    };

    const handleClearFilters = () => {
        setFilters({
            brand: '', category: '', transmission: '', fuelType: '',
            seats: '', year: '', sort: ''
        });
        fetchAllCars();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header Section */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {currentUser && (
                        <div className="text-center mb-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                Welcome back, <span className="text-blue-400">{currentUser.name}!</span>
                            </h1>
                            <p className="text-blue-200 text-lg">Find your perfect ride</p>
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-white text-center">
                        Premium Car Rental
                    </h2>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl sticky top-4">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                </svg>
                                Filters & Search
                            </h3>
                            
                            <form onSubmit={handleApplyFilters} className="space-y-4">
                                {/* Search by Brand/Model */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Search Brand/Model
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        placeholder="e.g., Toyota, BMW"
                                        value={filters.brand}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    />
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Sort by Price
                                    </label>
                                    <select
                                        name="sort"
                                        value={filters.sort}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="" className="bg-slate-800">Default</option>
                                        <option value="pricePerDay,asc" className="bg-slate-800">Low to High</option>
                                        <option value="pricePerDay,desc" className="bg-slate-800">High to Low</option>
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="" className="bg-slate-800">All Categories</option>
                                        <option value="SUV" className="bg-slate-800">SUV</option>
                                        <option value="Sedan" className="bg-slate-800">Sedan</option>
                                        <option value="Hatchback" className="bg-slate-800">Hatchback</option>
                                        <option value="Luxury" className="bg-slate-800">Luxury</option>
                                        <option value="Sports" className="bg-slate-800">Sports</option>
                                    </select>
                                </div>

                                {/* Transmission */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Transmission
                                    </label>
                                    <select
                                        name="transmission"
                                        value={filters.transmission}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="" className="bg-slate-800">All Types</option>
                                        <option value="Manual" className="bg-slate-800">Manual</option>
                                        <option value="Automatic" className="bg-slate-800">Automatic</option>
                                        <option value="CVT" className="bg-slate-800">CVT</option>
                                    </select>
                                </div>

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Fuel Type
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={filters.fuelType}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    >
                                        <option value="" className="bg-slate-800">All Fuel Types</option>
                                        <option value="Petrol" className="bg-slate-800">Petrol</option>
                                        <option value="Diesel" className="bg-slate-800">Diesel</option>
                                        <option value="Electric" className="bg-slate-800">Electric</option>
                                        <option value="Hybrid" className="bg-slate-800">Hybrid</option>
                                    </select>
                                </div>

                                {/* Seats and Year */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">
                                            Seats
                                        </label>
                                        <input
                                            type="number"
                                            name="seats"
                                            placeholder="e.g., 5"
                                            value={filters.seats}
                                            onChange={handleFilterChange}
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-2">
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            name="year"
                                            placeholder="e.g., 2023"
                                            value={filters.year}
                                            onChange={handleFilterChange}
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg border border-white/20 transition-all duration-200 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Page Title */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Available Cars
                            </h2>
                            <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full"></div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                                    <p className="text-blue-200 text-lg">Loading amazing cars...</p>
                                </div>
                            </div>
                        ) : (
                            /* Car Grid - Equal Height Cards */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                                {cars && cars.length > 0 ? (
                                    cars.map(car => (
                                        <div key={car.id} className="group h-full">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/15 h-full flex flex-col">
                                                {/* Car Image - Fixed Height */}
                                                <div className="relative overflow-hidden h-48 flex-shrink-0">
                                                    <img 
                                                        src={car.imageUrl || 'https://via.placeholder.com/400x240/1e293b/64748b?text=Car+Image'} 
                                                        alt={`${car.brand} ${car.model}`}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>

                                                {/* Car Details - Flexible Content */}
                                                <div className="p-6 flex flex-col flex-grow">
                                                    {/* Car Title - Fixed Height */}
                                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200 min-h-[3.5rem] flex items-center leading-tight">
                                                        {car.brand} {car.model}
                                                    </h3>
                                                    
                                                    {/* Car Specs - Fixed Height Grid */}
                                                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-blue-200 min-h-[5rem] content-start">
                                                        {car.category && (
                                                            <span className="flex items-center mb-1">
                                                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                <span className="truncate">{car.category}</span>
                                                            </span>
                                                        )}
                                                        {car.transmission && (
                                                            <span className="flex items-center mb-1">
                                                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="truncate">{car.transmission}</span>
                                                            </span>
                                                        )}
                                                        {car.fuelType && (
                                                            <span className="flex items-center mb-1">
                                                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                </svg>
                                                                <span className="truncate">{car.fuelType}</span>
                                                            </span>
                                                        )}
                                                        {car.seats && (
                                                            <span className="flex items-center mb-1">
                                                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                                <span className="truncate">{car.seats} seats</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Spacer to push content to bottom */}
                                                    <div className="flex-grow"></div>

                                                    {/* Price Section - Fixed Height */}
                                                    <div className="flex items-center justify-between mb-4 min-h-[2.5rem]">
                                                        <div className="text-2xl font-bold text-blue-400">
                                                            ${car.pricePerDay}
                                                            <span className="text-sm text-blue-200 font-normal">/day</span>
                                                        </div>
                                                        {car.year && (
                                                            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                                                {car.year}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Book Button - Fixed at Bottom */}
                                                    <Link
                                                        to={`/cars/${car.id}`}
                                                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 no-underline"
                                                    >
                                                        View Details & Book
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    !isLoading && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                                <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <h3 className="text-xl font-semibold text-white mb-2">No Cars Found</h3>
                                                <p className="text-blue-200">Try adjusting your filters to find more options.</p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;