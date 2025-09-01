package com.carrental;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {

                    // ===== PUBLIC AUTHENTICATION ENDPOINTS =====
                    auth.requestMatchers(HttpMethod.POST, "/auth/register").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/auth/login").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/auth/refresh").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/auth/verify-email").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/auth/verify-email-api").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/auth/resend-verification").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/auth/forgot-password").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/auth/reset-password-api").permitAll();
                    

                    // ===== DEBUG ENDPOINTS (ADMIN ONLY) =====
                    auth.requestMatchers("/debug/**").hasRole("ADMIN");

                    // ===== PUBLIC CAR ENDPOINTS (for browsing) =====
                    auth.requestMatchers(HttpMethod.GET, "/cars").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/cars/**").permitAll();

                    // ===== REVIEW ENDPOINTS =====
                    // Public: Get reviews for a car
                    auth.requestMatchers(HttpMethod.GET, "/cars/*/reviews").permitAll();

                     // Authenticated: Create, update, delete reviews
                    auth.requestMatchers(HttpMethod.POST, "/cars/*/reviews").authenticated();
                    auth.requestMatchers(HttpMethod.PUT, "/cars/*/reviews/*").authenticated();
                    auth.requestMatchers(HttpMethod.DELETE, "/cars/*/reviews/*").authenticated();

                    // ===== AUTHENTICATED USER ENDPOINTS =====
                    auth.requestMatchers("/users/me").authenticated();
                    auth.requestMatchers("/users/profile").authenticated();
                    auth.requestMatchers("/users/change-password").authenticated();
                    auth.requestMatchers("/bookings/**").authenticated();
                    auth.requestMatchers("/bookings/me").authenticated();

                    // ===== ADMIN-ONLY ENDPOINTS =====
                    auth.requestMatchers("/users/**").hasRole("ADMIN");
                    auth.requestMatchers(HttpMethod.POST, "/cars").hasRole("ADMIN");
                    auth.requestMatchers(HttpMethod.PUT, "/cars/**").hasRole("ADMIN");
                    auth.requestMatchers(HttpMethod.DELETE, "/cars/**").hasRole("ADMIN");
                    auth.requestMatchers(HttpMethod.GET, "/bookings").hasRole("ADMIN");
                    auth.requestMatchers("/api/admin/**").hasRole("ADMIN");

                    // ===== PAYMENT ENDPOINTS =====
                    auth.requestMatchers("/payment/**").authenticated();

                    

                    // ===== DEFAULT (ALL OTHER ENDPOINTS) =====
                    auth.anyRequest().authenticated();
                })
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}