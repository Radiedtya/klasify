import api from "./axios";

export const iuranApi = {
  // Get all iuran
  getAll: (params = {}) => api.get("/iuran", { params }),

  // Get iuran by ID
  getById: (id) => api.get(`/iuran/${id}`),

  // Get iuran by kelas
  getByKelas: (kelasId) => api.get(`/iuran/kelas/${kelasId}`),

  // Get status siswa per iuran
  getStatusSiswa: (id) => api.get(`/iuran/${id}/siswa`),

  // Create iuran
  create: (data) => api.post("/iuran", data),

  // Update iuran
  update: (id, data) => api.put(`/iuran/${id}`, data),

  // Delete iuran
  delete: (id) => api.delete(`/iuran/${id}`),
};
