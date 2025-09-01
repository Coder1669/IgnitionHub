package com.carrental.dto;

import com.carrental.model.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingDto {
    private Long id;
    private Long carId;
    private UserDto user; // Nested user info for the admin panel
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Double totalPrice;
    private BookingStatus status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }
    public LocalDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}