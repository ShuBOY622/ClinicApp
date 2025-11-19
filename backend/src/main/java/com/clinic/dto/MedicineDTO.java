package com.clinic.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MedicineDTO {
    private Long id;

    @NotBlank(message = "Medicine name is required")
    private String name;

    private String genericName;
    private String category;
    private String formType;
    private String dosage;
    private String manufacturer;

    @Min(value = 0, message = "Price must be non-negative")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;

    private LocalDate expiryDate;
}
