<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item">
          <i class="bi bi-grid-fill"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/siswa" class="nav-item">
          <i class="bi bi-people-fill"></i>
          <span>Siswa</span>
        </router-link>
        <router-link to="/iuran" class="nav-item">
          <i class="bi bi-wallet2"></i>
          <span>Iuran</span>
        </router-link>
        <router-link to="/kelas" class="nav-item">
          <i class="bi bi-easel-fill"></i>
          <span>Kelas</span>
        </router-link>
        <router-link to="/transaksi" class="nav-item">
          <i class="bi bi-receipt"></i>
          <span>Transaksi</span>
        </router-link>
        <router-link to="/pengeluaran" class="nav-item">
          <i class="bi bi-bag-dash-fill"></i>
          <span>Pengeluaran</span>
        </router-link>
        <router-link to="/laporan" class="nav-item active">
          <i class="bi bi-file-earmark-bar-graph-fill"></i>
          <span>Laporan</span>
        </router-link>
      </nav>

      <button @click="handleLogout" class="btn-logout">
        <i class="bi bi-box-arrow-right"></i>
        <span>Keluar</span>
      </button>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="topbar">
        <div>
          <h1>Laporan Kas</h1>
          <p>Rekapitulasi dan ringkasan kas kelas.</p>
        </div>
        <div class="header-buttons">
          <button class="btn-add" @click="exportLaporan('PDF')">
            + Export PDF
          </button>
        </div>
      </header>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari laporan / pembuat..." 
            />
          </div>

          <div class="filter-wrapper">
            <select v-model="selectedStatus" class="select-chip">
              <option value="semua">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Proses">Proses</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kategori / Deskripsi</th>
              <th>Nominal</th>
              <th>Dibuat Oleh</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredLaporan" :key="item.id">
              <td>#{{ item.id }}</td>
              <td><strong>{{ item.kategori }}</strong></td>
              <td>{{ rupiah(item.nominal) }}</td>
              <td>{{ item.pembuat }}</td>
              <td>{{ item.tanggal }}</td>
              <td>
                <span :class="['badge', getStatusClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-edit" @click="exportLaporan('PDF', item)">Cetak</button>
                  <button class="btn-delete" @click="exportLaporan('Excel', item)">Excel</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredLaporan.length === 0">
              <td colspan="7" class="empty-state">
                Data laporan tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search & Filter State
const searchQuery = ref('')
const selectedStatus = ref('semua')

// Data Dummy Laporan Kas
const daftarLaporan = ref([
  { id: 301, kategori: 'Laporan Kas Bulanan', nominal: 2500000, pembuat: 'Siti Nurhaliza', tanggal: '2026-05-01', status: 'Selesai' },
  { id: 302, kategori: 'Laporan Rekap Iuran', nominal: 1800000, pembuat: 'Ani Rahayu', tanggal: '2026-05-03', status: 'Proses' },
  { id: 303, kategori: 'Laporan Pengeluaran Acara', nominal: 450000, pembuat: 'Budi Santoso', tanggal: '2026-05-04', status: 'Selesai' }
])

// Filter Logic
const filteredLaporan = computed(() => {
  return daftarLaporan.value.filter(item => {
    const matchSearch = item.kategori.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        item.pembuat.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = selectedStatus.value === 'semua' || item.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

// Currency Formatting Helper
const rupiah = (val) => {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

// Badge Status Helper
const getStatusClass = (status) => {
  if (status === 'Selesai') return 'approved'
  if (status === 'Proses') return 'pending'
  return ''
}

// Export Action
const exportLaporan = (type, item = null) => {
  if (item) {
    alert(`Mengeksport ${item.kategori} ke format ${type}...`)
  } else {
    alert(`Menyiapkan export seluruh laporan ke format ${type}...`)
  }
}

// Logout Action
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
/* Reset & Layout Utama */
.dashboard-wrapper {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', -apple-system, sans-serif;
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
  margin-bottom: 36px;
  padding-left: 8px;
}

.brand-logo {
  width: 38px;
  height: 38px;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 800;
  font-size: 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
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
  padding: 12px 16px;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  margin-top: auto;
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
  margin-bottom: 32px;
}

.topbar h1 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.topbar p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.btn-add {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  transition: background 0.2s ease;
}

.btn-add:hover {
  background: #2563eb;
}

/* Table Container & Filter */
.table-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.table-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-box input {
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  width: 240px;
  box-sizing: border-box;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.select-chip {
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  cursor: pointer;
}

.select-chip:focus {
  border-color: #3b82f6;
}

/* Table Styling */
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th, 
.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
}

.data-table th {
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-edit {
  background: #e0f2fe;
  color: #0284c7;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit:hover {
  background: #bae6fd;
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 24px;
}
</style>