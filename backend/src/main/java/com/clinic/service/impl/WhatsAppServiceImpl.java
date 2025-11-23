package com.clinic.service.impl;

import com.clinic.model.FollowUp;
import com.clinic.model.Patient;
import com.clinic.repository.FollowUpRepository;
import com.clinic.service.WhatsAppService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppServiceImpl implements WhatsAppService {

    private final FollowUpRepository followUpRepository;

    @Value("${twilio.whatsapp-number}")
    private String twilioWhatsAppNumber;

    @Value("${whatsapp.reminder.clinic-name}")
    private String clinicName;

    @Value("${whatsapp.reminder.enabled}")
    private boolean reminderEnabled;

    @Override
    public boolean sendReminderMessage(FollowUp followUp) {
        if (!reminderEnabled) {
            log.warn("WhatsApp reminders are disabled in configuration");
            return false;
        }

        try {
            Patient patient = followUp.getPatient();
            String patientPhone = patient.getPhone();

            // Validate phone number format
            if (!patientPhone.startsWith("+")) {
                log.error("Invalid phone number format for patient {}: {}. Must start with country code (+)", 
                    patient.getId(), patientPhone);
                updateReminderStatus(followUp, "FAILED", "Invalid phone number format. Must include country code (+)");
                return false;
            }

            String messageBody = formatReminderMessage(followUp);
            
            // Format phone number for WhatsApp
            String whatsappPatientNumber = "whatsapp:" + patientPhone;

            log.info("Sending WhatsApp reminder to {} ({})", patient.getFirstName(), whatsappPatientNumber);

            Message message = Message.creator(
                    new PhoneNumber(whatsappPatientNumber),
                    new PhoneNumber(twilioWhatsAppNumber),
                    messageBody
            ).create();

            log.info("WhatsApp message sent successfully. SID: {}, Status: {}", 
                message.getSid(), message.getStatus());

            // Update follow-up with success status
            followUp.setReminderSent(true);
            followUp.setReminderSentAt(LocalDateTime.now());
            followUp.setReminderStatus("SENT");
            followUp.setTwilioMessageSid(message.getSid());
            followUp.setReminderError(null);
            followUpRepository.save(followUp);

            return true;

        } catch (Exception e) {
            log.error("Failed to send WhatsApp reminder for follow-up {}: {}", 
                followUp.getId(), e.getMessage(), e);
            updateReminderStatus(followUp, "FAILED", e.getMessage());
            return false;
        }
    }

    @Override
    public String formatReminderMessage(FollowUp followUp) {
        Patient patient = followUp.getPatient();
        String patientName = patient.getFirstName() + " " + patient.getLastName();
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy 'at' hh:mm a");
        String formattedDate = followUp.getFollowUpDate().format(dateFormatter);
        
        String reason = followUp.getReason() != null && !followUp.getReason().isEmpty() 
            ? followUp.getReason() 
            : "General checkup";

        return String.format(
            "Hello %s, this is a reminder for your follow-up appointment on %s at %s. Reason: %s. Please contact us if you need to reschedule.",
            patientName,
            formattedDate,
            clinicName,
            reason
        );
    }

    private void updateReminderStatus(FollowUp followUp, String status, String error) {
        followUp.setReminderStatus(status);
        followUp.setReminderError(error);
        followUp.setReminderSentAt(LocalDateTime.now());
        followUpRepository.save(followUp);
    }
}
