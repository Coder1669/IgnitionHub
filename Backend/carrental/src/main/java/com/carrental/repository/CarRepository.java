// src/main/java/com/carrental/repository/CarRepository.java
package com.carrental.repository;

import com.carrental.model.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List; // ✅ 1. ADD THIS IMPORT

// ✅ 2. ADD THIS NEW METHOD
/**
 * Finds cars where the brand or model contains the given query string, ignoring
 * case.
 * 
 * @param brand The search term for the brand.
 * @param model The search term for the model.
 * @return A list of matching cars.
 */

public interface CarRepository extends JpaRepository<Car, Long> {

       List<Car> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(String brand, String model);

       // ✅ MODIFY THIS QUERY
       @Query("SELECT c FROM Car c WHERE " +
       // This line now searches the 'brand' parameter against both brand and model
       // columns
                     "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%')) OR LOWER(c.model) LIKE LOWER(CONCAT('%', :brand, '%'))) AND "
                     +
                     "(:category IS NULL OR LOWER(c.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
                     "(:fuelType IS NULL OR LOWER(c.fuelType) LIKE LOWER(CONCAT('%', :fuelType, '%'))) AND " +
                     "(:transmission IS NULL OR LOWER(c.transmission) LIKE LOWER(CONCAT('%', :transmission, '%'))) AND "
                     +
                     "(:available IS NULL OR c.available = :available) AND " +
                     "(:minPrice IS NULL OR c.pricePerDay >= :minPrice) AND " +
                     "(:maxPrice IS NULL OR c.pricePerDay <= :maxPrice) AND " +
                     "(:minSeats IS NULL OR c.seats >= :minSeats) AND " +
                     "(:maxSeats IS NULL OR c.seats <= :maxSeats) AND " +
                     "(:minYear IS NULL OR c.year >= :minYear) AND " +
                     "(:maxYear IS NULL OR c.year <= :maxYear)")
       Page<Car> findCarsWithFilters(
                     @Param("brand") String brand,
                     @Param("category") String category,
                     @Param("fuelType") String fuelType,
                     @Param("transmission") String transmission,
                     @Param("available") Boolean available,
                     @Param("minPrice") Double minPrice,
                     @Param("maxPrice") Double maxPrice,
                     @Param("minSeats") Integer minSeats,
                     @Param("maxSeats") Integer maxSeats,
                     @Param("minYear") Integer minYear,
                     @Param("maxYear") Integer maxYear,
                     Pageable pageable);

}
