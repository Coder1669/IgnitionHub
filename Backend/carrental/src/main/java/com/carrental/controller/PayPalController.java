package com.carrental.controller;

import com.carrental.dto.PayPalCaptureRequest;
import com.carrental.dto.PayPalOrderResponse;
import com.carrental.service.PayPalService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment/paypal")
public class PayPalController {

    @Autowired
    private PayPalService payPalService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Long> request) {
        try {
            Long bookingId = request.get("bookingId");
            JSONObject order = payPalService.createOrder(bookingId);
            return ResponseEntity.ok(new PayPalOrderResponse(order.getString("id")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error creating PayPal order."));
        }
    }

    @PostMapping("/capture-order")
    public ResponseEntity<?> captureOrder(@RequestBody PayPalCaptureRequest captureRequest) {
        try {
            JSONObject response = payPalService.captureOrder(captureRequest.getOrderId(), captureRequest.getBookingId());
            if ("COMPLETED".equals(response.getString("status"))) {
                return ResponseEntity.ok(Map.of("message", "Payment captured successfully! Booking confirmed."));
            }
            return ResponseEntity.status(400).body(Map.of("error", "Failed to capture payment."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error capturing PayPal order."));
        }
    }
}