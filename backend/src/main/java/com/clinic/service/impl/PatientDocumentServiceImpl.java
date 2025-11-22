package com.clinic.service.impl;

import com.clinic.dto.PatientDocumentDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.Patient;
import com.clinic.model.PatientDocument;
import com.clinic.repository.PatientDocumentRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.service.FileStorageService;
import com.clinic.service.PatientDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientDocumentServiceImpl implements PatientDocumentService {

    @Autowired
    private PatientDocumentRepository patientDocumentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public PatientDocumentDTO uploadDocument(Long patientId, MultipartFile file, String description) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(fileName)
                .toUriString();

        PatientDocument document = new PatientDocument();
        document.setFileName(fileName);
        document.setFileType(file.getContentType());
        document.setFileDownloadUri(fileDownloadUri);
        document.setDescription(description);
        document.setPatient(patient);

        PatientDocument savedDoc = patientDocumentRepository.save(document);
        return mapToDTO(savedDoc);
    }

    @Override
    public List<PatientDocumentDTO> getDocumentsByPatientId(Long patientId) {
        List<PatientDocument> documents = patientDocumentRepository.findByPatientId(patientId);
        return documents.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public void deleteDocument(Long id) {
        PatientDocument document = patientDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        patientDocumentRepository.delete(document);
    }

    @Override
    public PatientDocumentDTO updateDocument(Long id, String newFileName) {
        PatientDocument document = patientDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        document.setFileName(newFileName);
        PatientDocument savedDoc = patientDocumentRepository.save(document);
        return mapToDTO(savedDoc);
    }

    @Override
    public PatientDocumentDTO getDocumentById(Long id) {
        PatientDocument document = patientDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        return mapToDTO(document);
    }

    @Override
    public org.springframework.core.io.Resource downloadDocument(Long id) {
        PatientDocument document = patientDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        
        // Extract original filename from URI
        // URI format: .../api/files/download/{fileName}
        String uri = document.getFileDownloadUri();
        String originalFileName = uri.substring(uri.lastIndexOf("/") + 1);
        
        return fileStorageService.loadFileAsResource(originalFileName);
    }

    private PatientDocumentDTO mapToDTO(PatientDocument document) {
        PatientDocumentDTO dto = new PatientDocumentDTO();
        dto.setId(document.getId());
        dto.setFileName(document.getFileName());
        dto.setFileType(document.getFileType());
        // Use the new download endpoint that respects the renamed file
        String downloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/patient-documents/")
                .path(document.getId().toString())
                .path("/download")
                .toUriString();
        dto.setFileDownloadUri(downloadUri);
        dto.setDescription(document.getDescription());
        dto.setPatientId(document.getPatient().getId());
        return dto;
    }
}
