package com.clinic.controller;

import com.clinic.dto.DietPlanDTO;
import com.clinic.service.DietPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diet-plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DietPlanController {

    private final DietPlanService dietPlanService;
    private final com.clinic.service.PdfService pdfService;

    @PostMapping
    public ResponseEntity<DietPlanDTO> createDietPlan(@Valid @RequestBody DietPlanDTO dietPlanDTO) {
        return new ResponseEntity<>(dietPlanService.createDietPlan(dietPlanDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DietPlanDTO> updateDietPlan(@PathVariable Long id, @Valid @RequestBody DietPlanDTO dietPlanDTO) {
        return ResponseEntity.ok(dietPlanService.updateDietPlan(id, dietPlanDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DietPlanDTO> getDietPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(dietPlanService.getDietPlanById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Page<DietPlanDTO>> getDietPlansByPatientId(
            @PathVariable Long patientId,
            @PageableDefault(sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(dietPlanService.getDietPlansByPatientId(patientId, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDietPlan(@PathVariable Long id) {
        dietPlanService.deleteDietPlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadDietPlanPdf(@PathVariable Long id) {
        try {
            byte[] pdfBytes = pdfService.generateDietPlanPdf(id);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDisposition(org.springframework.http.ContentDisposition.builder("attachment")
                    .filename("DietPlan_" + id + ".pdf")
                    .build());
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
