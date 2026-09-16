<template>
  <div class="dashboard-container">
    <!-- Navbar / Header Top -->
    <header class="top-bar">
      <div class="user-info">
        <h1>Dashboard Siswa</h1>
        <p>Selamat datang kembali, <strong>{{ userProfile?.name || 'Siswa' }}</strong> 👋</p>
      </div>
      <button @click="handleLogout" class="btn-logout">
        <span>Logout</span>
      </button>
    </header>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data kas...</p>
    </div>

    <div v-else class="content-body">
      <!-- Grid Ringkasan Statistik -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">💰</div>
          <div class="stat-detail">
            <span class="label">Total Kas Kelas</span>
            <h3 class="value">Rp {{ formatRupiah(summary.totalKas) }}</h3>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">⚠️</div>
          <div class="stat-detail">
            <span class="label">Tunggakan Kamu</span>
            <h3 class="value">Rp {{ formatRupiah(summary.tunggakan) }}</h3>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-detail">
            <span class="label">Total Terbayar</span>
            <h3 class="value">Rp {{ formatRupiah(summary.totalTerbayar) }}</h3>
          </div>
        </div>
      </div>

      <!-- Main Layout: Riwayat Pembayaran & Informasi -->
      <div class="main-grid">
        <!-- Tabel Riwayat Transaksi Kamu -->
        <div class="card table-card">
          <div class="card-header">
            <h3>Riwayat Pembayaran Kamu</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan / Minggu</th>
                  <th>Nominal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="transactions.length === 0">
                  <td colspan="4" class="empty-row">Belum ada riwayat pembayaran.</td>
                </tr>
                <tr v-for="item in transactions" :key="item.id">
                  <td>{{ formatDate(item.created_at) }}</td>
                  <td>{{ item.keterangan || 'Iuran Kas' }}</td>
                  <td class="font-bold">Rp {{ formatRupiah(item.nominal) }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'lunas' ? 'badge-success' : 'badge-pending'">
                      {{ item.status || 'Lunas' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sidebar / Widget Informasi -->
        <div class="side-widgets">
          <div class="card info-card">
            <h3>Informasi Kas Kelas</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Iuran Per Minggu</span>
                <span class="info-val">Rp 5.000</span>
              </div>
              <div class="info-item">
                <span class="info-label">Jadwal Penagihan</span>
                <span class="info-val">Setiap Hari Jumat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(true)
const userProfile = ref(null)

const summary = ref({
  totalKas: 0,
  tunggakan: 0,
  totalTerbayar: 0
})

const transactions = ref([])
const API_BASE_URL = 'http://localhost:8000/api'

// Helper Format Rupiah
const formatRupiah = (val) => {
  if (!val) return '0'
  return Number(val).toLocaleString('id-ID')
}

// Helper Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  try {
    const authHeader = { headers: { Authorization: `Bearer ${token}` } }

    // 1. Ambil Data User Profil
    const resUser = await axios.get(`${API_BASE_URL}/me`, authHeader)
    const user = resUser.data.data || resUser.data
    userProfile.value = user

    // 2. Ambil Data Dashboard Siswa (Sesuaikan endpoint API milikmu jika berbeda)
    try {
      const resDashboard = await axios.get(`${API_BASE_URL}/siswa/dashboard`, authHeader)
      const data = resDashboard.data.data || resDashboard.data
      
      summary.value.totalKas = data.total_kas || 0
      summary.value.tunggakan = data.tunggakan || 0
      summary.value.totalTerbayar = data.total_terbayar || 0
      transactions.value = data.riwayat || []
    } catch (err) {
      console.warn("API /siswa/dashboard belum siap, menggunakan data default")
    }

  } catch (error) {
    console.error("Auth Error:", error)
    localStorage.clear()
    router.push('/login')
  } finally {
    isLoading.value = false
  }
})

const handleLogout = async () => {
  const token = localStorage.getItem('token')
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err) {
    // Abaikan error logout backend
  } finally {
    localStorage.clear()
    router.push('/login')
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 32px;
  color: #0f172a;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.user-info h1 {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
}

.user-info p {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #dc2626;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 28px;
  background: #f1f5f9;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-detail .label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.stat-detail .value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
}

/* Main Grid & Cards */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header h3, .info-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Table Styling */
.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

th {
  color: #64748b;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.font-bold {
  font-weight: 600;
}

.empty-row {
  text-align: center;
  color: #94a3b8;
  padding: 24px 0;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-pending {
  background: #fef9c3;
  color: #854d0e;
}

/* Info Widget */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.info-label {
  color: #64748b;
}

.info-val {
  font-weight: 600;
  color: #0f172a;
}
</style>