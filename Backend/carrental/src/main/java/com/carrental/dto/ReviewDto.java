package com.carrental.dto;

import java.time.LocalDateTime;

// This DTO shapes our final Review object for the frontend.
public class ReviewDto {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private UserDto user; // It includes the simplified UserDto

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}