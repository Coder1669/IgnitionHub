package com.carrental.controller;

import com.carrental.dto.*;
import com.carrental.model.User;
import com.carrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private UserService userService;

    // ===== Get all users (Admin only) =====
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    // ✅ **FIX:** Changed return type from List<User> to List<UserDto>
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // ===== Get current logged in user (more efficient) =====
    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication auth) {
        try {
            User user = userService.getUserByEmail(auth.getName());
            // ✅ FIX: Convert the User entity to a UserDto before returning
            return ResponseEntity.ok(convertToDto(user));
        } catch (RuntimeException e) {
            // This part is fine, but the error should no longer happen
            return ResponseEntity.notFound().build();
        }
    }

    // ===== Get user by ID (Admin only) =====
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Promote user to Admin (Admin only) =====
    @PutMapping("/{userId}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteUser(@PathVariable Long userId, Authentication authentication) {
        try {
            User promotedUser = userService.promoteUserToAdmin(userId, authentication.getName());
            promotedUser.setPassword(null);
            return ResponseEntity.ok(Map.of(
                "message", "User promoted to admin successfully", 
                "user", promotedUser
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Delete user (Admin only) =====
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Update user profile =====
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()") // Added for clarity, your SecurityConfig handles this
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileUpdateRequest req, Authentication auth) {
        try {
            User updatedUser = userService.updateProfile(auth.getName(), req);
            // ✅ FIX: Convert the 'updatedUser' to a DTO before returning it in the response.
            return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully", 
                "user", convertToDto(updatedUser)
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Change password =====
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest req, Authentication auth) {
        try {
            userService.changePassword(auth.getName(), req);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== Debug endpoint (remove in production) =====
    @GetMapping("/debug/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> debugUser(@PathVariable Long id) {
        try {
            String debug = userService.debugUserDeletion(id);
            return ResponseEntity.ok(Map.of("debug", debug));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

     // ===== NEW ENDPOINT FOR A USER TO DELETE THEIR OWN ACCOUNT =====
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteUserSelf(Authentication auth) {
        try {
            // Get the email of the logged-in user from the authentication principal
            String email = auth.getName();
            userService.deleteSelf(email);
            return ResponseEntity.ok(Map.of("message", "Your account has been successfully deleted."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
     // Helper method to convert User entity to UserDto
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
         dto.setCreatedAt(user.getCreatedAt()); // ✅ Added this line
        return dto;
    }
}