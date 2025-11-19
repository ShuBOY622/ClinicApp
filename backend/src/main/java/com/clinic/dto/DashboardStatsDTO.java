package com.clinic.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long totalPatients;
    private long todayAppointments;
    private long pendingFollowUps;
}
