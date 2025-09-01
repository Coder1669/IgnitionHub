// src/main/java/com/carrental/dto/BookingUpdateRequest.java
package com.carrental.dto;

import java.time.LocalDate;

public class BookingUpdateRequest {
    private Long carId;              // optional
    private LocalDate startDate;     // optional
    private LocalDate endDate;       // optional

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
