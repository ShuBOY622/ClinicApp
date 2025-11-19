package com.clinic.repository;

import com.clinic.model.FollowUp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    Page<FollowUp> findByPatientId(Long patientId, Pageable pageable);
    
    @Query("SELECT f FROM FollowUp f WHERE f.followUpDate BETWEEN :start AND :end")
    List<FollowUp> findFollowUpsBetween(LocalDateTime start, LocalDateTime end);
    
    List<FollowUp> findByStatus(String status);
}
