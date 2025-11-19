package com.clinic.service;

import com.clinic.dto.PrescriptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrescriptionService {
    PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO);
    PrescriptionDTO getPrescriptionById(Long id);
    Page<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId, Pageable pageable);
    void deletePrescription(Long id);
    // Add PDF generation later
}
