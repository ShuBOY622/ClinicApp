package com.clinic.service.impl;

import com.clinic.dto.PrescriptionDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.DietPlan;
import com.clinic.model.Patient;
import com.clinic.model.Prescription;
import com.clinic.repository.DietPlanRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.service.PdfService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Iterator;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DietPlanRepository dietPlanRepository;
    private final ObjectMapper objectMapper;

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

    @Override
    @Transactional(readOnly = true)
    public byte[] generateDietPlanPdf(Long dietPlanId) throws Exception {
        DietPlan dietPlan = dietPlanRepository.findById(dietPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Diet Plan not found"));

        String html = generateDietPlanHtml(dietPlan);
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

    private String loadImageAsBase64(String imagePath) throws IOException {
        try (InputStream is = getClass().getResourceAsStream(imagePath)) {
            if (is != null) {
                byte[] imageBytes = is.readAllBytes();
                return Base64.getEncoder().encodeToString(imageBytes);
            }
        }
        return "";
    }

    private String getHeaderImageHtml() throws IOException {
        String headerBase64 = loadImageAsBase64("/images/header.png");
        if (!headerBase64.isEmpty()) {
            return "<div class='header-image'><img src='data:image/png;base64," + headerBase64 + "' alt='Clinic Header' /></div>";
        }
        // Fallback to text header if image not found
        return "<div class='header'><h1>डॉ. रमेश तारख क्लिनिक</h1><h2>Dr. Ramesh Tarakh Clinic</h2><p class='contact'>संपर्क: +91 XXXXXXXXXX | पत्ता: [Clinic Address]</p></div>";
    }

    private String generateDietPlanHtml(DietPlan dietPlan) throws IOException {
        Patient patient = dietPlan.getPatient();
        JsonNode weeklyPlan = null;
        if (dietPlan.getWeeklyPlanJson() != null) {
            weeklyPlan = objectMapper.readTree(dietPlan.getWeeklyPlanJson());
        }

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'/>");
        html.append("<style>");
        html.append(getCssStyles());
        html.append("""
            .diet-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .diet-table th, .diet-table td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            .diet-table th { background-color: #f2f2f2; font-weight: bold; }
            .day-header { background-color: #e0f7fa; font-size: 14px; font-weight: bold; padding: 10px; margin-top: 20px; border: 1px solid #b2ebf2; border-radius: 5px; }
            .slot-header { font-weight: bold; color: #00695c; margin-top: 10px; margin-bottom: 5px; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 2px; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 11px; }
            .item-label { color: #555; }
            .item-value { font-weight: 500; }
            .page-break { page-break-before: always; }
        """);
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        
        // Header with image
        html.append(getHeaderImageHtml());
        html.append("<hr/>");

        // Patient Info
        html.append("<div class='section'>");
        html.append("<h3>आहार योजना / Diet Plan</h3>");
        html.append("<div class='row'><span class='label'>रुग्णाचे नाव:</span><span class='value'>").append(patient.getFirstName()).append(" ").append(patient.getLastName()).append("</span></div>");
        html.append("<div class='row'><span class='label'>कालावधी:</span><span class='value'>")
            .append(dietPlan.getStartDate()).append(" to ").append(dietPlan.getEndDate()).append("</span></div>");
        html.append("</div>");

        if (weeklyPlan != null) {
            String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
            String[] marathiDays = {"सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"};

            for (int i = 0; i < days.length; i++) {
                String day = days[i];
                JsonNode dayData = weeklyPlan.get(day.toLowerCase());
                
                if (dayData != null) {
                    if (i > 0) html.append("<div class='page-break'></div>");
                    
                    html.append("<div class='day-header'>").append(marathiDays[i]).append(" / ").append(day).append("</div>");
                    
                    // Slot 1: Morning 6 AM
                    renderSlot(html, dayData.get("slot1"), "१) सकाळी – ६ वाजता (Morning – 6 AM)", new String[][]{
                        {"time", "वेळ / Time"},
                        {"drinkName", "पेयाचे नाव / Drink name"},
                        {"quantity", "मात्रा (मिली/ग्रॅम) / Quantity"},
                        {"additional", "अतिरिक्त घटक / Additional"},
                        {"ghee", "तूप (ग्रॅम) / Ghee"}
                    });

                    // Slot 2: Morning 8 AM
                    renderSlot(html, dayData.get("slot2"), "२) सकाळी – ८ वाजता (Morning – 8 AM)", new String[][]{
                        {"time", "वेळ / Time"},
                        {"curry1Name", "भाजी १ नाव / Bhaji 1 Name"},
                        {"curry1Qty", "भाजी १ मात्रा / Bhaji 1 Qty"},
                        {"curry2Name", "भाजी २ नाव / Bhaji 2 Name"},
                        {"curry2Qty", "भाजी २ मात्रा / Bhaji 2 Qty"},
                        {"curry3Name", "भाजी ३ नाव / Bhaji 3 Name"},
                        {"curry3Qty", "भाजी ३ मात्रा / Bhaji 3 Qty"},
                        {"other", "इतर / Other"},
                        {"rotiType", "भाकरी प्रकार / Type of Roti"},
                        {"food", "अन्न / Food"}
                    });

                    // Slot 3: Afternoon 12 PM
                    renderSlot(html, dayData.get("slot3"), "३) दुपारी – १२ वाजता (Afternoon – 12 PM)", new String[][]{
                        {"time", "वेळ / Time"},
                        {"curry1Name", "भाजी १ नाव / Bhaji 1 Name"},
                        {"curry1Qty", "भाजी १ मात्रा / Bhaji 1 Qty"},
                        {"curry2Name", "भाजी २ नाव / Bhaji 2 Name"},
                        {"curry2Qty", "भाजी २ मात्रा / Bhaji 2 Qty"},
                        {"curry3Name", "भाजी ३ नाव / Bhaji 3 Name"},
                        {"curry3Qty", "भाजी ३ मात्रा / Bhaji 3 Qty"},
                        {"other", "इतर / Other"},
                        {"rotiType", "भाकरी प्रकार / Type of Roti"},
                        {"food", "अन्न / Food"}
                    });

                    // Slot 4: Evening 4 PM
                    renderSlot(html, dayData.get("slot4"), "४) सायंकाळी – ४ वाजता (Evening – 4 PM)", new String[][]{
                        {"time", "वेळ / Time"},
                        {"curry1Name", "भाजी १ नाव / Bhaji 1 Name"},
                        {"curry1Qty", "भाजी १ मात्रा / Bhaji 1 Qty"},
                        {"curry2Name", "भाजी २ नाव / Bhaji 2 Name"},
                        {"curry2Qty", "भाजी २ मात्रा / Bhaji 2 Qty"},
                        {"curry3Name", "भाजी ३ नाव / Bhaji 3 Name"},
                        {"curry3Qty", "भाजी ३ मात्रा / Bhaji 3 Qty"},
                        {"other", "इतर / Other"},
                        {"rotiType", "भाकरी प्रकार / Type of Roti"},
                        {"food", "अन्न / Food"}
                    });

                    // Slot 5: Night 8 PM
                    renderSlot(html, dayData.get("slot5"), "५) रात्री – ८ वाजता (Night – 8 PM)", new String[][]{
                        {"time", "वेळ / Time"},
                        {"curry1Name", "भाजी १ नाव / Bhaji 1 Name"},
                        {"curry1Qty", "भाजी १ मात्रा / Bhaji 1 Qty"},
                        {"curry2Name", "भाजी २ नाव / Bhaji 2 Name"},
                        {"curry2Qty", "भाजी २ मात्रा / Bhaji 2 Qty"},
                        {"curry3Name", "भाजी ३ नाव / Bhaji 3 Name"},
                        {"curry3Qty", "भाजी ३ मात्रा / Bhaji 3 Qty"},
                        {"other", "इतर / Other"},
                        {"rotiType", "भाकरी प्रकार / Type of Roti"},
                        {"food", "अन्न / Food"}
                    });
                }
            }
        }

        // Instructions
        if (dietPlan.getInstructions() != null && !dietPlan.getInstructions().isEmpty()) {
            html.append("<div class='section'>");
            html.append("<h3>सामान्य सूचना / General Instructions</h3>");
            html.append("<p>").append(dietPlan.getInstructions()).append("</p>");
            html.append("</div>");
        }

        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    private void renderSlot(StringBuilder html, JsonNode slotData, String title, String[][] fields) {
        if (slotData == null) return;
        
        // Check if slot has any data
        boolean hasData = false;
        for (String[] field : fields) {
            if (slotData.has(field[0]) && !slotData.get(field[0]).asText().isEmpty()) {
                hasData = true;
                break;
            }
        }
        
        if (!hasData) return;

        html.append("<div class='slot-section'>");
        html.append("<div class='slot-header'>").append(title).append("</div>");
        html.append("<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 10px;'>");
        
        for (String[] field : fields) {
            String key = field[0];
            String label = field[1];
            String value = slotData.has(key) ? slotData.get(key).asText() : "";
            
            if (!value.isEmpty()) {
                html.append("<div class='item-row'>");
                html.append("<span class='item-label'>").append(label).append(":</span>");
                html.append("<span class='item-value'>").append(value).append("</span>");
                html.append("</div>");
            }
        }
        html.append("</div>");
        html.append("</div>");
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
        
        // Header with image
        html.append(getHeaderImageHtml());
        
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
        
        // Header with image
        html.append(getHeaderImageHtml());
        
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
               p.getPatientMobileNumber() != null;
    }

    private String getCssStyles() throws IOException {
        String fontBase64 = "";
        try (InputStream is = getClass().getResourceAsStream("/fonts/Noto_Sans_Devanagari/static/NotoSansDevanagari-Regular.ttf")) {
            if (is != null) {
                byte[] fontBytes = is.readAllBytes();
                fontBase64 = Base64.getEncoder().encodeToString(fontBytes);
            }
        }

        return String.format("""
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
            .header-image {
                text-align: center;
                margin-bottom: 20px;
            }
            .header-image img {
                max-width: 100%%;
                height: auto;
                display: block;
                margin: 0 auto;
            }
            """, fontBase64);
    }
}
