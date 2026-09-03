import api from "./axios";

export const laporanApi = {
  // Laporan kas total
  getKas: () => api.get("/laporan/kas"),

  // Laporan per bulan
  getPerBulan: (bulan, tahun) => api.get(`/laporan/bulan/${bulan}/${tahun}`),

  // Laporan per siswa
  getPerSiswa: (siswaId) => api.get(`/laporan/siswa/${siswaId}`),

  // Laporan per kelas
  getPerKelas: (kelasId) => api.get(`/laporan/kelas/${kelasId}`),

  // Export PDF
  exportPdf: (params) => {
    return api.get("/laporan/export/pdf", {
      params,
      responseType: "blob",
    });
  },

  // Export Excel
  exportExcel: (params) => {
    return api.get("/laporan/export/excel", {
      params,
      responseType: "blob",
    });
  },
};
