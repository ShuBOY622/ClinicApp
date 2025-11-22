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

export const downloadDietPlan = (id) => {
    return api.get(`/diet-plans/${id}/pdf`, {
        responseType: 'blob',
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DietPlan_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
};
