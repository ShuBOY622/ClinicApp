package com.clinic.service;

import com.clinic.model.FollowUp;

public interface WhatsAppService {
    
    /**
     * Send a WhatsApp reminder message for a follow-up appointment
     * @param followUp The follow-up appointment details
     * @return true if message was sent successfully, false otherwise
     */
    boolean sendReminderMessage(FollowUp followUp);
    
    /**
     * Format the reminder message with patient and appointment details
     * @param followUp The follow-up appointment details
     * @return Formatted message string
     */
    String formatReminderMessage(FollowUp followUp);
}
