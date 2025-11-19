import api from './api';

export const getPatients = (page = 0, size = 10) => {
    return api.get(`/patients?page=${page}&size=${size}`);
};

export const searchPatients = (keyword, page = 0, size = 10) => {
    return api.get(`/patients/search?keyword=${keyword}&page=${page}&size=${size}`);
};

export const getPatientById = (id) => {
    return api.get(`/patients/${id}`);
};

export const createPatient = (patientData) => {
    return api.post('/patients', patientData);
};

export const updatePatient = (id, patientData) => {
    return api.put(`/patients/${id}`, patientData);
};

export const deletePatient = (id) => {
    return api.delete(`/patients/${id}`);
};
