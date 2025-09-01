package com.carrental.controller;

import com.carrental.dto.ReviewDto;
import com.carrental.dto.ReviewRequest;
import com.carrental.dto.UserDto;
import com.carrental.model.Car;
import com.carrental.model.Review;
import com.carrental.model.User;
import com.carrental.repository.CarRepository;
import com.carrental.repository.ReviewRepository;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cars/{carId}/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long carId) {
        List<Review> reviews = reviewRepository.findByCar_IdOrderByCreatedAtDesc(carId);
        // ✅ **CHANGE:** Convert entities to DTOs before sending
        List<ReviewDto> reviewDtos = reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewDtos);
    }

    @PostMapping
    public ResponseEntity<?> add(@PathVariable Long carId,
            @RequestBody ReviewRequest req,
            Authentication auth) {
        try {
            if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
            }

            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Car not found"));
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (reviewRepository.findByCarAndUser(car, user).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "You have already reviewed this car"));
            }

            Review review = new Review();
            review.setCar(car);
            review.setUser(user);
            review.setRating(req.getRating());
            review.setComment(req.getComment());

            Review savedReview = reviewRepository.save(review);
            updateCarRatingAggregates(car);

            // ✅ **CHANGE:** Return the newly created review as a DTO
            return ResponseEntity.ok(convertToDto(savedReview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long carId,
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest req,
            Authentication auth) {
        try {
            if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
            }

            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            if (!review.getCar().getId().equals(carId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Review does not belong to this car"));
            }
            if (!review.getUser().getEmail().equals(auth.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "You are not authorized to edit this review"));
            }

            review.setRating(req.getRating());
            review.setComment(req.getComment());
            Review updatedReview = reviewRepository.save(review);
            updateCarRatingAggregates(review.getCar());

            // ✅ **CHANGE:** Return the updated review as a DTO
            return ResponseEntity.ok(convertToDto(updatedReview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long carId,
            @PathVariable Long reviewId,
            Authentication auth) {
        // ... (No changes needed in the delete logic itself)
        // Find the review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Authorization checks
        if (!review.getCar().getId().equals(carId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Review does not belong to this car"));
        }
        if (!review.getUser().getEmail().equals(auth.getName())) {
            return ResponseEntity.status(403).body(Map.of("error", "You are not authorized to delete this review"));
        }

        Car car = review.getCar();
        reviewRepository.delete(review);
        updateCarRatingAggregates(car);

        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }

    // ✅ **NEW:** Helper method to convert Entity to DTO
    private ReviewDto convertToDto(Review review) {
        UserDto userDto = new UserDto();
        userDto.setId(review.getUser().getId());
        userDto.setName(review.getUser().getName());
        userDto.setEmail(review.getUser().getEmail());

        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setId(review.getId());
        reviewDto.setRating(review.getRating());
        reviewDto.setComment(review.getComment());
        reviewDto.setCreatedAt(review.getCreatedAt());
        reviewDto.setUser(userDto);

        return reviewDto;
    }

    private void updateCarRatingAggregates(Car car) {
        List<Review> reviews = reviewRepository.findByCar_IdOrderByCreatedAtDesc(car.getId());
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        car.setRatingCount(reviews.size());
        car.setRatingAverage(average);
        carRepository.save(car);
    }
}