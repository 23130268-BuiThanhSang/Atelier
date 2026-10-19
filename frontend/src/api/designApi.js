import axios from 'axios';

export const designApi = {
    getMyDesigns: (userId) =>
        axios.get('/api/v1/designs/my-designs', { params: { userId } }).then((res) => res.data),

    getById: (id) =>
        axios.get(`/api/v1/designs/${id}`).then((res) => res.data),

    saveDesign: (payload) =>
        axios.post('/api/v1/designs', payload).then((res) => res.data),

    toggleVisibility: (id) =>
        axios.patch(`/api/v1/designs/${id}/visibility`).then((res) => res.data),
};