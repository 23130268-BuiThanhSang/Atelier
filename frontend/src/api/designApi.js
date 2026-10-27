import axios from 'axios';

export const designApi = {
    getMyDesigns: (userId) => {
        const url = userId ? `/api/v1/designs/my-designs?userId=${userId}` : '/api/v1/designs/my-designs';
        return axios.get(url).then((res) => res.data);
    },

    getById: (id) =>
        axios.get(`/api/v1/designs/${id}`).then((res) => res.data),

    saveDesign: (payload) =>
        axios.post('/api/v1/designs', payload).then((res) => res.data),

    toggleVisibility: (id) =>
        axios.post(`/api/v1/designs/${id}/visibility`).then((res) => res.data),

    getPublicDesigns: () =>
        axios.get('/api/v1/designs/public').then((res) => res.data),

    deleteDesign: (designId, userId) =>
        axios.delete(`/api/v1/designs/${designId}${userId ? `?userId=${userId}` : ''}`).then(res => res.data),
};