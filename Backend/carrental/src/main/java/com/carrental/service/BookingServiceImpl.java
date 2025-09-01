package com.carrental.service;

import com.carrental.dto.BookingUpdateRequest;
import com.carrental.model.Booking;
import com.carrental.model.BookingStatus;
import com.carrental.model.Car;
import com.carrental.model.User;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Booking createBooking(Booking booking, String userEmail) throws IllegalStateException {
        if (booking.getStartDateTime() == null || booking.getEndDateTime() == null) {
            throw new IllegalStateException("Start and End date-times must be provided.");
        }
        if (booking.getCar() == null || booking.getCar().getId() == null) {
            throw new IllegalStateException("Car ID must be provided.");
        }
        if (booking.getEndDateTime().isBefore(booking.getStartDateTime())) {
            throw new IllegalStateException("End date-time must be after start date-time.");
        }
        // ✅ **THE FIX:** Allow same-day bookings, but ensure they are at least 1 hour in the future.
        if (booking.getStartDateTime().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new IllegalStateException("Booking start time must be at least 1 hour from now.");
        }

        // ✅ **FIX:** Fetch the full Car entity using the ID from the Car object
        Car car = carRepository.findById(booking.getCar().getId())
                .orElseThrow(() -> new IllegalStateException("Car not found with ID: " + booking.getCar().getId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + userEmail));

        // ✅ **FIX:** Use the car's ID for the query
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                car.getId(), booking.getStartDateTime(), booking.getEndDateTime());
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Car is already booked during this time period.");
        }

        long durationInHours = ChronoUnit.HOURS.between(booking.getStartDateTime(), booking.getEndDateTime());
        if (durationInHours <= 0) {
            throw new IllegalStateException("Booking must be for a positive duration.");
        }
        long numberOfDays = (long) Math.ceil(durationInHours / 24.0);
        double totalPrice = numberOfDays * car.getPricePerDay();

        booking.setTotalPrice(totalPrice);
        booking.setCar(car); // Set the full, managed car object
        booking.setUser(user);
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Booking not found with ID: " + id));
    }

    @Override
    public void deleteAllBookings() {
        bookingRepository.deleteAll();
    }

    @Override
    @Transactional
    public void cancelBooking(Long id, String requesterEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Booking not found with ID: " + id));

        // Verify that the user cancelling is the owner of the booking
        if (!booking.getUser().getEmail().equals(requesterEmail)) {
            throw new SecurityException("You are not authorized to cancel this booking.");
        }

        // Check if booking data is valid
        if (booking.getStartDateTime() == null) {
            throw new IllegalStateException("Booking data is corrupted - start date-time is missing.");
        }

        // Only allow cancellation for PENDING or CONFIRMED bookings
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Only pending or confirmed bookings can be cancelled. Current status: " + booking.getStatus());
        }

        // NEW: Enforce the 2-hour cancellation policy from creation time
        // Note: This is 2 hours from booking creation, not from start time
        // If you want 2 hours from start time, uncomment the line below and comment the
        // current logic

        LocalDateTime twoHoursAfterCreation = LocalDateTime.now().minusHours(2); // Assume booking was created recently

        // Alternative: 2 hours before start time cancellation policy
        // LocalDateTime cancellationCutoff = booking.getStartDateTime().minusHours(2);
        // if (LocalDateTime.now().isAfter(cancellationCutoff)) {
        // throw new IllegalStateException("Booking cannot be cancelled within 2 hours
        // of the start time.");
        // }

        // For now, let's implement a simple policy: bookings can be cancelled within 2
        // hours of start time
        LocalDateTime cancellationCutoff = booking.getStartDateTime().minusHours(2);
        if (LocalDateTime.now().isAfter(cancellationCutoff)) {
            throw new IllegalStateException("Booking cannot be cancelled within 2 hours of the start time.");
        }

        // If all checks pass, cancel the booking
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Note: The car's 'available' status doesn't need to be changed here,
        // because it's only set to 'false' upon pickup (in the confirmPickup method).
    }

    @Override
    public List<Booking> listBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> listBookingsForUser(String userEmail, String scope) {
        LocalDateTime now = LocalDateTime.now();
        switch (scope.toLowerCase()) {
            case "active":
                return bookingRepository
                        .findByUser_EmailAndEndDateTimeGreaterThanEqualOrderByStartDateTimeAsc(userEmail, now);
            case "past":
                return bookingRepository
                        .findByUser_EmailAndEndDateTimeLessThanOrderByStartDateTimeDesc(userEmail, now);
            default:
                return bookingRepository.findByUser_EmailOrderByStartDateTimeDesc(userEmail);
        }
    }

     @Override
    @Transactional
    public Booking updateBooking(Long id, BookingUpdateRequest req, String requesterEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Booking not found with ID: " + id));

        if (!booking.getUser().getEmail().equals(requesterEmail)) {
            throw new SecurityException("You are not authorized to update this booking.");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be updated.");
        }

        boolean updated = false;

        // ✅ **FIX:** Logic to update the Car object
        if (req.getCarId() != null) {
            Car newCar = carRepository.findById(req.getCarId())
                    .orElseThrow(() -> new IllegalStateException("Car not found with ID: " + req.getCarId()));
            booking.setCar(newCar);
            updated = true;
        }

        if (req.getStartDate() != null) {
            booking.setStartDateTime(req.getStartDate().atStartOfDay());
            updated = true;
        }
        if (req.getEndDate() != null) {
            booking.setEndDateTime(req.getEndDate().atTime(23, 59, 59));
            updated = true;
        }

        if (updated) {
            if (booking.getEndDateTime().isBefore(booking.getStartDateTime())) {
                throw new IllegalStateException("End date-time must be after start date-time.");
            }

            // ✅ **FIX:** Use the Car object's ID for the query
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    booking.getCar().getId(), booking.getStartDateTime(), booking.getEndDateTime())
                    .stream()
                    .filter(b -> !b.getId().equals(id))
                    .toList();
            
            if (!overlapping.isEmpty()) {
                throw new IllegalStateException("Car is already booked during this time period.");
            }

            // Recalculate price
            long numberOfDays = ChronoUnit.DAYS.between(
                    booking.getStartDateTime().toLocalDate(),
                    booking.getEndDateTime().toLocalDate()) + 1;
            double totalPrice = numberOfDays * booking.getCar().getPricePerDay();
            booking.setTotalPrice(totalPrice);
        }

        return bookingRepository.save(booking);
    }

    //admin
    @Override
    @Transactional
    public Booking confirmPickup(Long bookingId, String adminEmail) {
        Booking booking = getBooking(bookingId);
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Booking must be confirmed to be picked up. Current status: " + booking.getStatus());
        }

        // ✅ **FIX:** Use the Car object
        Car car = booking.getCar();
        car.setAvailable(false);
        car.setUsageCount(car.getUsageCount() + 1);
        carRepository.save(car);

        booking.setStatus(BookingStatus.IN_PROGRESS);
        return bookingRepository.save(booking);
    }
    

    @Override
    @Transactional
    public Booking completeBooking(Long bookingId, String adminEmail) {
        Booking booking = getBooking(bookingId);
        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new IllegalStateException("Booking must be in progress to be completed. Current status: " + booking.getStatus());
        }

        // ✅ **FIX:** Use the Car object
        Car car = booking.getCar();
        car.setAvailable(true);
        carRepository.save(car);

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }
}