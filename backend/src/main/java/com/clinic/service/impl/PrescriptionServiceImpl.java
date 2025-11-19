package com.clinic.service.impl;

import com.clinic.dto.PrescriptionDTO;
import com.clinic.dto.PrescriptionMedicineDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.Medicine;
import com.clinic.model.Patient;
import com.clinic.model.Prescription;
import com.clinic.model.PrescriptionMedicine;
import com.clinic.repository.MedicineRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        Patient patient = patientRepository.findById(prescriptionDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDiagnosis(prescriptionDTO.getDiagnosis());
        prescription.setNotes(prescriptionDTO.getNotes());
        prescription.setPrescriptionDate(LocalDateTime.now());

        if (prescriptionDTO.getMedicines() != null) {
            for (PrescriptionMedicineDTO pmDTO : prescriptionDTO.getMedicines()) {
                Medicine medicine = medicineRepository.findById(pmDTO.getMedicineId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + pmDTO.getMedicineId()));

                PrescriptionMedicine pm = new PrescriptionMedicine();
                pm.setMedicine(medicine);
                pm.setDosage(pmDTO.getDosage());
                pm.setFrequency(pmDTO.getFrequency());
                pm.setDuration(pmDTO.getDuration());
                pm.setInstructions(pmDTO.getInstructions());
                
                prescription.addMedicine(pm);
            }
        }

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapToDTO(savedPrescription);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        return mapToDTO(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PrescriptionDTO> getPrescriptionsByPatientId(Long patientId, Pageable pageable) {
        return prescriptionRepository.findByPatientId(patientId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescription not found");
        }
        prescriptionRepository.deleteById(id);
    }

    private PrescriptionDTO mapToDTO(Prescription prescription) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setPatientId(prescription.getPatient().getId());
        dto.setPatientName(prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName());
        dto.setDiagnosis(prescription.getDiagnosis());
        dto.setNotes(prescription.getNotes());
        dto.setPrescriptionDate(prescription.getPrescriptionDate());

        if (prescription.getMedicines() != null) {
            dto.setMedicines(prescription.getMedicines().stream().map(pm -> {
                PrescriptionMedicineDTO pmDTO = new PrescriptionMedicineDTO();
                pmDTO.setId(pm.getId());
                pmDTO.setMedicineId(pm.getMedicine().getId());
                pmDTO.setMedicineName(pm.getMedicine().getName());
                pmDTO.setDosage(pm.getDosage());
                pmDTO.setFrequency(pm.getFrequency());
                pmDTO.setDuration(pm.getDuration());
                pmDTO.setInstructions(pm.getInstructions());
                return pmDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
