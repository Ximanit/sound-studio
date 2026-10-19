import axios from 'axios';

const api = axios.create({
	baseURL: 'https://sound-studio-zpou.onrender.com/api/',
	headers: { 'Content-Type': 'application/json' },
});

export const createApi = (resource) => ({
	getAll: () => api.get(`/${resource}`).then((r) => r.data),
	getById: (id) => api.get(`/${resource}/${id}`).then((r) => r.data),
	create: (data) => api.post(`/${resource}`, data).then((r) => r.data),
	update: (id, data) => api.put(`/${resource}/${id}`, data).then((r) => r.data),
	remove: (id) => api.delete(`/${resource}/${id}`).then((r) => r.data),
});

export const servicesApi = createApi('services');
export const roomsApi = createApi('rooms');
export const employeesApi = createApi('employees');
export const catalogApi = createApi('catalog');
export const clientsApi = createApi('clients');
export const equipmentApi = createApi('equipment');
export const dealsApi = createApi('deals');
export const provisionsApi = createApi('provisions');

export default api;
