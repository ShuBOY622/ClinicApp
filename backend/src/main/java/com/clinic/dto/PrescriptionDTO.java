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

    // Basic Information
    private String patientAddress;
    private String patientOccupation;
    private String patientMobileNumber;

    // Physical Characteristics
    private String bodyType;
    private String favouriteTaste;

    // Daily Functions
    private String urineDetails;
    private String stoolDetails;
    private String sleepDetails;
    private String sweatDetails;
    private String menstrualDetails;

    // Medical History
    private String pastHistory;
    private String previousTreatment;
    private String previousMedication;
    private String dailyRoutine;

    // Current Complaints
    private String currentComplaints;

    // Abdominal Examination
    private String liverExam;
    private String spleenExam;
    private String lowerAbdomenExam;
    private String rightKidneyExam;
    private String leftKidneyExam;

    // Diagnosis
    private String diagnosisStatus;
    private String rightNavelPosition;
    private String leftNavelPosition;
}
