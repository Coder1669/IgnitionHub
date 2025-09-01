// src/main/java/com/carrental/repository/ReviewRepository.java
package com.carrental.repository;

import com.carrental.model.Review;
import com.carrental.model.Car;
import com.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCar_IdOrderByCreatedAtDesc(Long carId);
    Optional<Review> findByCarAndUser(Car car, User user);
    long countByCar_Id(Long carId);

     // ADD THIS METHOD
    Optional<Review> findByIdAndCar_Id(Long reviewId, Long carId);
}
