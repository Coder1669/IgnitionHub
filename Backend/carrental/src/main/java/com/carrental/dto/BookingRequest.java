// src/main/java/com/carrental/dto/BookingRequest.java
package com.carrental.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.carrental.model.Booking;
import com.carrental.model.Car;

import java.time.LocalDateTime;

public class BookingRequest {
    private Long carId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDateTime;

    // Getters and setters
    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    // ✅ **FIX:** Updated helper method
    public Booking toBooking() {
        Booking booking = new Booking();
        Car car = new Car();
        car.setId(this.carId); // Create a temporary Car object with the ID
        booking.setCar(car); // Set the Car object on the booking
        booking.setStartDateTime(this.startDateTime);
        booking.setEndDateTime(this.endDateTime);
        return booking;
    }
}