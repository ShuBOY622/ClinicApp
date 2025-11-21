package com.clinic.service.impl;

import com.clinic.dto.FollowUpDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.FollowUp;
import com.clinic.model.Patient;
import com.clinic.repository.FollowUpRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowUpServiceImpl implements FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public FollowUpDTO createFollowUp(FollowUpDTO followUpDTO) {
        Patient patient = patientRepository.findById(followUpDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        FollowUp followUp = mapToEntity(followUpDTO);
        followUp.setPatient(patient);
        followUp.setStatus("PENDING");
        
        FollowUp savedFollowUp = followUpRepository.save(followUp);
        return mapToDTO(savedFollowUp);
    }

    @Override
    @Transactional
    public FollowUpDTO updateFollowUp(Long id, FollowUpDTO followUpDTO) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found"));

        followUp.setFollowUpDate(followUpDTO.getFollowUpDate());
        followUp.setReason(followUpDTO.getReason());
        if (followUpDTO.getStatus() != null) {
            followUp.setStatus(followUpDTO.getStatus());
        }

        FollowUp updatedFollowUp = followUpRepository.save(followUp);
        return mapToDTO(updatedFollowUp);
    }

    @Override
    @Transactional(readOnly = true)
    public FollowUpDTO getFollowUpById(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found"));
        return mapToDTO(followUp);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowUpDTO> getFollowUpsByPatientId(Long patientId, Pageable pageable) {
        return followUpRepository.findByPatientId(patientId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowUpDTO> getAllFollowUps(Pageable pageable) {
        return followUpRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpDTO> getTodaysFollowUps() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return followUpRepository.findFollowUpsBetween(startOfDay, endOfDay).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FollowUpDTO updateFollowUpStatus(Long id, String status) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Follow-up not found"));
        
        followUp.setStatus(status);
        FollowUp updatedFollowUp = followUpRepository.save(followUp);
        return mapToDTO(updatedFollowUp);
    }

    @Override
    @Transactional
    public void deleteFollowUp(Long id) {
        if (!followUpRepository.existsById(id)) {
            throw new ResourceNotFoundException("Follow-up not found");
        }
        followUpRepository.deleteById(id);
    }

    @Override
    @Scheduled(cron = "0 0 9 * * *") // Run every day at 9 AM
    public void sendReminders() {
        log.info("Sending follow-up reminders...");
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        List<FollowUp> todaysFollowUps = followUpRepository.findFollowUpsBetween(startOfDay, endOfDay);
        
        for (FollowUp followUp : todaysFollowUps) {
            if (!followUp.isReminderSent()) {
                // Mock sending SMS/WhatsApp
                log.info("Sending reminder to patient: {} at {}", followUp.getPatient().getFirstName(), followUp.getPatient().getPhone());
                followUp.setReminderSent(true);
                followUpRepository.save(followUp);
            }
        }
    }

    private FollowUpDTO mapToDTO(FollowUp followUp) {
        FollowUpDTO dto = new FollowUpDTO();
        dto.setId(followUp.getId());
        dto.setPatientId(followUp.getPatient().getId());
        dto.setPatientName(followUp.getPatient().getFirstName() + " " + followUp.getPatient().getLastName());
        dto.setPatientPhone(followUp.getPatient().getPhone());
        dto.setFollowUpDate(followUp.getFollowUpDate());
        dto.setReason(followUp.getReason());
        dto.setStatus(followUp.getStatus());
        dto.setReminderSent(followUp.isReminderSent());
        return dto;
    }

    private FollowUp mapToEntity(FollowUpDTO dto) {
        FollowUp followUp = new FollowUp();
        followUp.setFollowUpDate(dto.getFollowUpDate());
        followUp.setReason(dto.getReason());
        followUp.setStatus(dto.getStatus());
        return followUp;
    }
}
