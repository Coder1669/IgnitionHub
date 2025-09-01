// src/main/java/com/carrental/dto/ReviewRequest.java
package com.carrental.dto;

public class ReviewRequest {
    private Integer rating; // 1..5
    private String comment;

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
