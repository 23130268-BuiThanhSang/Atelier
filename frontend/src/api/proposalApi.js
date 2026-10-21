import axios from 'axios';

export const proposalApi = {
    getDetailForDesigner: (designId, userId) =>
        axios.get(`/api/v1/proposals/design/${designId}${userId ? `?userId=${userId}` : ''}`).then(res => res.data),

    toggleStatus: (payload, userId) =>
        axios.post(`/api/v1/proposals/toggle-status${userId ? `?userId=${userId}` : ''}`, payload).then(res => res.data),

    getOpenRequestsForProducer: (userId) =>
        axios.get(`/api/v1/proposals/producer/open-requests${userId ? `?userId=${userId}` : ''}`).then(res => res.data),

    submitQuotation: (payload, userId) =>
        axios.post(`/api/v1/proposals/producer/quote${userId ? `?userId=${userId}` : ''}`, payload).then(res => res.data),

    getMyRequests: (userId) =>
        axios.get(`/api/v1/proposals/my-requests${userId ? `?userId=${userId}` : ''}`).then(res => res.data),
};