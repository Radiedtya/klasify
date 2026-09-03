import api from "./axios";

export const keterlambatanApi = {
  // Get all keterlambatan
  getAll: (params = {}) => api.get("/keterlambatan", { params }),

  // Get keterlambatan by siswa
  getBySiswa: (siswaId) => api.get(`/keterlambatan/siswa/${siswaId}`),

  // Get my keterlambatan (siswa)
  getMyKeterlambatan: () => api.get("/keterlambatan/saya"),

  // Cek keterlambatan manual (guru only)
  cekManual: () => api.post("/keterlambatan/cek"),
};
