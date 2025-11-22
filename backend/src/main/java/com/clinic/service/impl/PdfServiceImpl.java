package com.clinic.service.impl;

import com.clinic.dto.PrescriptionDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.Patient;
import com.clinic.model.Prescription;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.service.PdfService;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePrescriptionPdf(Long prescriptionId) throws Exception {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        // Force initialization of lazy-loaded entities
        Patient patient = prescription.getPatient();
        patient.getFirstName(); // Trigger lazy load
        if (prescription.getMedicines() != null) {
            prescription.getMedicines().size(); // Trigger lazy load
        }

        String html = generateHtmlContent(prescription);
        return generatePdfFromHtml(html);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generateConsentFormPdf(Long patientId) throws Exception {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        String html = generateConsentHtml(patient);
        return generatePdfFromHtml(html);
    }

    private byte[] generatePdfFromHtml(String html) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            Page page = browser.newPage();
            page.setContent(html);
            
            byte[] pdf = page.pdf(new Page.PdfOptions()
                .setFormat("A4")
                .setPrintBackground(true));
                
            browser.close();
            return pdf;
        }
    }

    private String generateConsentHtml(Patient patient) throws IOException {
        // Calculate age
        int age = 0;
        if (patient.getDateOfBirth() != null) {
            age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
        }

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'/>");
        html.append("<style>");
        html.append(getCssStyles());
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>डॉ. रमेश तारख क्लिनिक</h1>");
        html.append("<h2>Dr. Ramesh Tarakh Clinic</h2>");
        html.append("<p class='contact'>संपर्क: +91 XXXXXXXXXX | पत्ता: [Clinic Address]</p>");
        html.append("</div>");
        
        html.append("<hr/>");

        // Title
        html.append("<div class='consent-title'>संमती पत्र</div>");

        // Patient Details
        html.append("<div class='section'>");
        html.append("<div class='row'><span class='label'>रुग्णाचे नाव:</span><span class='value'>").append(patient.getFirstName()).append(" ").append(patient.getLastName()).append("</span></div>");
        html.append("<div class='row'><span class='label'>वय:</span><span class='value'>").append(age).append(" वर्षे</span>");
        html.append("<span class='label ml'>लिंग:</span><span class='value'>").append(patient.getGender()).append("</span></div>");
        if (patient.getAddress() != null) {
            html.append("<div class='row'><span class='label'>पत्ता:</span><span class='value'>").append(patient.getAddress()).append("</span></div>");
        }
        html.append("</div>");

        // Consent Text
        html.append("<div class='consent-text'>");
        html.append("<p>असे लिहून देतो की, मला गुदद्वार विकार असून माझी गुदद्वार परीक्षा करण्यास आणि त्यानुसार पुढील उपचार करण्यास माझी सहमती असून त्याबाबत माझी कोणत्याही प्रकारची तक्रार नाही.</p>");
        html.append("<p>मी माझ्या जबाबदारीवर समजून सांगण्यात आलेल्या प्रमाणे गुदद्वार परीक्षणास व पुढील तपासणी आणि उपचारास पूर्णतः संमती देतो आहे.</p>");
        html.append("<p>करिता ही लेखी संमती.</p>");
        html.append("</div>");

        // Footer
        html.append("<div class='footer-grid'>");
        html.append("<div>दिनांक: _______________</div>");
        html.append("<div>वेळ: _______________</div>");
        html.append("<div>ठिकाण: _______________</div>");
        html.append("</div>");

        // Signature
        html.append("<div class='signature'>");
        html.append("<div class='signature-line'>रुग्णाची सही / Patient's Signature</div>");
        html.append("</div>");

        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    private String generateHtmlContent(Prescription prescription) throws IOException {
        Patient patient = prescription.getPatient();
        
        // Calculate age
        int age = 0;
        if (patient.getDateOfBirth() != null) {
            age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
        }

        // Format date
        String prescriptionDate = "";
        if (prescription.getPrescriptionDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            prescriptionDate = prescription.getPrescriptionDate().toLocalDate().format(formatter);
        }

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'/>");
        html.append("<style>");
        html.append(getCssStyles());
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        
        // Header
        html.append("<div class='header'>");
        html.append("<h1>डॉ. रमेश तारख क्लिनिक</h1>");
        html.append("<h2>Dr. Ramesh Tarakh Clinic</h2>");
        html.append("<p class='contact'>संपर्क: +91 XXXXXXXXXX | पत्ता: [Clinic Address]</p>");
        html.append("</div>");
        
        html.append("<hr/>");
        
        // Date
        html.append("<div class='date'>दिनांक / Date: ").append(prescriptionDate).append("</div>");
        
        // Patient Info
        html.append("<div class='section'>");
        html.append("<h3>रुग्णाची माहिती / Patient Information</h3>");
        html.append("<div class='row'>");
        html.append("<span class='label'>रुग्णाचे नाव / Name:</span>");
        html.append("<span class='value'>").append(patient.getFirstName()).append(" ").append(patient.getLastName()).append("</span>");
        html.append("</div>");
        html.append("<div class='row'>");
        html.append("<span class='label'>वय / Age:</span>");
        html.append("<span class='value'>").append(age).append(" वर्षे / years</span>");
        html.append("<span class='label ml'>लिंग / Gender:</span>");
        html.append("<span class='value'>").append(patient.getGender()).append("</span>");
        html.append("</div>");
        html.append("</div>");

        // Basic Information
        if (hasBasicInfo(prescription)) {
            html.append("<div class='section'>");
            html.append("<h3>मूलभूत माहिती / Basic Information</h3>");
            if (prescription.getPatientAddress() != null) {
                html.append("<div class='row'><span class='label'>पत्ता / Address:</span><span class='value'>").append(prescription.getPatientAddress()).append("</span></div>");
            }
            if (prescription.getPatientOccupation() != null) {
                html.append("<div class='row'><span class='label'>व्यवसाय / Occupation:</span><span class='value'>").append(prescription.getPatientOccupation()).append("</span></div>");
            }
            if (prescription.getPatientMobileNumber() != null) {
                html.append("<div class='row'><span class='label'>मोबाइल / Mobile:</span><span class='value'>").append(prescription.getPatientMobileNumber()).append("</span></div>");
            }
            if (prescription.getBodyType() != null) {
                html.append("<div class='row'><span class='label'>प्रकृती / Body Type:</span><span class='value'>").append(prescription.getBodyType()).append("</span></div>");
            }
            if (prescription.getFavouriteTaste() != null) {
                html.append("<div class='row'><span class='label'>आवडता रस / Favourite Taste:</span><span class='value'>").append(prescription.getFavouriteTaste()).append("</span></div>");
            }
            html.append("</div>");
        }

        // Daily Functions
        if (hasDailyFunctions(prescription)) {
            html.append("<div class='section'>");
            html.append("<h3>दैनंदिन कार्ये / Daily Functions</h3>");
            if (prescription.getUrineDetails() != null) {
                html.append("<div class='row'><span class='label'>मूत्र / Urine:</span><span class='value'>").append(prescription.getUrineDetails()).append("</span></div>");
            }
            if (prescription.getStoolDetails() != null) {
                html.append("<div class='row'><span class='label'>दिष्ट/शौच / Stool:</span><span class='value'>").append(prescription.getStoolDetails()).append("</span></div>");
            }
            if (prescription.getSleepDetails() != null) {
                html.append("<div class='row'><span class='label'>निद्रा / Sleep:</span><span class='value'>").append(prescription.getSleepDetails()).append("</span></div>");
            }
            if (prescription.getSweatDetails() != null) {
                html.append("<div class='row'><span class='label'>घाम / Sweat:</span><span class='value'>").append(prescription.getSweatDetails()).append("</span></div>");
            }
            if (prescription.getMenstrualDetails() != null) {
                html.append("<div class='row'><span class='label'>रज / Menstrual:</span><span class='value'>").append(prescription.getMenstrualDetails()).append("</span></div>");
            }
            html.append("</div>");
        }

        // Medical History
        if (hasMedicalHistory(prescription)) {
            html.append("<div class='section'>");
            html.append("<h3>वैद्यकीय इतिहास / Medical History</h3>");
            if (prescription.getPastHistory() != null) {
                html.append("<div class='row full'><span class='label'>पूर्व इतिहास / Past History:</span><span class='value'>").append(prescription.getPastHistory()).append("</span></div>");
            }
            if (prescription.getPreviousTreatment() != null) {
                html.append("<div class='row full'><span class='label'>पूर्व उपचार / Previous Treatment:</span><span class='value'>").append(prescription.getPreviousTreatment()).append("</span></div>");
            }
            if (prescription.getPreviousMedication() != null) {
                html.append("<div class='row full'><span class='label'>पूर्व औषधी / Previous Medication:</span><span class='value'>").append(prescription.getPreviousMedication()).append("</span></div>");
            }
            if (prescription.getDailyRoutine() != null) {
                html.append("<div class='row full'><span class='label'>दिनचर्या / Daily Routine:</span><span class='value'>").append(prescription.getDailyRoutine()).append("</span></div>");
            }
            html.append("</div>");
        }

        // Current Complaints
        if (prescription.getCurrentComplaints() != null) {
            html.append("<div class='section'>");
            html.append("<h3>सध्याच्या तक्रारी / Current Complaints</h3>");
            html.append("<p>").append(prescription.getCurrentComplaints()).append("</p>");
            html.append("</div>");
        }

        // Diagnosis
        if (prescription.getDiagnosis() != null) {
            html.append("<div class='section'>");
            html.append("<h3>सदयोव्याधी लक्षणे / Current Symptoms</h3>");
            html.append("<p>").append(prescription.getDiagnosis()).append("</p>");
            html.append("</div>");
        }

        // Medicines
        html.append("<div class='section'>");
        html.append("<h3>औषधी योजना / Medicine Plan</h3>");
        if (prescription.getMedicines() != null && !prescription.getMedicines().isEmpty()) {
            int index = 1;
            for (var med : prescription.getMedicines()) {
                html.append("<div class='medicine-item'>")
                    .append(index++).append(". ")
                    .append(med.getMedicine().getName()).append(" - ")
                    .append(med.getDosage()).append(" - ")
                    .append(med.getFrequency()).append(" - ")
                    .append(med.getDuration())
                    .append("</div>");
            }
        }
        html.append("</div>");

        // Notes
        if (prescription.getNotes() != null) {
            html.append("<div class='section'>");
            html.append("<h3>टिपा / Notes</h3>");
            html.append("<p>").append(prescription.getNotes()).append("</p>");
            html.append("</div>");
        }

        // Signature
        html.append("<div class='signature'>");
        html.append("<div class='signature-line'>डॉक्टरांची सही / Doctor's Signature</div>");
        html.append("</div>");

        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    private boolean hasBasicInfo(Prescription p) {
        return p.getPatientAddress() != null || p.getPatientOccupation() != null || 
               p.getPatientMobileNumber() != null || p.getBodyType() != null || p.getFavouriteTaste() != null;
    }

    private boolean hasDailyFunctions(Prescription p) {
        return p.getUrineDetails() != null || p.getStoolDetails() != null || 
               p.getSleepDetails() != null || p.getSweatDetails() != null || p.getMenstrualDetails() != null;
    }

    private boolean hasMedicalHistory(Prescription p) {
        return p.getPastHistory() != null || p.getPreviousTreatment() != null || 
               p.getPreviousMedication() != null || p.getDailyRoutine() != null;
    }

    private String getCssStyles() throws IOException {
        String fontBase64 = "";
        try (InputStream is = getClass().getResourceAsStream("/fonts/Noto_Sans_Devanagari/static/NotoSansDevanagari-Regular.ttf")) {
            if (is != null) {
                byte[] fontBytes = is.readAllBytes();
                fontBase64 = Base64.getEncoder().encodeToString(fontBytes);
            }
        }

        return """
            @font-face {
                font-family: 'NotoSansDevanagari';
                src: url(data:font/ttf;base64,%s) format('truetype');
            }
            @page { 
                size: A4; 
                margin: 0; 
            }
            body { 
                font-family: 'NotoSansDevanagari', sans-serif; 
                font-size: 12px;
                line-height: 1.4;
                margin: 0;
                padding: 20mm;
            }
            .header { 
                text-align: center; 
                margin-bottom: 20px; 
            }
            h1 { 
                font-size: 24px; 
                margin: 0; 
                color: #2c3e50;
            }
            h2 { 
                font-size: 18px; 
                margin: 5px 0; 
                color: #7f8c8d;
            }
            .contact {
                font-size: 10px;
                color: #555;
            }
            .date {
                text-align: right;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .section { 
                margin-bottom: 15px; 
            }
            h3 { 
                font-size: 14px; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 5px; 
                margin-bottom: 10px;
                color: #2c3e50;
            }
            .row { 
                margin-bottom: 5px; 
                display: block;
            }
            .label { 
                font-weight: bold; 
                color: #555;
                margin-right: 5px;
            }
            .value {
                color: #000;
            }
            .ml {
                margin-left: 20px;
            }
            .full {
                display: block;
            }
            .medicine-item {
                margin-bottom: 5px;
                padding-left: 10px;
            }
            .signature {
                margin-top: 50px;
                text-align: right;
            }
            .signature-line {
                display: inline-block;
                border-top: 1px solid #000;
                padding-top: 5px;
                width: 200px;
                text-align: center;
            }
            .consent-title {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                text-decoration: underline;
            }
            .consent-text {
                margin-top: 20px;
                margin-bottom: 40px;
                font-size: 14px;
                line-height: 1.8;
                text-align: justify;
            }
            .consent-text p {
                margin-bottom: 15px;
            }
            .footer-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 20px;
                margin-top: 40px;
                margin-bottom: 40px;
            }
            """.formatted(fontBase64);
    }
}
