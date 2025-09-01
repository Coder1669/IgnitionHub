// Fixed CarController.java
package com.carrental.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import com.carrental.model.Car;
import com.carrental.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat; // ✅ ADD THIS IMPORT
import java.time.LocalDateTime; // ✅ ADD THIS IMPORT
import java.util.Map; // ✅ ADD THIS IMPORT

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cars") // Changed from "/car" to "/cars" for REST convention
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    @Autowired
    private CarService carService;

    // Health check
    @GetMapping("/test")
    public String testAPI() {
        return "Car API is working!";
    }

    // Get all cars (without pagination)
    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    // Get single car by ID
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Optional<Car> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADD THIS NEW ENDPOINT FOR THE SEARCH BAR
    @GetMapping("/search-basic")
    public ResponseEntity<List<Car>> searchCarsBasic(@RequestParam String query) {
        try {
            List<Car> cars = carService.searchCarsByQuery(query);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            // Log the exception in a real application
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ ADD THIS NEW ENDPOINT
    @GetMapping("/{id}/is-available")
    public ResponseEntity<Map<String, Boolean>> isCarAvailable(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime) {

        boolean isAvailable = carService.isCarAvailable(id, startDateTime, endDateTime);
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }

    // Enhanced search with multiple filters
    // src/main/java/com/carrental/controller/CarController.java (search endpoint)
    @GetMapping("/search")
    public Page<Car> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minSeats,
            @RequestParam(required = false) Integer maxSeats,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort // e.g. pricePerDay,asc
    ) {
        String[] sortParts = sort.split(",");
        Pageable pageable = org.springframework.data.domain.PageRequest.of(
                page, size,
                (sortParts.length == 2 && "desc".equalsIgnoreCase(sortParts[1]))
                        ? org.springframework.data.domain.Sort.by(sortParts[0]).descending()
                        : org.springframework.data.domain.Sort.by(sortParts[0]).ascending());
        return carService.searchCars(brand, category, fuelType, transmission, available,
                minPrice, maxPrice, minSeats, maxSeats, minYear, maxYear, pageable);
    }

    // Create new car (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        try {
            Car savedCar = carService.saveCar(car);
            return ResponseEntity.ok(savedCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update car completely (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car updatedCar) {
        try {
            Car car = carService.updateCar(id, updatedCar);
            return ResponseEntity.ok(car);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Partial update (Admin only)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> patchCar(@PathVariable Long id, @RequestBody Car carUpdates) {
        try {
            Car car = carService.patchCar(id, carUpdates);
            return ResponseEntity.ok(car);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete car (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get available cars only
    // Get available cars only
    @GetMapping("/available")
    public ResponseEntity<Page<Car>> getAvailableCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        String[] sortParts = sort.split(",");
        Pageable pageable = PageRequest.of(
                page, size,
                (sortParts.length == 2 && "desc".equalsIgnoreCase(sortParts[1]))
                        ? org.springframework.data.domain.Sort.by(sortParts[0]).descending()
                        : org.springframework.data.domain.Sort.by(sortParts[0]).ascending());

        Page<Car> availableCars = carService.searchCars(
                null, // brand
                null, // category
                null, // fuelType
                null, // transmission
                true, // available
                null, // minPrice
                null, // maxPrice
                null, // minSeats
                null, // maxSeats
                null, // minYear
                null, // maxYear
                pageable);

        return ResponseEntity.ok(availableCars);
    }

}