package com.clinic.service;

import com.clinic.dto.PatientDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PatientService {
    PatientDTO createPatient(PatientDTO patientDTO);
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    PatientDTO getPatientById(Long id);
    void deletePatient(Long id);
    Page<PatientDTO> getAllPatients(Pageable pageable);
    Page<PatientDTO> searchPatients(String keyword, Pageable pageable);
}
