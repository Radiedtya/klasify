<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/bendahara/dashboard" class="nav-item active">
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
        <router-link to="/laporan" class="nav-item">
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
          <h1>Pengelolaan Kas Kelas (Bendahara)</h1>
          <p>Catat dan pantau transaksi kas kelas secara real-time.</p>
        </div>
        <button @click="showModal = true" class="btn-add">
          + Tambah Transaksi
        </button>
      </header>

      <!-- State Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat data kas...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <template v-else>
        <!-- Grid Ringkasan Kas Otomatis Terhitung dari Backend -->
        <section class="cards-grid">
          <div class="card">
            <div class="card-info">
              <h3>Total Sisa Kas</h3>
              <p class="amount">Rp {{ formatRupiah(totalKas) }}</p>
            </div>
            <div class="card-icon blue">💰</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Pemasukan</h3>
              <p class="amount green">+ Rp {{ formatRupiah(totalPemasukan) }}</p>
            </div>
            <div class="card-icon green">📈</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Pengeluaran</h3>
              <p class="amount red">- Rp {{ formatRupiah(totalPengeluaran) }}</p>
            </div>
            <div class="card-icon red">📉</div>
          </div>
        </section>

        <!-- Tabel Transaksi Kas -->
        <section class="table-section">
          <h2>Riwayat Transaksi</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Tipe</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in transactions" :key="item.id">
                <td>{{ formatDate(item.created_at || item.tanggal) }}</td>
                <td>{{ item.keterangan || item.title }}</td>
                <td>
                  <span :class="['badge', getTransactionType(item) === 'in' ? 'in' : 'out']">
                    {{ getTransactionType(item) === 'in' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                </td>
                <td :class="getTransactionType(item) === 'in' ? 'text-green' : 'text-red'">
                  {{ getTransactionType(item) === 'in' ? '+' : '-' }} Rp {{ formatRupiah(item.jumlah || item.amount) }}
                </td>
                <td>
                  <div class="action-buttons">
                    <button @click="openDetailModal(item)" class="btn-show" title="Detail / Read">
                      Lihat
                    </button>
                    <button @click="openEditModal(item)" class="btn-edit" title="Edit / Update">
                      Edit
                    </button>
                    <button @click="deleteTransaction(item.id)" class="btn-delete" title="Hapus / Delete">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
                  Belum ada transaksi recorded.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </main>

    <!-- Modal Form (CREATE) -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Tambah Transaksi Baru</h3>
        <form @submit.prevent="addTransaction">
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" v-model="form.title" placeholder="Contoh: Uang Kas Ani / Beli Spidol" required />
          </div>

          <div class="form-group">
            <label>Jenis Transaksi</label>
            <select v-model="form.type" required>
              <option value="in">Pemasukan (+)</option>
              <option value="out">Pengeluaran (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="form.amount" placeholder="10000" min="1" required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel" :disabled="submitting">Batal</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail (READ / SHOW) -->
    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Rincian Transaksi</h3>
        <div class="detail-container" v-if="selectedDetail">
          <div class="detail-item">
            <span class="detail-label">ID Transaksi</span>
            <span class="detail-value">#{{ selectedDetail.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tanggal</span>
            <span class="detail-value">{{ formatDate(selectedDetail.created_at || selectedDetail.tanggal) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Keterangan</span>
            <span class="detail-value">{{ selectedDetail.keterangan || selectedDetail.title }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori Tipe</span>
            <span :class="['badge', getTransactionType(selectedDetail) === 'in' ? 'in' : 'out']">
              {{ getTransactionType(selectedDetail) === 'in' ? 'Pemasukan (+)' : 'Pengeluaran (-)' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nominal Uang</span>
            <span :class="['detail-amount', getTransactionType(selectedDetail) === 'in' ? 'text-green' : 'text-red']">
              {{ getTransactionType(selectedDetail) === 'in' ? '+' : '-' }} Rp {{ formatRupiah(selectedDetail.jumlah || selectedDetail.amount) }}
            </span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="showDetailModal = false" class="btn-cancel">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Modal Form (UPDATE / EDIT) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Transaksi</h3>
        <form @submit.prevent="updateTransaction">
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" v-model="editForm.title" placeholder="Contoh: Uang Kas Ani" required />
          </div>

          <div class="form-group">
            <label>Jenis Transaksi</label>
            <select v-model="editForm.type" required>
              <option value="in">Pemasukan (+)</option>
              <option value="out">Pengeluaran (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="editForm.amount" placeholder="10000" min="1" required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn-cancel" :disabled="submitting">Batal</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_BASE_URL = 'http://localhost:8000/api'

// UI State
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const showModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectedDetail = ref(null)

// Data State
const transactions = ref([])
const stats = reactive({
  totalKas: 0,
  pemasukan: 0,
  pengeluaran: 0
})

// Form state (CREATE)
const form = reactive({
  title: '',
  type: 'in',
  amount: null
})

// Form state (UPDATE)
const editForm = reactive({
  id: null,
  title: '',
  type: 'in',
  amount: null
})

// Helper Authorization Headers
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// ----------------------------------------------------
// READ / GET DATA FROM BACKEND
// ----------------------------------------------------
const fetchDashboardData = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: getHeaders()
    })

    const result = await res.json()
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Gagal memuat data dari server')
    }

    const data = result.data

    // 1. Simpan statistik jika disediakan oleh backend
    if (data.statistik) {
      stats.totalKas = data.statistik.total_kas || 0
      stats.pemasukan = data.statistik.pemasukan_bulan_ini || 0
      stats.pengeluaran = data.statistik.pengeluaran_bulan_ini || 0
    }

    // 2. Ambil daftar transaksi (dari transaksi_pending_list / riwayat_transaksi / list umum)
    transactions.value = data.transaksi_pending_list || data.riwayat_transaksi || data.transaksi || []
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

// ----------------------------------------------------
// COMPUTED KAS STATS (FALBACK JIKA BACKEND TIDAK HITUNG)
// ----------------------------------------------------
const totalPemasukan = computed(() => {
  if (stats.pemasukan > 0) return stats.pemasukan
  return transactions.value
    .filter(t => getTransactionType(t) === 'in')
    .reduce((sum, t) => sum + (t.jumlah || t.amount || 0), 0)
})

const totalPengeluaran = computed(() => {
  if (stats.pengeluaran > 0) return stats.pengeluaran
  return transactions.value
    .filter(t => getTransactionType(t) === 'out')
    .reduce((sum, t) => sum + (t.jumlah || t.amount || 0), 0)
})

const totalKas = computed(() => {
  if (stats.totalKas > 0) return stats.totalKas
  return totalPemasukan.value - totalPengeluaran.value
})

// ----------------------------------------------------
// CREATE TRANSACTION (POST)
// ----------------------------------------------------
const addTransaction = async () => {
  submitting.value = true
  try {
    const payload = {
      keterangan: form.title,
      tipe: form.type,
      jumlah: form.amount
    }

    const res = await fetch(`${API_BASE_URL}/transaksi`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Gagal menambah transaksi')

    // Reset Form & Refetch Data
    form.title = ''
    form.type = 'in'
    form.amount = null
    showModal.value = false
    await fetchDashboardData()
  } catch (err) {
    alert(err.message)
  } finally {
    submitting.value = false
  }
}

// ----------------------------------------------------
// SHOW / DETAIL TRANSACTION
// ----------------------------------------------------
const openDetailModal = (item) => {
  selectedDetail.value = item
  showDetailModal.value = true
}

// ----------------------------------------------------
// UPDATE TRANSACTION (PUT / PATCH)
// ----------------------------------------------------
const openEditModal = (item) => {
  editForm.id = item.id
  editForm.title = item.keterangan || item.title
  editForm.type = getTransactionType(item)
  editForm.amount = item.jumlah || item.amount
  showEditModal.value = true
}

const updateTransaction = async () => {
  submitting.value = true
  try {
    const payload = {
      keterangan: editForm.title,
      tipe: editForm.type,
      jumlah: editForm.amount
    }

    const res = await fetch(`${API_BASE_URL}/transaksi/${editForm.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Gagal mengubah transaksi')

    showEditModal.value = false
    await fetchDashboardData()
  } catch (err) {
    alert(err.message)
  } finally {
    submitting.value = false
  }
}

// ----------------------------------------------------
// DELETE TRANSACTION (DELETE)
// ----------------------------------------------------
const deleteTransaction = async (id) => {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return

  try {
    const res = await fetch(`${API_BASE_URL}/transaksi/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Gagal menghapus transaksi')

    await fetchDashboardData()
  } catch (err) {
    alert(err.message)
  }
}

// Helper Formatters
const getTransactionType = (item) => {
  if (item.tipe) return item.tipe === 'pemasukan' ? 'in' : item.tipe === 'pengeluaran' ? 'out' : item.tipe
  return item.type || 'in'
}

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  fetchDashboardData()
})
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
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Main Content Styling */
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

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.card-info h3 {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
}

.amount {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.amount.green { color: #16a34a; }
.amount.red { color: #dc2626; }

.card-icon {
  font-size: 24px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

/* Table Section */
.table-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.table-section h2 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th, .data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.data-table th {
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: #f8fafc;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.in { background: #dcfce7; color: #15803d; }
.badge.out { background: #fee2e2; color: #b91c1c; }
.text-green { color: #16a34a; font-weight: 600; }
.text-red { color: #dc2626; font-weight: 600; }

.action-buttons { display: flex; gap: 6px; }

.btn-show {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}
.btn-show:hover { background: #e2e8f0; }

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
.btn-edit:hover { background: #bae6fd; }

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
.btn-delete:hover { background: #fee2e2; }

/* Detail Modal Read Section */
.detail-container { display: flex; flex-direction: column; gap: 14px; margin: 20px 0; }
.detail-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; }
.detail-label { font-size: 13px; color: #64748b; font-weight: 600; }
.detail-value { font-size: 14px; color: #0f172a; font-weight: 600; }
.detail-amount { font-size: 16px; font-weight: 700; }

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-card h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; }

.form-group input, .form-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a !important;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus, .form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-submit { background: #3b82f6; color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

/* Loading & Error States */
.loading-state, .error-alert {
  text-align: center;
  padding: 48px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.error-alert {
  color: #ef4444;
  font-weight: 600;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>