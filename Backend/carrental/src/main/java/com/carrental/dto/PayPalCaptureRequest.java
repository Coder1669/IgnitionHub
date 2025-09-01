package com.carrental.dto;

// Used to receive the order ID from the frontend for capturing
public class PayPalCaptureRequest {
    private String orderId;
    private Long bookingId;

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
}