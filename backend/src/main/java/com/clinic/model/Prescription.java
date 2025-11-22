package com.clinic.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "prescriptions")
@SQLDelete(sql = "UPDATE prescriptions SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class Prescription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime prescriptionDate;

    // Basic Information
    @Column(columnDefinition = "TEXT")
    private String patientAddress;

    private String patientOccupation;

    private String patientMobileNumber;

    // Physical Characteristics
    @Column(name = "body_type") // प्रकृती
    private String bodyType;

    @Column(name = "favourite_taste") // आवडता रस
    private String favouriteTaste;

    // Daily Functions
    @Column(name = "urine_details") // मूत्र
    private String urineDetails;

    @Column(name = "stool_details") // दिष्ट / शौच
    private String stoolDetails;

    @Column(name = "sleep_details") // निद्रा
    private String sleepDetails;

    @Column(name = "sweat_details") // घाम
    private String sweatDetails;

    @Column(name = "menstrual_details") // रज
    private String menstrualDetails;

    // Medical History
    @Column(columnDefinition = "TEXT")
    private String pastHistory; // पूर्व इतिहास

    @Column(columnDefinition = "TEXT")
    private String previousTreatment; // पूर्व वैद्यकीय उपचार

    @Column(columnDefinition = "TEXT")
    private String previousMedication; // पूर्व औषधी उपचार

    @Column(columnDefinition = "TEXT")
    private String dailyRoutine; // दिनचर्या

    // Current Complaints
    @Column(columnDefinition = "TEXT")
    private String currentComplaints; // सध्याच्या तक्रारी / लक्षणे

    // Abdominal Examination
    private String liverExam; // यकृत
    private String spleenExam; // प्लीहा
    private String lowerAbdomenExam; // अपानकक्षा
    private String rightKidneyExam; // दक्षिण वृक्क
    private String leftKidneyExam; // वाम वृक्क

    // Diagnosis
    private String diagnosisStatus; // युक्त
    private String rightNavelPosition; // दक्षिण नाभि
    private String leftNavelPosition; // वाम नाभि

    public void addMedicine(PrescriptionMedicine medicine) {
        medicines.add(medicine);
        medicine.setPrescription(this);
    }

    public void removeMedicine(PrescriptionMedicine medicine) {
        medicines.remove(medicine);
        medicine.setPrescription(null);
    }
}
