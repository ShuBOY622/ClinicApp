package com.clinic.dto;

import lombok.Data;

@Data
public class PatientDocumentDTO {
    private Long id;
    private String fileName;
    private String fileType;
    private String description;
    private String fileDownloadUri;
    private Long patientId;
}
