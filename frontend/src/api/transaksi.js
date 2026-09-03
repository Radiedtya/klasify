import api from "./axios";

export const transaksiApi = {
  // Get all transaksi
  getAll: (params = {}) => api.get("/transaksi", { params }),

  // Get transaksi by ID
  getById: (id) => api.get(`/transaksi/${id}`),

  // Get transaksi by siswa
  getBySiswa: (siswaId) => api.get(`/transaksi/siswa/${siswaId}`),

  // Get transaksi by iuran
  getByIuran: (iuranId) => api.get(`/transaksi/iuran/${iuranId}`),

  // Get pending transaksi
  getPending: (params = {}) => api.get("/transaksi/pending", { params }),

  // Get my transaksi (siswa)
  getMyTransaksi: () => api.get("/transaksi/saya"),

  // Create transaksi (bayar)
  create: (data) => api.post("/transaksi", data),

  // Update transaksi
  update: (id, data) => api.put(`/transaksi/${id}`, data),

  // Konfirmasi transaksi
  konfirmasi: (id, data) => api.put(`/transaksi/${id}/konfirmasi`, data),

  // Delete transaksi
  delete: (id) => api.delete(`/transaksi/${id}`),
};
