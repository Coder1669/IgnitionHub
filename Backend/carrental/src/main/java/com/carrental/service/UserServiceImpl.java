package com.carrental.service;

import com.carrental.dto.PasswordChangeRequest;
import com.carrental.dto.UserProfileUpdateRequest;
import com.carrental.model.Booking;
import com.carrental.model.BookingStatus;
import com.carrental.model.User;
import com.carrental.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
// Make sure your class implements the UserService interface
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired private MailService mailService;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public String encodePassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    @Override
    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setRole(User.Role.CUSTOMER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEmailVerified(false);
        User savedUser = userRepository.save(user);
        return sanitize(savedUser);
    }

    @Override
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(this::sanitize);
        return users;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::sanitize)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- ADDED MISSING METHODS ---

    @Override
    @Transactional
    public User promoteUserToAdmin(Long id, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setRole(User.Role.ADMIN);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateProfile(String email, UserProfileUpdateRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getName() != null && !req.getName().isBlank()) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, PasswordChangeRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getNewPassword() == null || req.getNewPassword().length() < 6)
            throw new RuntimeException("New password too short");
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword()))
            throw new RuntimeException("Old password incorrect");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // --- YOUR EXISTING METHODS (NOW WITH @Override) ---

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        List<Booking> userBookings = bookingRepository.findByUser_EmailOrderByStartDateTimeDesc(user.getEmail());
        
        long committedActiveBookings = userBookings.stream()
                .filter(booking -> 
                        booking.getEndDateTime().isAfter(LocalDateTime.now()) && 
                        (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.IN_PROGRESS))
                .count();

        if (committedActiveBookings > 0) {
            throw new RuntimeException("Cannot delete user with " + committedActiveBookings + " active booking(s).");
        }

        refreshTokenRepository.deleteAll(refreshTokenRepository.findAllByUser(user));
        emailVerificationTokenRepository.deleteAll(emailVerificationTokenRepository.findAllByUser(user));
        passwordResetTokenRepository.deleteAll(passwordResetTokenRepository.findAllByUser(user));
        bookingRepository.deleteAll(userBookings); 
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void deleteSelf(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> userBookings = bookingRepository.findByUser_EmailOrderByStartDateTimeDesc(user.getEmail());
        
        long committedActiveBookings = userBookings.stream()
                .filter(booking -> 
                        booking.getEndDateTime().isAfter(LocalDateTime.now()) && 
                        (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.IN_PROGRESS))
                .count();

        if (committedActiveBookings > 0) {
            throw new RuntimeException("Cannot delete account with " + committedActiveBookings + " active booking(s).");
        }

        refreshTokenRepository.deleteAll(refreshTokenRepository.findAllByUser(user));
        emailVerificationTokenRepository.deleteAll(emailVerificationTokenRepository.findAllByUser(user));
        passwordResetTokenRepository.deleteAll(passwordResetTokenRepository.findAllByUser(user));
        bookingRepository.deleteAll(userBookings); 
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void deleteAllUsers() {
        refreshTokenRepository.deleteAll();
        emailVerificationTokenRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        bookingRepository.deleteAll();
        userRepository.deleteAll();
    }
    
    @Override
    public String debugUserDeletion(Long id) {
        User u = getUserById(id);
        StringBuilder debug = new StringBuilder();
        debug.append("User Details: ID=").append(u.getId()).append(", Email=").append(u.getEmail()).append("\n");
        
        List<Booking> bookings = bookingRepository.findByUser_EmailOrderByStartDateTimeDesc(u.getEmail());
        debug.append("Bookings count: ").append(bookings.size()).append("\n");
        
        long committedActiveBookings = bookings.stream()
                .filter(booking -> 
                // First, check if the date is NOT null...
                booking.getEndDateTime() != null && 
                // ...only then, call the .isAfter() method.
                booking.getEndDateTime().isAfter(LocalDateTime.now()) && 
                (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.IN_PROGRESS))
        .count();
        debug.append("Committed active bookings: ").append(committedActiveBookings).append("\n");
        
        return debug.toString();
    }

    private User sanitize(User u) {
        u.setPassword(null);
        return u;
    }
}