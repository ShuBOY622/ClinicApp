package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDTO {
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;
    private String address;
    private String bloodGroup;
    private String medicalHistory;
    private String profilePhoto;

    // Additional patient information
    private String occupation;

    // Physical Characteristics
    private String bodyType;
    private String favouriteTaste;

    // Daily Functions
    private String urineDetails;
    private String stoolDetails;
    private String sleepDetails;
    private String sweatDetails;
    private String menstrualDetails;

    // Medical History Details
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
    private String diagnosisStatus;
    private String rightNavelPosition;
    private String leftNavelPosition;
}
