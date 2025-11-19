package com.clinic.service.impl;

import com.clinic.dto.DietPlanDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.DietPlan;
import com.clinic.model.Patient;
import com.clinic.repository.DietPlanRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.service.DietPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DietPlanServiceImpl implements DietPlanService {

    private final DietPlanRepository dietPlanRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public DietPlanDTO createDietPlan(DietPlanDTO dietPlanDTO) {
        Patient patient = patientRepository.findById(dietPlanDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        DietPlan dietPlan = mapToEntity(dietPlanDTO);
        dietPlan.setPatient(patient);
        
        DietPlan savedDietPlan = dietPlanRepository.save(dietPlan);
        return mapToDTO(savedDietPlan);
    }

    @Override
    @Transactional
    public DietPlanDTO updateDietPlan(Long id, DietPlanDTO dietPlanDTO) {
        DietPlan dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diet Plan not found"));

        dietPlan.setBreakfast(dietPlanDTO.getBreakfast());
        dietPlan.setLunch(dietPlanDTO.getLunch());
        dietPlan.setDinner(dietPlanDTO.getDinner());
        dietPlan.setInstructions(dietPlanDTO.getInstructions());
        dietPlan.setStartDate(dietPlanDTO.getStartDate());
        dietPlan.setEndDate(dietPlanDTO.getEndDate());

        DietPlan updatedDietPlan = dietPlanRepository.save(dietPlan);
        return mapToDTO(updatedDietPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public DietPlanDTO getDietPlanById(Long id) {
        DietPlan dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diet Plan not found"));
        return mapToDTO(dietPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DietPlanDTO> getDietPlansByPatientId(Long patientId, Pageable pageable) {
        return dietPlanRepository.findByPatientId(patientId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public void deleteDietPlan(Long id) {
        if (!dietPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Diet Plan not found");
        }
        dietPlanRepository.deleteById(id);
    }

    private DietPlanDTO mapToDTO(DietPlan dietPlan) {
        DietPlanDTO dto = new DietPlanDTO();
        dto.setId(dietPlan.getId());
        dto.setPatientId(dietPlan.getPatient().getId());
        dto.setPatientName(dietPlan.getPatient().getFirstName() + " " + dietPlan.getPatient().getLastName());
        dto.setBreakfast(dietPlan.getBreakfast());
        dto.setLunch(dietPlan.getLunch());
        dto.setDinner(dietPlan.getDinner());
        dto.setInstructions(dietPlan.getInstructions());
        dto.setStartDate(dietPlan.getStartDate());
        dto.setEndDate(dietPlan.getEndDate());
        return dto;
    }

    private DietPlan mapToEntity(DietPlanDTO dto) {
        DietPlan dietPlan = new DietPlan();
        dietPlan.setBreakfast(dto.getBreakfast());
        dietPlan.setLunch(dto.getLunch());
        dietPlan.setDinner(dto.getDinner());
        dietPlan.setInstructions(dto.getInstructions());
        dietPlan.setStartDate(dto.getStartDate());
        dietPlan.setEndDate(dto.getEndDate());
        return dietPlan;
    }
}
