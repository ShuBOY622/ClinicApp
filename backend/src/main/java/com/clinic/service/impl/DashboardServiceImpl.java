package com.clinic.service.impl;

import com.clinic.dto.DashboardStatsDTO;
import com.clinic.model.FollowUp;
import com.clinic.repository.FollowUpRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository; // Assuming appointments/prescriptions are linked

    @Autowired
    private FollowUpRepository followUpRepository;

    @Override
    public DashboardStatsDTO getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalPatients(patientRepository.count());
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        
        List<FollowUp> todayFollowUps = followUpRepository.findFollowUpsBetween(startOfDay, endOfDay);
        stats.setTodayAppointments(todayFollowUps.size());

        List<FollowUp> pendingFollowUps = followUpRepository.findByStatus("PENDING");
        stats.setPendingFollowUps(pendingFollowUps.size());
        
        return stats;
    }
}
