import api from "./axios";

export const kelasApi = {
  // Get all kelas
  getAll: (params = {}) => api.get("/kelas", { params }),

  // Get kelas by ID
  getById: (id) => api.get(`/kelas/${id}`),

  // Create kelas
  create: (data) => api.post("/kelas", data),

  // Update kelas
  update: (id, data) => api.put(`/kelas/${id}`, data),

  // Delete kelas
  delete: (id) => api.delete(`/kelas/${id}`),

  // Get siswa in kelas
  getSiswa: (id) => api.get(`/kelas/${id}/siswa`),
};
