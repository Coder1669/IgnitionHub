package com.carrental.service;

import com.carrental.config.JwtTokenUtil;
import com.carrental.dto.LoginRequest;
import com.carrental.dto.RegisterRequest;
import com.carrental.dto.TokenResponse;
import com.carrental.model.*;
import com.carrental.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private MailService mailService;

    @Transactional
    public User register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());

        // FORCE ALL NEW USERS TO BE CUSTOMER (NO MORE ADMIN CREATION)
        user.setRole(User.Role.CUSTOMER);

        user.setEmailVerified(false);
        User savedUser = userRepository.save(user);

        // Create verification token
        createAndSendVerificationToken(savedUser);

        // Return sanitized user object
        User responseUser = new User();
        responseUser.setId(savedUser.getId());
        responseUser.setName(savedUser.getName());
        responseUser.setEmail(savedUser.getEmail());
        responseUser.setPhone(savedUser.getPhone());
        responseUser.setAddress(savedUser.getAddress());
        responseUser.setRole(savedUser.getRole());
        responseUser.setEmailVerified(savedUser.isEmailVerified());
        responseUser.setPassword(null);

        return responseUser;
    }

    private void createAndSendVerificationToken(User user) {
        // Delete any existing verification tokens for this user first
        emailVerificationTokenRepository.findAllByUser(user).forEach(
                emailVerificationTokenRepository::delete);

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(Instant.now().plusSeconds(86400)); // 24 hours
        emailVerificationTokenRepository.save(verificationToken);

        String verificationLink = "http://localhost:8081/auth/verify-email?token=" + token; // Changed port to 8081
        String emailBody = "Thank you for registering with Car Rental!\n\n" +
                "Please click the link below to verify your email address:\n" +
                verificationLink + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account, please ignore this email.\n\n" +
                "Best regards,\nCar Rental Team";

        System.out.println("Sending verification email to: " + user.getEmail());
        System.out.println("Verification link: " + verificationLink);

        mailService.send(user.getEmail(), "Verify Your Email for Car Rental", emailBody);
    }

    public TokenResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        System.out.println("Login attempt - User: " + user.getEmail() + ", EmailVerified: " + user.isEmailVerified());

        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Email not verified. Please check your inbox for verification email.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String accessToken = jwtTokenUtil.generateToken(userDetails.getUsername(), user.getRole().name());
        final String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails.getUsername());

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setExpiresAt(Instant.now().plusSeconds(604800)); // 7 days
        refreshTokenRepository.save(refreshTokenEntity);

        return new TokenResponse(accessToken, refreshToken);
    }

    @Transactional
    public String verifyEmail(String token) {
        System.out.println("=== EMAIL VERIFICATION START ===");
        System.out.println("Token: " + token);

        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification token"));

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            emailVerificationTokenRepository.delete(verificationToken);
            throw new IllegalStateException("Verification token has expired. Please request a new verification email.");
        }

        User user = verificationToken.getUser();
        System.out.println("Found user: " + user.getEmail() + " (ID: " + user.getId() + ")");
        System.out.println("Current emailVerified status: " + user.isEmailVerified());

        user.setEmailVerified(true);
        User updatedUser = userRepository.saveAndFlush(user); // Use saveAndFlush for immediate commit

        System.out.println("After saveAndFlush - emailVerified: " + updatedUser.isEmailVerified());

        emailVerificationTokenRepository.delete(verificationToken);
        System.out.println("Verification token deleted");
        System.out.println("=== EMAIL VERIFICATION COMPLETE ===");

        return "Email verified successfully! You can now log in to your account.";
    }

    public User getUserByVerificationToken(String token) {
        try {
            EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                    .orElse(null);
            return verificationToken != null ? verificationToken.getUser() : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.isEmailVerified()) {
            throw new IllegalStateException("Email is already verified");
        }

        emailVerificationTokenRepository.findAllByUser(user).forEach(
                emailVerificationTokenRepository::delete);

        createAndSendVerificationToken(user);
    }

    // In src/main/java/com/carrental/service/AuthService.java
    @Transactional
    public void initiatePasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            // Invalidate all previous reset tokens for this user
            passwordResetTokenRepository.findAllByUser(user).forEach(token -> {
                token.setUsed(true);
                passwordResetTokenRepository.save(token);
            });

            // Create and save the new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
            resetToken.setUsed(false);
            passwordResetTokenRepository.save(resetToken);

            // Build the link for the BACKEND password reset page
        //   String resetLink = "http://localhost:5173/auth/reset-password?token=" + token;

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

            String emailBody = "Hello,\n\n" +
                    "You requested to reset your password for your Car Rental account.\n\n" +
                    "Please click the link below to reset your password:\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you didn't request this password reset, please ignore this email.\n\n" +
                    "Best regards,\nCar Rental Team";

            mailService.send(user.getEmail(), "Password Reset Request", emailBody);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new IllegalStateException("Password reset token has expired");
        }

        if (resetToken.isUsed()) {
            throw new IllegalStateException("Password reset token has already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.saveAndFlush(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    public TokenResponse refreshToken(String refreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalStateException("Invalid refresh token"));

        if (storedToken.getExpiresAt().isBefore(Instant.now()) || storedToken.isRevoked()) {
            throw new IllegalStateException("Refresh token has expired or been revoked");
        }

        User user = storedToken.getUser();
        String newAccessToken = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().name());

        return new TokenResponse(newAccessToken, refreshToken);
    }

    // Add this method to AuthService.java

    public void validatePasswordResetToken(String tokenString) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new IllegalStateException("Invalid password reset token."));

        if (token.isUsed()) {
            throw new IllegalStateException("This password reset token has already been used.");
        }
        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalStateException("This password reset token has expired.");
        }
    }
}