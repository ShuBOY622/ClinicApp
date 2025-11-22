package com.clinic.service;

import com.clinic.dto.PrescriptionDTO;

public interface PdfService {
    byte[] generatePrescriptionPdf(Long prescriptionId) throws Exception;
    byte[] generateConsentFormPdf(Long patientId) throws Exception;
    byte[] generateDietPlanPdf(Long dietPlanId) throws Exception;
}
