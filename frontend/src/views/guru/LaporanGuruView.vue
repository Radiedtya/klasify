<template>
  <div class="dashboard-wrapper">
    <aside class="sidebar">
      <div class="brand"><div class="brand-logo">K</div><h2>Klasify</h2></div>
      <nav class="nav-menu">
        <router-link to="/guru/dashboard" class="nav-item"><i class="bi bi-grid-fill"></i><span>Dashboard</span></router-link>
        <router-link to="/guru/kelas" class="nav-item"><i class="bi bi-easel-fill"></i><span>Data Kelas</span></router-link>
        <router-link to="/guru/siswa" class="nav-item"><i class="bi bi-people-fill"></i><span>Data Siswa</span></router-link>
        <router-link to="/guru/iuran" class="nav-item"><i class="bi bi-wallet2"></i><span>Data Iuran</span></router-link>
        <router-link to="/guru/transaksi" class="nav-item"><i class="bi bi-receipt"></i><span>Transaksi</span></router-link>
        <router-link to="/guru/pengeluaran" class="nav-item"><i class="bi bi-bag-dash-fill"></i><span>Pengeluaran</span></router-link>
        <router-link to="/guru/keterlambatan" class="nav-item"><i class="bi bi-clock-history"></i><span>Keterlambatan</span></router-link>
        <router-link to="/guru/laporan" class="nav-item active"><i class="bi bi-file-earmark-bar-graph-fill"></i><span>Laporan</span></router-link>
        <router-link to="/guru/notifikasi" class="nav-item"><i class="bi bi-bell-fill"></i><span>Notifikasi</span></router-link>
        <router-link to="/guru/pengaturan" class="nav-item"><i class="bi bi-gear-fill"></i><span>Pengaturan</span></router-link>
        <router-link to="/guru/profile" class="nav-item"><i class="bi bi-person-fill"></i><span>Profile</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn-logout"><i class="bi bi-box-arrow-right"></i><span>Keluar</span></button>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <h1>Laporan Keuangan Kelas</h1>
          <p>Download & cetak rekapitulasi iuran kas semester/bulanan.</p>
        </div>
        <div class="filter-group">
          <button class="btn-add" @click="exportData('PDF')">Export PDF</button>
          <button class="btn-edit" @click="exportData('Excel')">Export Excel</button>
        </div>
      </header>

      <section class="table-section summary-card">
        <h3>Ringkasan Laporan Bulan Mei 2026</h3>
        <p>Total Pemasukan: <strong>Rp 3.450.000</strong> | Total Pengeluaran: <strong>Rp 180.000</strong></p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const exportData = (type) => alert(`Mengunduh berkas rekap kas format ${type}...`)
const handleLogout = () => { localStorage.removeItem('token'); router.push('/login'); }
</script>

<style scoped>
/* Layout Parent */
.dashboard-wrapper {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
}

/* Sidebar Styling */
.sidebar {
  width: 260px;
  background: #ffffff;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.brand-logo {
  width: 38px;
  height: 38px;
  background: #3b82f6;
  color: #fff;
  font-weight: 800;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-item.active {
  background: #3b82f6;
  color: #ffffff;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  transition: background 0.2s ease;
}

.btn-logout:hover {
  background: #fee2e2;
}

/* Main Content Area */
.main-content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.topbar h1 {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.topbar p {
  color: #64748b;
  font-size: 13px;
  margin: 0;
}

/* Action Group & Buttons */
.filter-group {
  display: flex;
  gap: 10px;
}

.btn-add {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-add:hover {
  background: #2563eb;
}

.btn-edit {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: #2563eb;
  color: #ffffff;
}

/* Section Content Card */
.table-section {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.summary-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.summary-card p {
  margin: 0;
  font-size: 14px;
  color: #475569;
}

.summary-card strong {
  color: #1e293b;
}
</style>