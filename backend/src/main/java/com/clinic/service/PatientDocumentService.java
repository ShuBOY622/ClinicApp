package com.clinic.service;

import com.clinic.dto.PatientDocumentDTO;
import com.clinic.model.PatientDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PatientDocumentService {
    PatientDocumentDTO uploadDocument(Long patientId, MultipartFile file, String description);
    List<PatientDocumentDTO> getDocumentsByPatientId(Long patientId);
    void deleteDocument(Long id);
}
