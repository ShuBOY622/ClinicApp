package com.clinic.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "medicines")
@SQLDelete(sql = "UPDATE medicines SET is_deleted = true WHERE id=?")
@Where(clause = "is_deleted=false")
public class Medicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String genericName;

    private String category; // Antibiotic, Painkiller, etc.

    private String formType; // Tablet, Syrup, Injection

    private String dosage; // 500mg, 10ml

    private String manufacturer;

    private BigDecimal price;

    private Integer stockQuantity;

    private LocalDate expiryDate;
}
