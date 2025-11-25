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
    private final com.clinic.service.MedicineService medicineService;

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

        // Map patient details fields
        prescription.setPatientAddress(prescriptionDTO.getPatientAddress());
        prescription.setPatientOccupation(prescriptionDTO.getPatientOccupation());
        prescription.setPatientMobileNumber(prescriptionDTO.getPatientMobileNumber());
        prescription.setBodyType(prescriptionDTO.getBodyType());
        prescription.setFavouriteTaste(prescriptionDTO.getFavouriteTaste());
        prescription.setUrineDetails(prescriptionDTO.getUrineDetails());
        prescription.setStoolDetails(prescriptionDTO.getStoolDetails());
        prescription.setSleepDetails(prescriptionDTO.getSleepDetails());
        prescription.setSweatDetails(prescriptionDTO.getSweatDetails());
        prescription.setMenstrualDetails(prescriptionDTO.getMenstrualDetails());
        prescription.setPastHistory(prescriptionDTO.getPastHistory());
        prescription.setPreviousTreatment(prescriptionDTO.getPreviousTreatment());
        prescription.setPreviousMedication(prescriptionDTO.getPreviousMedication());
        prescription.setDailyRoutine(prescriptionDTO.getDailyRoutine());
        prescription.setCurrentComplaints(prescriptionDTO.getCurrentComplaints());
        prescription.setLiverExam(prescriptionDTO.getLiverExam());
        prescription.setSpleenExam(prescriptionDTO.getSpleenExam());
        prescription.setLowerAbdomenExam(prescriptionDTO.getLowerAbdomenExam());
        prescription.setRightKidneyExam(prescriptionDTO.getRightKidneyExam());
        prescription.setLeftKidneyExam(prescriptionDTO.getLeftKidneyExam());
        prescription.setDiagnosisStatus(prescriptionDTO.getDiagnosisStatus());
        prescription.setRightNavelPosition(prescriptionDTO.getRightNavelPosition());
        prescription.setLeftNavelPosition(prescriptionDTO.getLeftNavelPosition());

        if (prescriptionDTO.getMedicines() != null) {
            for (PrescriptionMedicineDTO pmDTO : prescriptionDTO.getMedicines()) {
                Medicine medicine = medicineRepository.findById(pmDTO.getMedicineId())
                        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + pmDTO.getMedicineId()));

                // Validate and deduct stock
                medicineService.deductStock(pmDTO.getMedicineId(), pmDTO.getQuantity());

                PrescriptionMedicine pm = new PrescriptionMedicine();
                pm.setMedicine(medicine);
                pm.setDosage(pmDTO.getDosage());
                pm.setFrequency(pmDTO.getFrequency());
                pm.setDuration(pmDTO.getDuration());
                pm.setQuantity(pmDTO.getQuantity());
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

        // Map patient details fields
        dto.setPatientAddress(prescription.getPatientAddress());
        dto.setPatientOccupation(prescription.getPatientOccupation());
        dto.setPatientMobileNumber(prescription.getPatientMobileNumber());
        dto.setBodyType(prescription.getBodyType());
        dto.setFavouriteTaste(prescription.getFavouriteTaste());
        dto.setUrineDetails(prescription.getUrineDetails());
        dto.setStoolDetails(prescription.getStoolDetails());
        dto.setSleepDetails(prescription.getSleepDetails());
        dto.setSweatDetails(prescription.getSweatDetails());
        dto.setMenstrualDetails(prescription.getMenstrualDetails());
        dto.setPastHistory(prescription.getPastHistory());
        dto.setPreviousTreatment(prescription.getPreviousTreatment());
        dto.setPreviousMedication(prescription.getPreviousMedication());
        dto.setDailyRoutine(prescription.getDailyRoutine());
        dto.setCurrentComplaints(prescription.getCurrentComplaints());
        dto.setLiverExam(prescription.getLiverExam());
        dto.setSpleenExam(prescription.getSpleenExam());
        dto.setLowerAbdomenExam(prescription.getLowerAbdomenExam());
        dto.setRightKidneyExam(prescription.getRightKidneyExam());
        dto.setLeftKidneyExam(prescription.getLeftKidneyExam());
        dto.setDiagnosisStatus(prescription.getDiagnosisStatus());
        dto.setRightNavelPosition(prescription.getRightNavelPosition());
        dto.setLeftNavelPosition(prescription.getLeftNavelPosition());

        if (prescription.getMedicines() != null) {
            dto.setMedicines(prescription.getMedicines().stream().map(pm -> {
                PrescriptionMedicineDTO pmDTO = new PrescriptionMedicineDTO();
                pmDTO.setId(pm.getId());
                pmDTO.setMedicineId(pm.getMedicine().getId());
                pmDTO.setMedicineName(pm.getMedicine().getName());
                pmDTO.setDosage(pm.getDosage());
                pmDTO.setFrequency(pm.getFrequency());
                pmDTO.setDuration(pm.getDuration());
                pmDTO.setQuantity(pm.getQuantity());
                pmDTO.setAvailableStock(pm.getMedicine().getStockQuantity());
                pmDTO.setInstructions(pm.getInstructions());
                return pmDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
