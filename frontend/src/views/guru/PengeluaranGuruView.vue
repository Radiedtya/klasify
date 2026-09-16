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
        <router-link to="/guru/pengeluaran" class="nav-item active"><i class="bi bi-bag-dash-fill"></i><span>Pengeluaran</span></router-link>
        <router-link to="/guru/keterlambatan" class="nav-item"><i class="bi bi-clock-history"></i><span>Keterlambatan</span></router-link>
        <router-link to="/guru/laporan" class="nav-item"><i class="bi bi-file-earmark-bar-graph-fill"></i><span>Laporan</span></router-link>
        <router-link to="/guru/notifikasi" class="nav-item"><i class="bi bi-bell-fill"></i><span>Notifikasi</span></router-link>
        <router-link to="/guru/pengaturan" class="nav-item"><i class="bi bi-gear-fill"></i><span>Pengaturan</span></router-link>
        <router-link to="/guru/profile" class="nav-item"><i class="bi bi-person-fill"></i><span>Profile</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn-logout"><i class="bi bi-box-arrow-right"></i><span>Keluar</span></button>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <h1>Persetujuan Pengeluaran</h1>
          <p>Verifikasi pengajuan dana kas oleh bendahara kelas.</p>
        </div>
      </header>

      <section class="table-section">
        <table class="data-table">
          <thead>
            <tr>
              <th>Keperluan</th>
              <th>Nominal</th>
              <th>Pengaju</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Persetujuan Wali Kelas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pengeluaranList" :key="item.id">
              <td><strong>{{ item.kategori }}</strong></td>
              <td>Rp {{ item.nominal.toLocaleString('id-ID') }}</td>
              <td>{{ item.pengaju }}</td>
              <td>{{ item.tanggal }}</td>
              <td><span :class="['badge', getBadge(item.status)]">{{ item.status }}</span></td>
              <td>
                <div v-if="item.status === 'Diproses'" class="action-buttons">
                  <button class="btn-approve" @click="acc(item.id, 'Disetujui')">Setujui</button>
                  <button class="btn-delete" @click="acc(item.id, 'Ditolak')">Tolak</button>
                </div>
                <span v-else class="text-muted">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pengeluaranList = ref([
  { id: 1, kategori: 'Pembelian Alat Kebersihan', nominal: 35000, pengaju: 'Siti (Bendahara)', tanggal: '2026-05-02', status: 'Diproses' },
  { id: 2, kategori: 'Fotocopy Soal Ujian', nominal: 50000, pengaju: 'Siti (Bendahara)', tanggal: '2026-04-28', status: 'Disetujui' }
])

const acc = (id, status) => {
  const target = pengeluaranList.value.find(p => p.id === id)
  if (target) target.status = status
}

const getBadge = (status) => {
  if (status === 'Disetujui') return 'approved'
  if (status === 'Diproses') return 'pending'
  return 'rejected'
}

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

/* Section Table */
.table-section {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.data-table th {
  background: #f8fafc;
  padding: 14px 18px;
  color: #475569;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

/* Badge Styling */
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.badge.approved {
  background: #dcfce7;
  color: #166534;
}

.badge.pending {
  background: #fef9c3;
  color: #854d0e;
}

.badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons & Text */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-approve {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-approve:hover {
  background: #16a34a;
  color: #ffffff;
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #ef4444;
  color: #ffffff;
}

.text-muted {
  color: #94a3b8;
  font-size: 14px;
}
</style>