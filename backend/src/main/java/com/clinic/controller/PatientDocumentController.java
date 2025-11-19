package com.clinic.controller;

import com.clinic.dto.PatientDocumentDTO;
import com.clinic.service.PatientDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/patient-documents")
public class PatientDocumentController {

    @Autowired
    private PatientDocumentService patientDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<PatientDocumentDTO> uploadDocument(
            @RequestParam("patientId") Long patientId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        
        PatientDocumentDTO document = patientDocumentService.uploadDocument(patientId, file, description);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PatientDocumentDTO>> getDocumentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientDocumentService.getDocumentsByPatientId(patientId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        patientDocumentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
