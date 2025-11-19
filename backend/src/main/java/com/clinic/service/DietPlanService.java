package com.clinic.service;

import com.clinic.dto.DietPlanDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DietPlanService {
    DietPlanDTO createDietPlan(DietPlanDTO dietPlanDTO);
    DietPlanDTO updateDietPlan(Long id, DietPlanDTO dietPlanDTO);
    DietPlanDTO getDietPlanById(Long id);
    Page<DietPlanDTO> getDietPlansByPatientId(Long patientId, Pageable pageable);
    void deleteDietPlan(Long id);
}
