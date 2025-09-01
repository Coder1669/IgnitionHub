package com.carrental.controller;

import com.carrental.dto.BookingDto;
import com.carrental.dto.BookingRequest;
import com.carrental.dto.BookingUpdateRequest;
import com.carrental.dto.UserDto;
import com.carrental.model.Booking;
import com.carrental.model.User;
import com.carrental.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@RequestBody BookingRequest bookingRequest, Authentication authentication) {
        String userEmail = authentication.getName();
        Booking booking = bookingRequest.toBooking();
        Booking createdBooking = bookingService.createBooking(booking, userEmail);
        // ✅ **FIX:** Return the DTO, not the raw entity
        return ResponseEntity.ok(convertToDto(createdBooking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBooking(id);
        // ✅ **FIX:** Return the DTO
        return ResponseEntity.ok(convertToDto(booking));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingDto>> myBookings(@RequestParam(defaultValue = "all") String scope, Authentication authentication) {
        // This method is already correct
        List<Booking> bookings = bookingService.listBookingsForUser(authentication.getName(), scope);
        List<BookingDto> bookingDtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDto> updateBooking(@PathVariable Long id, @RequestBody BookingUpdateRequest req, Authentication authentication) {
        Booking updatedBooking = bookingService.updateBooking(id, req, authentication.getName());
        // ✅ **FIX:** Return the DTO
        return ResponseEntity.ok(convertToDto(updatedBooking));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        List<Booking> bookings = bookingService.listBookings();
        // ✅ **FIX:** Convert the list to a list of DTOs
        List<BookingDto> bookingDtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        try {
            bookingService.cancelBooking(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/confirm-pickup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDto> confirmPickup(@PathVariable Long id, Authentication authentication) {
        Booking booking = bookingService.confirmPickup(id, authentication.getName());
        // ✅ **FIX:** Return the DTO
        return ResponseEntity.ok(convertToDto(booking));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDto> completeBooking(@PathVariable Long id, Authentication authentication) {
        Booking booking = bookingService.completeBooking(id, authentication.getName());
        // ✅ **FIX:** Return the DTO
        return ResponseEntity.ok(convertToDto(booking));
    }

    // This helper method is correct and used by all other methods now
    private BookingDto convertToDto(Booking booking) {
        User user = booking.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());

        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setCarId(booking.getCar().getId());
        dto.setUser(userDto);
        dto.setStartDateTime(booking.getStartDateTime());
        dto.setEndDateTime(booking.getEndDateTime());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}