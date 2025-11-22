import api from './api';

export const uploadDocument = (patientId, file, description) => {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('file', file);
    if (description) {
        formData.append('description', description);
    }

    return api.post('/patient-documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getDocumentsByPatient = (patientId) => {
    return api.get(`/patient-documents/patient/${patientId}`);
};

export const deleteDocument = (id) => {
    return api.delete(`/patient-documents/${id}`);
};

export const renameDocument = (id, newFileName) => {
    return api.put(`/patient-documents/${id}?fileName=${encodeURIComponent(newFileName)}`);
};
