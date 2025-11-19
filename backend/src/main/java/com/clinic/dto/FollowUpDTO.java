package com.clinic.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FollowUpDTO {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private String patientName;
    private String patientPhone;

    @NotNull(message = "Follow-up date is required")
    @Future(message = "Follow-up date must be in the future")
    private LocalDateTime followUpDate;

    private String reason;
    private String status;
    private boolean reminderSent;
}
