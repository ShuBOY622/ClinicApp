package com.clinic.service;

import com.clinic.dto.FollowUpDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FollowUpService {
    FollowUpDTO createFollowUp(FollowUpDTO followUpDTO);
    FollowUpDTO updateFollowUp(Long id, FollowUpDTO followUpDTO);
    FollowUpDTO getFollowUpById(Long id);
    Page<FollowUpDTO> getFollowUpsByPatientId(Long patientId, Pageable pageable);
    Page<FollowUpDTO> getAllFollowUps(Pageable pageable);
    List<FollowUpDTO> getTodaysFollowUps();
    FollowUpDTO updateFollowUpStatus(Long id, String status);
    void deleteFollowUp(Long id);
    void sendReminders(); // Scheduled task
    
    // WhatsApp Reminder methods
    FollowUpDTO sendManualReminder(Long followUpId);
    List<FollowUpDTO> sendBulkReminders(List<Long> followUpIds);
    List<FollowUpDTO> getFollowUpsForReminder();
}
