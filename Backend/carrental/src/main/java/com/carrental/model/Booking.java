package com.carrental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime; // 1. Import LocalDateTime

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch for performance
    @JoinColumn(name = "user_id")
    private User user;

    // ✅ **FIX 1:** Replace the simple 'carId' with a proper relationship to the Car
    // entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    // 2. Change LocalDate to LocalDateTime and rename fields
    // Tell JPA to use the 'start_date' column
    @Column(name = "start_date_time", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startDateTime;

    // Tell JPA to use the 'end_date' column
    @Column(name = "end_date_time", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime endDateTime;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    // --- 3. Update Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    // Updated getters and setters for date-time
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

    public Car getCar() {
        return car;
    } // ✅ FIX 2: Add getter/setter for the Car object

    public void setCar(Car car) {
        this.car = car;
    }
}