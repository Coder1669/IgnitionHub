package com.carrental.model;

public enum BookingStatus {
    PENDING,      // Booking created but not yet confirmed (e.g., awaiting payment)
    CONFIRMED,    // Booking is confirmed and scheduled
    IN_PROGRESS,  // Customer has picked up the car
    COMPLETED,    // Customer has returned the car
    CANCELLED     // Booking was cancelled
}