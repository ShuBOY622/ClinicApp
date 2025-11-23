import api from './api';

export const getFollowUps = (page = 0, size = 10) => {
    return api.get(`/follow-ups?page=${page}&size=${size}`);
};

export const getTodayFollowUps = () => {
    return api.get('/follow-ups/today');
};

export const getFollowUpsByPatient = (patientId) => {
    return api.get(`/follow-ups/patient/${patientId}`);
};

export const createFollowUp = (followUpData) => {
    return api.post('/follow-ups', followUpData);
};

export const updateFollowUpStatus = (id, status) => {
    return api.put(`/follow-ups/${id}/status?status=${status}`);
};

export const deleteFollowUp = (id) => {
    return api.delete(`/follow-ups/${id}`);
};

export const sendReminder = (followUpId) => {
    return api.post(`/follow-ups/${followUpId}/send-reminder`);
};

export const sendBulkReminders = (followUpIds) => {
    return api.post('/follow-ups/send-bulk-reminders', followUpIds);
};

export const getPendingReminders = () => {
    return api.get('/follow-ups/pending-reminders');
};
