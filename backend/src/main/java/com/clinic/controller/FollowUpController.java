package com.clinic.controller;

import com.clinic.dto.FollowUpDTO;
import com.clinic.service.FollowUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FollowUpController {

    private final FollowUpService followUpService;

    @PostMapping
    public ResponseEntity<FollowUpDTO> createFollowUp(@Valid @RequestBody FollowUpDTO followUpDTO) {
        return new ResponseEntity<>(followUpService.createFollowUp(followUpDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUpDTO> updateFollowUp(@PathVariable Long id, @Valid @RequestBody FollowUpDTO followUpDTO) {
        return ResponseEntity.ok(followUpService.updateFollowUp(id, followUpDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FollowUpDTO> getFollowUpById(@PathVariable Long id) {
        return ResponseEntity.ok(followUpService.getFollowUpById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Page<FollowUpDTO>> getFollowUpsByPatientId(
            @PathVariable Long patientId,
            @PageableDefault(sort = "followUpDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(followUpService.getFollowUpsByPatientId(patientId, pageable));
    }

    @GetMapping
    public ResponseEntity<Page<FollowUpDTO>> getAllFollowUps(
            @PageableDefault(sort = "followUpDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(followUpService.getAllFollowUps(pageable));
    }

    @GetMapping("/today")
    public ResponseEntity<List<FollowUpDTO>> getTodaysFollowUps() {
        return ResponseEntity.ok(followUpService.getTodaysFollowUps());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FollowUpDTO> updateFollowUpStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(followUpService.updateFollowUpStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowUp(@PathVariable Long id) {
        followUpService.deleteFollowUp(id);
        return ResponseEntity.noContent().build();
    }
}
