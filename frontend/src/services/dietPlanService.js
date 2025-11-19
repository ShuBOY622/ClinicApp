import api from './api';

export const getDietPlansByPatient = (patientId) => {
    return api.get(`/diet-plans/patient/${patientId}`);
};

export const getDietPlanById = (id) => {
    return api.get(`/diet-plans/${id}`);
};

export const createDietPlan = (dietPlanData) => {
    return api.post('/diet-plans', dietPlanData);
};

export const updateDietPlan = (id, dietPlanData) => {
    return api.put(`/diet-plans/${id}`, dietPlanData);
};

export const deleteDietPlan = (id) => {
    return api.delete(`/diet-plans/${id}`);
};
