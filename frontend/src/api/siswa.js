import api from "./axios";

export const siswaApi = {
  // Get all siswa
  getAll: (params = {}) => api.get("/siswa", { params }),

  // Get siswa by ID
  getById: (id) => api.get(`/siswa/${id}`),

  // Create siswa
  create: (data) => api.post("/siswa", data),

  // Update siswa
  update: (id, data) => api.put(`/siswa/${id}`, data),

  // Delete siswa
  delete: (id) => api.delete(`/siswa/${id}`),
};
