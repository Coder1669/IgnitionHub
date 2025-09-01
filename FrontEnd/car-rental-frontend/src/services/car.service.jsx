import api from './api';

const getAllCars = () => {
    return api.get('/cars');
};

const getCarById = (id) => {
    return api.get(`/cars/${id}`);
};

const createCar = (carData) => api.post('/cars', carData);

const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);

const deleteCar = (id) => api.delete(`/cars/${id}`);

// ✅ ADD THIS NEW ADVANCED FILTERING FUNCTION
const filterCars = (filters) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    // Loop through the filters object and append them to the params
    // if they have a value. This prevents sending empty parameters.
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            params.append(key, filters[key]);
        }
    });

    // Make the API call with the constructed query string
    return api.get(`/cars/search?${params.toString()}`);
};

// ✅ ADD THIS NEW FUNCTION
const searchCars = (query) => {
  // We use encodeURIComponent to safely handle special characters in the search query
  return api.get(`/cars/search-basic?query=${encodeURIComponent(query)}`);
};

// ✅ ADD THIS NEW FUNCTION
const checkAvailability = (carId, startDateTime, endDateTime) => {
    const params = { startDateTime, endDateTime };
    return api.get(`/cars/${carId}/is-available`, { params });
};


const carService = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar, // ✅ FIX: Add deleteCar to the exported service object
    searchCars, // ✅ EXPORT THE NEW FUNCTION
     filterCars, // ✅ EXPORT THE NEW FUNCTION
     checkAvailability // ✅ EXPORT THE NEW FUNCTION
};

export default carService;