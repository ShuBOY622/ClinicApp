import api from './api';

export const getPrescriptionsByPatient = (patientId, page = 0, size = 10) => {
    return api.get(`/prescriptions/patient/${patientId}?page=${page}&size=${size}`);
};

export const getPrescriptionById = (id) => {
    return api.get(`/prescriptions/${id}`);
};

export const createPrescription = (prescriptionData) => {
    return api.post('/prescriptions', prescriptionData);
};

export const deletePrescription = (id) => {
    return api.delete(`/prescriptions/${id}`);
};

export const downloadPrescriptionPdf = async (prescriptionId) => {
    const response = await api.get(`/prescriptions/${prescriptionId}/pdf`, {
        responseType: 'blob'
    });
    return response.data;
};
