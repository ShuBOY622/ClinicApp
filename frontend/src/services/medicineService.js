import api from './api';

export const getMedicines = (page = 0, size = 10) => {
    return api.get(`/medicines?page=${page}&size=${size}`);
};

export const searchMedicines = (keyword, page = 0, size = 10) => {
    return api.get(`/medicines/search?keyword=${keyword}&page=${page}&size=${size}`);
};

export const getMedicineById = (id) => {
    return api.get(`/medicines/${id}`);
};

export const createMedicine = (medicineData) => {
    return api.post('/medicines', medicineData);
};

export const updateMedicine = (id, medicineData) => {
    return api.put(`/medicines/${id}`, medicineData);
};

export const deleteMedicine = (id) => {
    return api.delete(`/medicines/${id}`);
};
