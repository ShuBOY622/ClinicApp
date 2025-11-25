package com.clinic.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "patients")
@SQLDelete(sql = "UPDATE patients SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    private String profilePhoto;

    // Additional patient information
    private String occupation;

    // Physical Characteristics
    @Column(name = "body_type")
    private String bodyType;

    @Column(name = "favourite_taste")
    private String favouriteTaste;

    // Daily Functions
    @Column(name = "urine_details")
    private String urineDetails;

    @Column(name = "stool_details")
    private String stoolDetails;

    @Column(name = "sleep_details")
    private String sleepDetails;

    @Column(name = "sweat_details")
    private String sweatDetails;

    @Column(name = "menstrual_details")
    private String menstrualDetails;

    // Medical History Details
    @Column(columnDefinition = "TEXT")
    private String pastHistory;

    @Column(columnDefinition = "TEXT")
    private String previousTreatment;

    @Column(columnDefinition = "TEXT")
    private String previousMedication;

    @Column(columnDefinition = "TEXT")
    private String dailyRoutine;

    // Current Complaints
    @Column(columnDefinition = "TEXT")
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
