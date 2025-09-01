import React, { useState, useEffect } from 'react';
import carService from '../../services/car.service';
import ConfirmationModal from '../../components/ConfirmationModal';
import { 
    Car, 
    Plus, 
    Edit3, 
    Trash2, 
    DollarSign, 
    Settings, 
    AlertTriangle,
    RefreshCw,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    Calendar,
    Fuel,
    Users,
    X
} from "lucide-react";

const ManageCars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCar, setCurrentCar] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingCar, setSavingCar] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [formData, setFormData] = useState({
        brand: '', model: '', pricePerDay: '', imageUrl: '', available: true,
        category: '', transmission: '', fuelType: '', seats: '', color: '', year: '', description: ''
    });

    // State to control the confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        filterCars();
    }, [cars, searchTerm, categoryFilter, availabilityFilter]);

    const loadCars = () => {
        setLoading(true);
        carService.getAllCars()
            .then(res => {
                setCars(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch cars.");
                setLoading(false);
            });
    };

    const filterCars = () => {
        let filtered = cars;
        if (searchTerm) {
            filtered = filtered.filter(car => 
                car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.id.toString().includes(searchTerm)
            );
        }
        if (categoryFilter) {
            filtered = filtered.filter(car => car.category === categoryFilter);
        }
        if (availabilityFilter !== "") {
            filtered = filtered.filter(car => car.available.toString() === availabilityFilter);
        }
        setFilteredCars(filtered);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentCar(null);
        setFormData({
            brand: '', model: '', pricePerDay: '', imageUrl: '', available: true,
            category: '', transmission: '', fuelType: '', seats: '', color: '', year: '', description: ''
        });
    };

    const handleShow = (car = null) => {
        setCurrentCar(car);
        if (car) {
            setFormData(car);
        } else {
            setFormData({
                brand: '', model: '', pricePerDay: '', imageUrl: '', available: true,
                category: '', transmission: '', fuelType: '', seats: '', color: '', year: '', description: ''
            });
        }
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSavingCar(true);
        setError("");
        try {
            const apiCall = currentCar
                ? carService.updateCar(currentCar.id, formData)
                : carService.createCar(formData);

            await apiCall;
            loadCars();
            handleClose();
        } catch (err) {
            setError("Failed to save the car.");
        } finally {
            setSavingCar(false);
        }
    };

    // When the user clicks "Delete", open the modal
    const handleDeleteRequest = (car) => {
        setCarToDelete(car);
        setShowDeleteConfirm(true);
    };

    // If the user confirms in the modal, run the actual delete logic
    const confirmDelete = async () => {
        if (!carToDelete) return;
        
        setDeletingId(carToDelete.id);
        setError("");
        
        try {
            await carService.deleteCar(carToDelete.id);
            loadCars();
            setShowDeleteConfirm(false); // Close the modal on success
        } catch (err) {
            setError(`Failed to delete car #${carToDelete.id}.`);
            setShowDeleteConfirm(false); // Also close on error
        } finally {
            setDeletingId(null);
            setCarToDelete(null);
        }
    };

    const getAvailabilityConfig = (available) => {
        return available ? {
            icon: CheckCircle,
            bgColor: "bg-green-500/20",
            textColor: "text-green-400",
            borderColor: "border-green-500/50",
            label: "Available"
        } : {
            icon: XCircle,
            bgColor: "bg-red-500/20",
            textColor: "text-red-400",
            borderColor: "border-red-500/50",
            label: "Unavailable"
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-blue-200 text-lg font-medium">Loading cars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                        <Car className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{cars.length}</p>
                            <p className="text-blue-200 text-sm">Total Cars</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{cars.filter(c => c.available).length}</p>
                            <p className="text-green-200 text-sm">Available</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl p-4 border border-red-500/30">
                    <div className="flex items-center space-x-3">
                        <XCircle className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">{cars.filter(c => !c.available).length}</p>
                            <p className="text-red-200 text-sm">Unavailable</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center space-x-3">
                        <DollarSign className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                ${Math.round(cars.reduce((acc, car) => acc + (car.pricePerDay || 0), 0) / (cars.length || 1)) || 0}
                            </p>
                            <p className="text-purple-200 text-sm">Avg. Price/Day</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Add Button */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0 xl:space-x-4">
                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Filter Cars</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row flex-wrap gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text" placeholder="Search cars..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full lg:w-48"
                            />
                        </div>
                        <select
                            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" className="bg-slate-800">All Categories</option>
                            <option value="SUV" className="bg-slate-800">SUV</option>
                            <option value="Sedan" className="bg-slate-800">Sedan</option>
                            <option value="Hatchback" className="bg-slate-800">Hatchback</option>
                            <option value="Luxury" className="bg-slate-800">Luxury</option>
                            <option value="Economy" className="bg-slate-800">Economy</option>
                            <option value="Sports Car" className="bg-slate-800">Sports Car</option>
                        </select>
                        <select
                            value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" className="bg-slate-800">All Status</option>
                            <option value="true" className="bg-slate-800">Available</option>
                            <option value="false" className="bg-slate-800">Unavailable</option>
                        </select>
                        <div className="flex space-x-2">
                            <button
                                onClick={loadCars}
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={() => handleShow()}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Car</span>
                            </button>
                        </div>
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
            <div className="hidden xl:block bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-b border-white/20">
                            <tr>
                                <th className="text-left py-4 px-4 font-semibold text-white">Car</th>
                                <th className="text-left py-4 px-4 font-semibold text-white">Details</th>
                                <th className="text-left py-4 px-4 font-semibold text-white">Price/Day</th>
                                <th className="text-left py-4 px-4 font-semibold text-white">Status</th>
                                <th className="text-left py-4 px-4 font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredCars.map((car) => {
                                const availabilityConfig = getAvailabilityConfig(car.available);
                                const StatusIcon = availabilityConfig.icon;
                                return (
                                    <tr key={car.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0"><Car className="w-6 h-6 text-white" /></div>
                                                <div><p className="text-white font-semibold">{car.brand} {car.model}</p><p className="text-blue-300 text-sm font-mono">#{car.id}</p></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm"><span className="text-slate-400">Category:</span><span className="text-white">{car.category || 'N/A'}</span></div>
                                                <div className="flex items-center space-x-2 text-sm"><span className="text-slate-400">Year:</span><span className="text-white">{car.year || 'N/A'}</span></div>
                                                <div className="flex items-center space-x-2 text-sm"><span className="text-slate-400">Seats:</span><span className="text-white">{car.seats || 'N/A'}</span></div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4"><div className="flex items-center space-x-1"><DollarSign className="w-4 h-4 text-green-400" /><span className="text-green-400 font-bold text-lg">{car.pricePerDay}</span></div></td>
                                        <td className="py-4 px-4"><div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${availabilityConfig.bgColor} ${availabilityConfig.textColor} ${availabilityConfig.borderColor}`}><StatusIcon className="w-4 h-4" /><span className="text-sm font-medium">{availabilityConfig.label}</span></div></td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleShow(car)} className="inline-flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"><Edit3 className="w-4 h-4" /><span>Edit</span></button>
                                                <button onClick={() => handleDeleteRequest(car)} disabled={deletingId === car.id} className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
                                                    {deletingId === car.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}<span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="xl:hidden space-y-4">
                {filteredCars.map((car) => {
                    const availabilityConfig = getAvailabilityConfig(car.available);
                    const StatusIcon = availabilityConfig.icon;
                    return (
                        <div key={car.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 p-4 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"><Car className="w-5 h-5 text-white" /></div>
                                        <div><h3 className="text-lg font-semibold text-white">{car.brand} {car.model}</h3><p className="text-blue-300 text-sm font-mono">#{car.id}</p></div>
                                    </div>
                                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${availabilityConfig.bgColor} ${availabilityConfig.textColor} ${availabilityConfig.borderColor}`}><StatusIcon className="w-4 h-4" /><span className="text-sm font-medium">{availabilityConfig.label}</span></div>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2"><div className="bg-indigo-500/20 p-2 rounded-lg"><Settings className="w-4 h-4 text-indigo-400" /></div><div><p className="text-xs text-blue-200">Category</p><p className="text-white text-sm font-medium">{car.category || "N/A"}</p></div></div>
                                    <div className="flex items-center space-x-2"><div className="bg-orange-500/20 p-2 rounded-lg"><Calendar className="w-4 h-4 text-orange-400" /></div><div><p className="text-xs text-blue-200">Year</p><p className="text-white text-sm font-medium">{car.year || "N/A"}</p></div></div>
                                    <div className="flex items-center space-x-2"><div className="bg-green-500/20 p-2 rounded-lg"><Fuel className="w-4 h-4 text-green-400" /></div><div><p className="text-xs text-blue-200">Fuel</p><p className="text-white text-sm font-medium">{car.fuelType || "N/A"}</p></div></div>
                                    <div className="flex items-center space-x-2"><div className="bg-purple-500/20 p-2 rounded-lg"><Users className="w-4 h-4 text-purple-400" /></div><div><p className="text-xs text-blue-200">Seats</p><p className="text-white text-sm font-medium">{car.seats || "N/A"}</p></div></div>
                                </div>
                                <div className="flex items-center space-x-3"><div className="bg-green-500/20 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div><div><p className="text-sm text-blue-200">Price per Day</p><p className="text-green-400 font-bold text-xl">${car.pricePerDay}</p></div></div>
                                <div className="pt-4 border-t border-white/10 flex space-x-2">
                                    <button onClick={() => handleShow(car)} className="flex-1 inline-flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"><Edit3 className="w-4 h-4" /><span>Edit</span></button>
                                    <button onClick={() => handleDeleteRequest(car)} disabled={deletingId === car.id} className="flex-1 inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
                                        {deletingId === car.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}<span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl"><Car className="w-6 h-6 text-white" /></div>
                                <div><h2 className="text-2xl font-bold text-white">{currentCar ? 'Edit Car' : 'Add New Car'}</h2><p className="text-blue-200 text-sm">{currentCar ? 'Update vehicle information' : 'Add a new vehicle to the fleet'}</p></div>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g., Toyota" /></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Model</label><input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g., Camry" /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-blue-200 mb-2">Image URL</label><input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="https://example.com/car-image.jpg" /></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"><option value="" className="bg-slate-800">Select Category</option><option value="SUV" className="bg-slate-800">SUV</option><option value="Sedan" className="bg-slate-800">Sedan</option><option value="Hatchback" className="bg-slate-800">Hatchback</option><option value="Luxury" className="bg-slate-800">Luxury</option><option value="Economy" className="bg-slate-800">Economy</option><option value="Sports Car" className="bg-slate-800">Sports Car</option></select></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Transmission</label><select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"><option value="" className="bg-slate-800">Select Transmission</option><option value="Automatic" className="bg-slate-800">Automatic</option><option value="Manual" className="bg-slate-800">Manual</option></select></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Fuel Type</label><select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"><option value="" className="bg-slate-800">Select Fuel</option><option value="Petrol" className="bg-slate-800">Petrol</option><option value="Diesel" className="bg-slate-800">Diesel</option><option value="Electric" className="bg-slate-800">Electric</option><option value="Hybrid" className="bg-slate-800">Hybrid</option></select></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Year</label><input type="number" name="year" value={formData.year} onChange={handleChange} min="1990" max="2030" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="2024" /></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Seats</label><input type="number" name="seats" value={formData.seats} onChange={handleChange} min="2" max="8" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="4" /></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Color</label><input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="White" /></div>
                                    <div><label className="block text-sm font-medium text-blue-200 mb-2">Price Per Day</label><input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="50.00" /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-blue-200 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="Brief description of the car..."></textarea></div>
                                <div className="flex items-center space-x-3"><input type="checkbox" name="available" id="available" checked={formData.available} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2" /><label htmlFor="available" className="text-white font-medium">Available for Rent</label></div>
                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-white/20">
                                    <button type="button" onClick={handleClose} className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                                    <button type="submit" disabled={savingCar} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                                        {savingCar ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>Saving...</span></>) : (<span>{currentCar ? 'Update Car' : 'Add Car'}</span>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                body={`Are you sure you want to permanently delete the ${carToDelete?.brand} ${carToDelete?.model}? This action cannot be undone.`}
                confirmText="Delete Car"
                type="danger"
                isLoading={deletingId !== null}
            />

            {filteredCars.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-md mx-auto">
                        <Car className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-white mb-4">No Cars Found</h3>
                        <p className="text-blue-200 mb-6">{searchTerm || categoryFilter || availabilityFilter ? "No cars match your current filters." : "No cars have been added to the fleet yet."}</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                            {(searchTerm || categoryFilter || availabilityFilter) && (
                                <button onClick={() => { setSearchTerm(""); setCategoryFilter(""); setAvailabilityFilter(""); }} className="inline-flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"><RefreshCw className="w-5 h-5" /><span>Clear Filters</span></button>
                            )}
                            <button onClick={() => handleShow()} className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"><Plus className="w-5 h-5" /><span>Add First Car</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCars;