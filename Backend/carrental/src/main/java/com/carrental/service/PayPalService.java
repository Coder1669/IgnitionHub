package com.carrental.service;

import com.carrental.model.Booking;
import com.carrental.model.BookingStatus;
import com.carrental.repository.BookingRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class PayPalService {

    @Value("${paypal.api.base-url}")
    private String baseUrl;
    @Value("${paypal.api.client-id}")
    private String clientId;
    @Value("${paypal.api.client-secret}")
    private String clientSecret;

    @Autowired
    private BookingRepository bookingRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // Step 1: Get an Access Token from PayPal
    private String getAccessToken() {
        String authUrl = baseUrl + "/v1/oauth2/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");

       HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(authUrl, entity, String.class);
        JSONObject jsonResponse = new JSONObject(response.getBody());
        return jsonResponse.getString("access_token");
    }

    // Step 2: Create an Order
    public JSONObject createOrder(Long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalStateException("Booking not found"));

        String accessToken = getAccessToken();
        String createOrderUrl = baseUrl + "/v2/checkout/orders";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        String requestBody = String.format(
            "{\"intent\":\"CAPTURE\",\"purchase_units\":[{\"amount\":{\"currency_code\":\"USD\",\"value\":\"%.2f\"}}]}",
            booking.getTotalPrice()
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(createOrderUrl, entity, String.class);

        return new JSONObject(response.getBody());
    }

    // Step 3: Capture the Order
    @Transactional
    public JSONObject captureOrder(String orderId, Long bookingId) throws Exception {
        String accessToken = getAccessToken();
        String captureUrl = baseUrl + "/v2/checkout/orders/" + orderId + "/capture";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(captureUrl, entity, String.class);

        JSONObject jsonResponse = new JSONObject(response.getBody());

        // If capture is successful, update booking status
        if ("COMPLETED".equals(jsonResponse.getString("status"))) {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalStateException("Booking not found"));
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return jsonResponse;
    }
}