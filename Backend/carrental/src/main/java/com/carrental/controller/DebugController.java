package com.carrental.controller;

import com.carrental.service.UserService;
import com.carrental.service.BookingService;
import com.carrental.service.MailService;
import com.carrental.model.User;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private UserService userService;
    @Autowired
    private MailService mailService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookingService bookingService; // ✅ ADD THIS LINE

    // TEMPORARILY REMOVED @PreAuthorize FOR SETUP
    @GetMapping("/admin-check")
    public ResponseEntity<?> debugAdminAccess(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.ok(Map.of("message", "No authentication found"));
        }
        return ResponseEntity.ok(Map.of(
                "message", "Admin access confirmed",
                "authenticated", auth.isAuthenticated(),
                "authorities", auth.getAuthorities().toString(),
                "name", auth.getName(),
                "principal", auth.getPrincipal().toString()));
    }

    @GetMapping("/user/{id}/delete-check")
    public ResponseEntity<?> debugUserDeletion(@PathVariable Long id) {
        try {
            String debugInfo = userService.debugUserDeletion(id);
            return ResponseEntity.ok(Map.of(
                    "debug_info", debugInfo,
                    "can_delete", !debugInfo.contains("BLOCKED")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "can_delete", false));
        }
    }

    @PostMapping("/make-admin/{email}")
    public ResponseEntity<?> makeInitialAdmin(@PathVariable String email) {
        try {
            var users = userService.getAllUsers();
            var user = users.stream()
                    .filter(u -> u.getEmail().equalsIgnoreCase(email))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

            userService.promoteUserToAdmin(user.getId(), "system");

            return ResponseEntity.ok(Map.of(
                    "message", "User promoted to admin",
                    "email", email,
                    "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // NOW PUBLIC - No authentication required for setup
    @DeleteMapping("/delete-all-users")
    public ResponseEntity<?> deleteAllUsers() {
        try {
            userService.deleteAllUsers();
            return ResponseEntity.ok(Map.of("message", "All user data has been wiped."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin-only")
    public ResponseEntity<?> adminOnlyEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "This endpoint is accessible for setup",
                "timestamp", System.currentTimeMillis()));
    }

    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("email");
            if (to == null || to.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            String subject = request.getOrDefault("subject", "Test Email from CarRental");
            String body = request.getOrDefault("body",
                    "This is a test email to verify that the email configuration is working correctly.\n\n" +
                            "If you received this email, the email service is functioning properly.\n\n" +
                            "Best regards,\nCarRental System");

            mailService.send(to, subject, body);

            return ResponseEntity.ok(Map.of(
                    "message", "Test email sent successfully",
                    "recipient", to,
                    "subject", subject));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Failed to send email: " + e.getMessage()));
        }
    }

    @GetMapping("/users-detailed")
    public ResponseEntity<?> getAllUsersDetailed() {
        try {
            var users = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("total_users", users.size());
            response.put("users", users);

            long adminCount = users.stream()
                    .filter(u -> u.getRole() == User.Role.ADMIN)
                    .count();
            response.put("admin_count", adminCount);
            response.put("customer_count", users.size() - adminCount);

            long verifiedCount = users.stream()
                    .filter(User::isEmailVerified)
                    .count();
            response.put("verified_users", verifiedCount);
            response.put("unverified_users", users.size() - verifiedCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/test-registration")
    public ResponseEntity<?> testRegistration(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.getOrDefault("name", "Test User");
            String password = request.getOrDefault("password", "testpass123");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            User testUser = new User();
            testUser.setEmail(email);
            testUser.setName(name);
            testUser.setPassword(password);

            User registered = userService.registerUser(testUser);

            return ResponseEntity.ok(Map.of(
                    "message", "Test user registered successfully",
                    "user", registered,
                    "note", "Check email for verification link"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-user/{userId}")
    public ResponseEntity<?> manuallyVerifyUser(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is already verified"));
            }

            user.setEmailVerified(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "User manually verified",
                    "userId", userId,
                    "email", user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> systemHealth() {
        Map<String, Object> health = new HashMap<>();

        try {
            var users = userService.getAllUsers();
            health.put("database", "OK");
            health.put("user_count", users.size());
        } catch (Exception e) {
            health.put("database", "ERROR: " + e.getMessage());
        }

        try {
            health.put("email_service", "OK");
        } catch (Exception e) {
            health.put("email_service", "ERROR: " + e.getMessage());
        }

        health.put("timestamp", System.currentTimeMillis());
        health.put("status", "Running");

        return ResponseEntity.ok(health);
    }

    // NEW: All-in-one setup method
    @PostMapping("/reset-and-create-admin")
    public ResponseEntity<?> resetAndCreateAdmin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.getOrDefault("name", "Admin User");
            String password = request.getOrDefault("password", "admin123");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            System.out.println("=== RESET AND CREATE ADMIN PROCESS ===");

            // Step 1: Delete everything
            userService.deleteAllUsers();
            System.out.println("✓ All users deleted");

            // Step 2: Create admin user directly in repository (bypass registration flow)
            User admin = new User();
            admin.setEmail(email);
            admin.setName(name);
            admin.setPassword(userService.encodePassword(password));
            admin.setRole(User.Role.ADMIN);
            admin.setEmailVerified(true); // Skip email verification

            User savedAdmin = userRepository.save(admin);
            System.out.println("✓ Admin created: " + savedAdmin.getEmail() + " (ID: " + savedAdmin.getId() + ")");

            // Step 3: Verify the admin was created correctly
            User verifyAdmin = userRepository.findById(savedAdmin.getId()).orElse(null);

            return ResponseEntity.ok(Map.of(
                    "message", "System reset complete - Admin user created successfully",
                    "email", email,
                    "userId", savedAdmin.getId(),
                    "role", savedAdmin.getRole().toString(),
                    "emailVerified", savedAdmin.isEmailVerified(),
                    "verification", verifyAdmin != null ? "Admin found in database" : "ERROR: Admin not found",
                    "totalUsers", userService.getAllUsers().size(),
                    "note", "You can now login with email: " + email + " and password: " + password));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "stackTrace", e.getStackTrace()[0].toString()));
        }
    }

    // Add this complete method to DebugController.java

    @DeleteMapping("/delete-all-bookings")
    @PreAuthorize("hasRole('ADMIN')") // Recommended for production
    public ResponseEntity<?> deleteAllBookings() {
        try {
            bookingService.deleteAllBookings();
            return ResponseEntity.ok(Map.of("message", "All bookings have been successfully deleted."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}