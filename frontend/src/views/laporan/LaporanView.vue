<script setup>
import { ref } from 'vue';

// Data dummy laporan kas kelas
const daftarLaporan = ref([
  { id: '#301', kategori: 'Laporan Kas Bulanan', nominal: 2500000, pembuat: 'Siti Nurhaliza', tanggal: '2026-05-01', status: 'Selesai' },
  { id: '#302', kategori: 'Laporan Rekap Iuran', nominal: 1800000, pembuat: 'Ani Rahayu', tanggal: '2026-05-03', status: 'Proses' },
  { id: '#303', kategori: 'Laporan Pengeluaran Acara', nominal: 450000, pembuat: 'Budi Santoso', tanggal: '2026-05-04', status: 'Selesai' }
]);

const rupiah = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
};

function exportLaporan(type) {
  alert(`Menyiapkan export ${type}...`);
}
</script>

<template>
  <div class="page-container">
    <!-- Header Halaman -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Laporan Kas</h1>
        <p class="page-subtitle">Rekapitulasi dan ringkasan kas kelas.</p>
      </div>
      <div class="header-buttons">
        <button class="btn-primary" @click="exportLaporan('PDF')">+ Export PDF</button>
      </div>
    </div>

    <!-- Main Card / Container Tabel -->
    <div class="main-card">
      <!-- Filter & Search -->
      <div class="filter-container">
        <input type="text" class="search-input" placeholder="Cari laporan..." />
        <select class="status-select">
          <option>Semua Status</option>
          <option>Selesai</option>
          <option>Proses</option>
        </select>
      </div>

      <!-- Tabel Laporan -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>KATEGORI / DESKRIPSI</th>
              <th>NOMINAL</th>
              <th>DIBUAT OLEH</th>
              <th>TANGGAL</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in daftarLaporan" :key="item.id">
              <td class="col-id">{{ item.id }}</td>
              <td class="col-kategori">{{ item.kategori }}</td>
              <td class="col-nominal">{{ rupiah(item.nominal) }}</td>
              <td>{{ item.pembuat }}</td>
              <td>{{ item.tanggal }}</td>
              <td>
                <span :class="['badge-status', item.status === 'Selesai' ? 'badge-success' : 'badge-warning']">
                  {{ item.status }}
                </span>
              </td>
              <td class="col-aksi">
                <button class="btn-action edit" @click="exportLaporan('PDF')">Cetak</button>
                <button class="btn-action delete" @click="exportLaporan('Excel')">Excel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 32px;
  background-color: #0f172a;
  min-height: 100vh;
  color: #ffffff;
  font-family: sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #ffffff;
}

.page-subtitle {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.main-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  color: #1e293b;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  background-color: #334155;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  color: #ffffff;
  width: 250px;
}

.search-input::placeholder {
  color: #94a3b8;
}

.status-select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 16px;
  color: #334155;
  background-color: #ffffff;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

th {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
}

td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
}

.col-id {
  color: #64748b;
}

.col-kategori {
  font-weight: 700;
  color: #0f172a;
}

.col-nominal {
  font-weight: 500;
}

.badge-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.col-aksi {
  display: flex;
  gap: 8px;
}

.btn-action {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-action.edit {
  background-color: #e0f2fe;
  color: #0284c7;
}

.btn-action.delete {
  background-color: #ffe4e6;
  color: #e11d48;
}
</style>