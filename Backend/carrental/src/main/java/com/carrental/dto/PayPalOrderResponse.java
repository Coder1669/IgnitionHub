package com.carrental.dto;

// Used to send the order ID to the frontend
public class PayPalOrderResponse {
    private String orderId;

    public PayPalOrderResponse(String orderId) {
        this.orderId = orderId;
    }
    
    // Getter and Setter
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
}