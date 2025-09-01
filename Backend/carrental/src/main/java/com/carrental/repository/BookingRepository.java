package com.carrental.repository;

import com.carrental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Finds bookings for a specific car that overlap with a given time range,
     * excluding cancelled bookings. This is used to prevent double-booking.
     */
    // ✅ **FIX:** Changed "b.carId" to "b.car.id" to match the updated Booking entity
    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId " +
           "AND b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime " +
           "AND b.status != com.carrental.model.BookingStatus.CANCELLED")
    List<Booking> findOverlappingBookings(
            @Param("carId") Long carId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);

    /**
     * Finds a user's active and upcoming bookings (those that have not yet ended).
     * Ordered by the soonest start date first.
     */
    List<Booking> findByUser_EmailAndEndDateTimeGreaterThanEqualOrderByStartDateTimeAsc(
            String email, LocalDateTime currentDateTime);

    /**
     * Finds a user's past bookings (those that have already ended).
     * Ordered by the most recent start date first.
     */
    List<Booking> findByUser_EmailAndEndDateTimeLessThanOrderByStartDateTimeDesc(
            String email, LocalDateTime currentDateTime);

    /**
     * Finds all of a user's bookings, regardless of status.
     * Ordered by the most recent start date first.
     */
    List<Booking> findByUser_EmailOrderByStartDateTimeDesc(String email);
}