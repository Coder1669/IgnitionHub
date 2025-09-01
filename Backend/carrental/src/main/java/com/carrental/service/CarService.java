// Enhanced CarService.java
package com.carrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import com.carrental.model.Car;
import com.carrental.repository.CarRepository;
import java.util.List; // ✅ 1. ADD THIS IMPORT
import com.carrental.model.Booking; // ✅ ADD THIS IMPORT
import com.carrental.repository.BookingRepository; // ✅ ADD THIS IMPORT
import java.time.LocalDateTime; // ✅ ADD THIS IMPORT

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository; // ✅ INJECT THE BOOKING REPOSITORY

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car saveCar(Car car) {
        // Set default values if not provided
        if (car.getAvailable() == null) {
            car.setAvailable(true);
        }
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new RuntimeException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }

    public Car updateCar(Long id, Car carDetails) {
        return carRepository.findById(id).map(existingCar -> {
            // existingCar.setName(carDetails.getName());
            existingCar.setBrand(carDetails.getBrand());
            existingCar.setModel(carDetails.getModel());
            existingCar.setPricePerDay(carDetails.getPricePerDay());
            existingCar.setAvailable(carDetails.isAvailable());
            existingCar.setImageUrl(carDetails.getImageUrl());
            existingCar.setCategory(carDetails.getCategory());
            existingCar.setTransmission(carDetails.getTransmission());
            existingCar.setFuelType(carDetails.getFuelType());
            existingCar.setSeats(carDetails.getSeats());
            existingCar.setColor(carDetails.getColor());
            existingCar.setYear(carDetails.getYear());
            existingCar.setDescription(carDetails.getDescription());
            return carRepository.save(existingCar);
        }).orElseThrow(() -> new RuntimeException("Car not found with id " + id));
    }

    public Car patchCar(Long id, Car carUpdates) {
        return carRepository.findById(id).map(existingCar -> {
            // if (carUpdates.getName() != null)
            // existingCar.setName(carUpdates.getName());
            if (carUpdates.getBrand() != null)
                existingCar.setBrand(carUpdates.getBrand());
            if (carUpdates.getModel() != null)
                existingCar.setModel(carUpdates.getModel());
            if (carUpdates.getPricePerDay() != null)
                existingCar.setPricePerDay(carUpdates.getPricePerDay());
            if (carUpdates.isAvailable() != null)
                existingCar.setAvailable(carUpdates.isAvailable());
            if (carUpdates.getImageUrl() != null)
                existingCar.setImageUrl(carUpdates.getImageUrl());
            if (carUpdates.getCategory() != null)
                existingCar.setCategory(carUpdates.getCategory());
            if (carUpdates.getTransmission() != null)
                existingCar.setTransmission(carUpdates.getTransmission());
            if (carUpdates.getFuelType() != null)
                existingCar.setFuelType(carUpdates.getFuelType());
            if (carUpdates.getSeats() != null)
                existingCar.setSeats(carUpdates.getSeats());
            if (carUpdates.getColor() != null)
                existingCar.setColor(carUpdates.getColor());
            if (carUpdates.getYear() != null)
                existingCar.setYear(carUpdates.getYear());
            if (carUpdates.getDescription() != null)
                existingCar.setDescription(carUpdates.getDescription());
            return carRepository.save(existingCar);
        }).orElseThrow(() -> new RuntimeException("Car not found with id " + id));
    }

    // ✅ ADD THIS NEW METHOD
    public boolean isCarAvailable(Long carId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(carId, startDateTime,
                endDateTime);
        return overlappingBookings.isEmpty();
    }

    // ✅ 2. ADD THIS NEW METHOD
    public List<Car> searchCarsByQuery(String query) {
        // This will search for the query string in both the brand and model fields.
        return carRepository.findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(query, query);
    }

    // src/main/java/com/carrental/service/CarService.java (method signature change)
    public Page<Car> searchCars(String brand, String category, String fuelType,
            String transmission, Boolean available,
            Double minPrice, Double maxPrice,
            Integer minSeats, Integer maxSeats,
            Integer minYear, Integer maxYear,
            Pageable pageable) {
        return carRepository.findCarsWithFilters(brand, category, fuelType, transmission,
                available, minPrice, maxPrice, minSeats, maxSeats, minYear, maxYear, pageable);
    }

}