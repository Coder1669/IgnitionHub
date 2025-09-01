package com.carrental.service;

import com.carrental.dto.BookingUpdateRequest;
import com.carrental.model.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking, String userEmail) throws IllegalStateException;
    Booking getBooking(Long id);
    void cancelBooking(Long id, String requesterEmail);
    List<Booking> listBookings();
    List<Booking> listBookingsForUser(String userEmail, String scope);
    Booking updateBooking(Long id, BookingUpdateRequest req, String requesterEmail);
    void deleteAllBookings(); 

    // New methods for admin to manage booking lifecycle
    Booking confirmPickup(Long bookingId, String adminEmail);
    Booking completeBooking(Long bookingId, String adminEmail);
}