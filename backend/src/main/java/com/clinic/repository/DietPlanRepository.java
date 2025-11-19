package com.clinic.repository;

import com.clinic.model.DietPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    Page<DietPlan> findByPatientId(Long patientId, Pageable pageable);
}
