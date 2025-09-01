package com.carrental.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // private String name;
    private String brand;
    private String model;
    private Double pricePerDay;
    private Boolean available = true; // Default to available

    // New enhanced fields
    private String imageUrl;
    private String category; // Economy, Luxury, SUV, Sedan, Hatchback
    private String transmission; // Manual, Automatic
    private String fuelType; // Petrol, Diesel, Electric, Hybrid
    private Integer seats;
    private String color;
    private Integer year;
    @Column(length = 1000)
    private String description;

    // NEW
    private Integer usageCount = 0;

    // Optional aggregates for faster listing (kept in sync via reviews)
    private Double ratingAverage = 0.0;
    private Integer ratingCount = 0;

    // Getters
    public Long getId() {
        return id;
    }

    // public String getName() {
    //     return name;
    // }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Boolean isAvailable() {
        return available;
    } // Keep for backward compatibility

    public String getImageUrl() {
        return imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public String getTransmission() {
        return transmission;
    }

    public String getFuelType() {
        return fuelType;
    }

    public Integer getSeats() {
        return seats;
    }

    public String getColor() {
        return color;
    }

    public Integer getYear() {
        return year;
    }

    public String getDescription() {
        return description;
    }

    public Integer getUsageCount() {
        return usageCount;
    }

    public Double getRatingAverage() {
        return ratingAverage;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    // public void setName(String name) {
    //     this.name = name;
    // }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }

    public void setRatingAverage(Double ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }
}