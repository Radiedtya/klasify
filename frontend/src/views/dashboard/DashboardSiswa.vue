<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar Khusus Role Siswa -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <span class="brand-text">Klasify</span>
      </div>

      <nav class="menu">
        <router-link to="/siswa/dashboard" class="menu-item active">
          <i class="bx bx-grid-alt"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/siswa/iuran" class="menu-item">
          <i class="bx bx-receipt"></i>
          <span>Data Iuran</span>
        </router-link>
        <router-link to="/siswa/transaksi" class="menu-item">
          <i class="bx bx-transfer-alt"></i>
          <span>Transaksi</span>
        </router-link>
        <router-link to="/siswa/keterlambatan" class="menu-item">
          <i class="bx bx-time-five"></i>
          <span>Keterlambatan</span>
        </router-link>
        <router-link to="/siswa/notifikasi" class="menu-item">
          <i class="bx bx-bell"></i>
          <span>Notifikasi</span>
        </router-link>
        <router-link to="/siswa/profile" class="menu-item">
          <i class="bx bx-user"></i>
          <span>Profile</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="btn-logout">
          <i class="bx bx-log-out"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div>
          <h1 class="page-title">Dashboard Siswa</h1>
          <p class="page-subtitle">Ringkasan statistik iuran dan tagihan kamu.</p>
        </div>
      </header>

      <!-- Stats Cards (Statistik Tagihan & Denda Sendiri) -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Tagihan Aktif</span>
            <h2 class="stat-value text-blue">{{ formatRupiah(stats.totalTagihan) }}</h2>
          </div>
          <div class="stat-icon bg-blue">
            <i class="bx bx-wallet"></i>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Sudah Dibayar</span>
            <h2 class="stat-value text-green">{{ formatRupiah(stats.totalLunas) }}</h2>
          </div>
          <div class="stat-icon bg-green">
            <i class="bx bx-check-circle"></i>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Denda</span>
            <h2 class="stat-value text-amber">{{ formatRupiah(stats.totalDenda) }}</h2>
          </div>
          <div class="stat-icon bg-amber">
            <i class="bx bx-error-circle"></i>
          </div>
        </div>
      </section>

      <!-- Banner Fitur Upload Bukti Bayar -->
      <section class="banner-card">
        <div class="banner-content">
          <h3>Bayar Kas Lebih Cepat!</h3>
          <p>Pastikan untuk mengunggah bukti bayar sebelum tanggal jatuh tempo agar tidak terkena denda keterlambatan.</p>
        </div>
        <router-link to="/siswa/transaksi" class="btn-upload">
          <i class="bx bx-upload"></i> Upload Bukti Bayar
        </router-link>
      </section>

      <!-- Riwayat Transaksi Milik Sendiri -->
      <section class="table-card">
        <h3 class="card-title">Riwayat Transaksi Saya</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>KETERANGAN IURAN</th>
                <th>JUMLAH</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="transaksiList.length === 0">
                <td colspan="4" class="empty-state">
                  Belum ada riwayat transaksi recorded.
                </td>
              </tr>
              <tr v-for="item in transaksiList" :key="item.id" v-else>
                <td>{{ item.tanggal }}</td>
                <td>{{ item.keterangan }}</td>
                <td class="font-semibold">{{ formatRupiah(item.jumlah) }}</td>
                <td>
                  <span :class="['badge', getStatusBadge(item.status)]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const stats = ref({
  totalTagihan: 0,
  totalLunas: 0,
  totalDenda: 0
})

const transaksiList = ref([])

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0)
}

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'lunas':
      return 'badge-success'
    case 'pending':
      return 'badge-warning'
    case 'rejected':
      return 'badge-danger'
    default:
      return 'badge-secondary'
  }
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/siswa/dashboard-stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.data) {
      stats.value = res.data.stats || stats.value
      transaksiList.value = res.data.transaksi || []
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(fetchData)
</script>

<style scoped>
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

/* Sidebar Styling */
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
}

.brand-logo {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.brand-text {
  font-weight: 700;
  font-size: 1.125rem;
  color: #1e293b;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #64748b;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.menu-item i {
  font-size: 1.25rem;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.menu-item.active {
  background: #3b82f6;
  color: #ffffff;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

/* Main Content Styling */
.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  margin-top: 0.35rem;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}

.bg-blue { background: #eff6ff; }
.text-blue { color: #2563eb; }
.bg-green { background: #f0fdf4; }
.text-green { color: #16a34a; }
.bg-amber { background: #fffbeb; }
.text-amber { color: #d97706; }

.font-semibold { font-weight: 600; }

/* Banner Styling */
.banner-card {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.banner-content h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.banner-content p {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #bfdbfe;
}

.btn-upload {
  background: #f59e0b;
  color: #ffffff;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-upload:hover {
  background: #d97706;
}

/* Table Section */
.table-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

.empty-state {
  text-align: center;
  padding: 2rem !important;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Badges */
.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-success { background: #dcfce7; color: #15803d; }
.badge-warning { background: #fef3c7; color: #b45309; }
.badge-danger { background: #fee2e2; color: #b91c1c; }
.badge-secondary { background: #f1f5f9; color: #475569; }
</style>