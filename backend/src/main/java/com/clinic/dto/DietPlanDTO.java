package com.clinic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DietPlanDTO {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private String patientName;

    private String breakfast;
    private String lunch;
    private String dinner;
    private String instructions;
    private String weeklyPlanJson;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
}
