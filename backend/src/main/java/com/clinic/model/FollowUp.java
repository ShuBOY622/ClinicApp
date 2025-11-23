package com.clinic.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "follow_ups")
@SQLDelete(sql = "UPDATE follow_ups SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class FollowUp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDateTime followUpDate;

    private String reason;

    private String status; // PENDING, COMPLETED, MISSED, CANCELLED

    private boolean reminderSent = false;
    
    private LocalDateTime reminderSentAt;
    
    private String reminderStatus; // PENDING, SENT, FAILED, DELIVERED
    
    @Column(columnDefinition = "TEXT")
    private String reminderError;
    
    private String twilioMessageSid;
}
