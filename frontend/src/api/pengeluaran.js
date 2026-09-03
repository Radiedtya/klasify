import api from "./axios";

export const pengeluaranApi = {
  // Get all pengeluaran
  getAll: (params = {}) => api.get("/pengeluaran", { params }),

  // Get pengeluaran by ID
  getById: (id) => api.get(`/pengeluaran/${id}`),

  // Get pengeluaran by kelas
  getByKelas: (kelasId) => api.get(`/pengeluaran/kelas/${kelasId}`),

  // Get pending pengeluaran
  getPending: (params = {}) => api.get("/pengeluaran/pending", { params }),

  // Get summary by kategori
  getSummaryByKategori: (params = {}) =>
    api.get("/pengeluaran/summary/kategori", { params }),

  // Create pengeluaran
  create: (data) => api.post("/pengeluaran", data),

  // Update pengeluaran
  update: (id, data) => api.put(`/pengeluaran/${id}`, data),

  // Setujui pengeluaran
  setujui: (id, data) => api.put(`/pengeluaran/${id}/setujui`, data),

  // Delete pengeluaran
  delete: (id) => api.delete(`/pengeluaran/${id}`),
};
