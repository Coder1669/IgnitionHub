package com.carrental.controller;

import com.carrental.dto.*;
import com.carrental.model.User;
import com.carrental.service.AuthService;
import com.carrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.util.Map;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully. Please check your email to verify your account.",
                "user", user
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            TokenResponse tokenResponse = authService.login(loginRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ModelAndView verifyEmail(@RequestParam("token") String token) {
        ModelAndView modelAndView = new ModelAndView();
        
        // Use a temporary user object to display on the page
        User user = null;
        try {
            user = authService.getUserByVerificationToken(token); // Get the user before verification
            String result = authService.verifyEmail(token);
            
            modelAndView.setViewName("email-verification-success");
            modelAndView.addObject("message", result);
            if (user != null) {
                modelAndView.addObject("userEmail", user.getEmail());
            } else {
                modelAndView.addObject("userEmail", "unknown user");
            }
            modelAndView.addObject("success", true);
            
        } catch (Exception e) {
            modelAndView.setViewName("email-verification-error");
            modelAndView.addObject("error", e.getMessage());
            modelAndView.addObject("success", false);
        }
        
        return modelAndView;
    }

    @GetMapping("/verify-email-api")
    @ResponseBody
    public ResponseEntity<?> verifyEmailApi(@RequestParam("token") String token) {
        try {
            String result = authService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    @ResponseBody
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // @PostMapping("/reset-password")
    // @ResponseBody
    // public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    //     try {
    //         authService.resetPassword(request.getToken(), request.getNewPassword());
    //         return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    //     }
    // }

     // --- THIS IS THE ONLY CHANGE NEEDED ---
    // Renamed to match the frontend API service call
    @PostMapping("/reset-password-api")
    @ResponseBody
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    @ResponseBody
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.resendVerificationEmail(email);
            return ResponseEntity.ok(Map.of("message", "Verification email resent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    @ResponseBody
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            TokenResponse tokenResponse = authService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    
}

