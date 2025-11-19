package com.clinic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDTO {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private String patientName; // For display purposes

    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<PrescriptionMedicineDTO> medicines;

    private String diagnosis;
    private String notes;
    private LocalDateTime prescriptionDate;
}
