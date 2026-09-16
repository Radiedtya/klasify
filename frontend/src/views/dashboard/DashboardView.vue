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
        <router-link to="/siswa" class="nav-item" v-if="userRole !== 'siswa'">
          <i class="bi bi-people-fill"></i>
          <span>Siswa</span>
        </router-link>
        <router-link to="/iuran" class="nav-item">
          <i class="bi bi-wallet2"></i>
          <span>Iuran</span>
        </router-link>
        <router-link to="/kelas" class="nav-item" v-if="userRole !== 'siswa'">
          <i class="bi bi-easel-fill"></i>
          <span>Kelas</span>
        </router-link>
        <router-link to="/transaksi" class="nav-item">
          <i class="bi bi-receipt"></i>
          <span>Transaksi</span>
        </router-link>
        <router-link to="/pengeluaran" class="nav-item" v-if="userRole !== 'siswa'">
          <i class="bi bi-bag-dash-fill"></i>
          <span>Pengeluaran</span>
        </router-link>
        <router-link to="/laporan" class="nav-item" v-if="userRole !== 'siswa'">
          <i class="bi bi-file-earmark-bar-graph-fill"></i>
          <span>Laporan</span>
        </router-link>
      </nav>

      <!-- Tombol Keluar / Footer Sidebar -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="nav-item logout-btn btn-logout-action">
          <i class="bi bi-box-arrow-right"></i>
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="topbar">
        <div>
          <h1>Pengelolaan Kas Kelas</h1>
          <p>Catat dan pantau transaksi kas kelas secara real-time.</p>
        </div>
        <button v-if="userRole !== 'siswa'" @click="showModal = true" class="btn-add">
          + Tambah Transaksi
        </button>
      </header>

      <!-- Grid Ringkasan Kas (Adaptif Sesuai Role) -->
      <section class="cards-grid" v-if="!isLoading">
        <!-- Dashboard Bendahara / Guru -->
        <template v-if="userRole === 'bendahara' || userRole === 'guru'">
          <div class="card">
            <div class="card-info">
              <h3>Total Sisa Kas</h3>
              <p class="amount">Rp {{ formatRupiah(statistik.total_kas) }}</p>
            </div>
            <div class="card-icon blue">💰</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Pemasukan</h3>
              <p class="amount green">+ Rp {{ formatRupiah(statistik.total_pemasukan) }}</p>
            </div>
            <div class="card-icon green">📈</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Pengeluaran</h3>
              <p class="amount red">- Rp {{ formatRupiah(statistik.total_pengeluaran) }}</p>
            </div>
            <div class="card-icon red">📉</div>
          </div>

          <div class="card" v-if="userRole === 'bendahara'">
            <div class="card-info">
              <h3>Transaksi Pending</h3>
              <p class="amount">{{ statistik.transaksi_pending || 0 }}</p>
            </div>
            <div class="card-icon orange">⏳</div>
          </div>
        </template>

        <!-- Dashboard Siswa -->
        <template v-else-if="userRole === 'siswa'">
          <div class="card">
            <div class="card-info">
              <h3>Total Tagihan</h3>
              <p class="amount">Rp {{ formatRupiah(statistik.total_tagihan) }}</p>
            </div>
            <div class="card-icon blue">📋</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Dibayar</h3>
              <p class="amount green">Rp {{ formatRupiah(statistik.total_dibayar) }}</p>
            </div>
            <div class="card-icon green">✅</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Sisa Tagihan</h3>
              <p class="amount red">Rp {{ formatRupiah(statistik.sisa_tagihan) }}</p>
            </div>
            <div class="card-icon red">⚠️</div>
          </div>

          <div class="card">
            <div class="card-info">
              <h3>Total Denda</h3>
              <p class="amount red">Rp {{ formatRupiah(statistik.total_denda) }}</p>
            </div>
            <div class="card-icon orange">💸</div>
          </div>
        </template>
      </section>

      <!-- Tabel Riwayat Transaksi Terbaru -->
      <section class="table-section">
        <h2>Riwayat Transaksi Terbaru</h2>
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
            <tr v-if="isLoading">
              <td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">
                Memuat data dari server...
              </td>
            </tr>
            <tr v-else v-for="item in formattedTransactions" :key="`${item.type}-${item.id}`">
              <td>{{ item.date }}</td>
              <td>{{ item.title }}</td>
              <td>
                <span :class="['badge', item.type === 'in' ? 'in' : 'out']">
                  {{ item.type === 'in' ? 'Pemasukan' : 'Pengeluaran' }}
                </span>
              </td>
              <td :class="item.type === 'in' ? 'text-green' : 'text-red'">
                {{ item.type === 'in' ? '+' : '-' }} Rp {{ formatRupiah(item.amount) }}
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openDetailModal(item)" class="btn-show" title="Detail">
                    Lihat
                  </button>
                  <button v-if="userRole !== 'siswa'" @click="openEditModal(item)" class="btn-edit" title="Edit">
                    Edit
                  </button>
                  <button v-if="userRole !== 'siswa'" @click="deleteTransaction(item)" class="btn-delete" title="Hapus">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && formattedTransactions.length === 0">
              <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
                Belum ada transaksi tercatat.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
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
            <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
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
            <span class="detail-value">{{ selectedDetail.date }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Keterangan</span>
            <span class="detail-value">{{ selectedDetail.title }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori Tipe</span>
            <span :class="['badge', selectedDetail.type === 'in' ? 'in' : 'out']">
              {{ selectedDetail.type === 'in' ? 'Pemasukan (+)' : 'Pengeluaran (-)' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nominal Uang</span>
            <span :class="['detail-amount', selectedDetail.type === 'in' ? 'text-green' : 'text-red']">
              {{ selectedDetail.type === 'in' ? '+' : '-' }} Rp {{ formatRupiah(selectedDetail.amount) }}
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
            <select v-model="editForm.type" disabled required>
              <option value="in">Pemasukan (+)</option>
              <option value="out">Pengeluaran (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="editForm.amount" placeholder="10000" min="1" required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// UI States
const showModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectedDetail = ref(null)
const isLoading = ref(false)

// Data Dashboard Backend State
const userRole = ref('bendahara')
const statistik = ref({})
const rawTransaksiTerbaru = ref([])
const rawPengeluaranTerbaru = ref([])

// Base API URL
const API_BASE_URL = 'http://localhost:8000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }
}

// Form Add (CREATE)
const form = reactive({
  title: '',
  type: 'in',
  amount: null
})

// Form Edit (UPDATE)
const editForm = reactive({
  id: null,
  title: '',
  type: 'in',
  amount: null
})

// Formatters
const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Format gabungan transaksi dan pengeluaran terbaru
const formattedTransactions = computed(() => {
  const listPemasukan = rawTransaksiTerbaru.value.map(item => ({
    id: item.id,
    date: formatDate(item.created_at || item.tanggal),
    title: item.keterangan || item.iuran?.nama_iuran || 'Pemasukan Kas',
    type: 'in',
    amount: Number(item.jumlah || item.nominal || 0),
    raw: item
  }))

  const listPengeluaran = rawPengeluaranTerbaru.value.map(item => ({
    id: item.id,
    date: formatDate(item.created_at || item.tanggal),
    title: item.keterangan || item.nama_pengeluaran || 'Pengeluaran Kas',
    type: 'out',
    amount: Number(item.jumlah || item.nominal || 0),
    raw: item
  }))

  return [...listPemasukan, ...listPengeluaran].sort((a, b) => {
    return new Date(b.raw.created_at || b.raw.tanggal) - new Date(a.raw.created_at || a.raw.tanggal)
  })
})

// FETCH DASHBOARD DATA DARI ENDPOINT BACKEND (/api/dashboard)
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard`, getAuthHeaders())
    const resData = response.data.data

    userRole.value = resData.role || 'bendahara'
    statistik.value = resData.statistik || {}
    rawTransaksiTerbaru.value = resData.transaksi_terbaru || []
    rawPengeluaranTerbaru.value = resData.pengeluaran_terbaru || []
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      console.error('Fetch dashboard error:', error)
      alert('Gagal mengambil data dashboard dari server.')
    }
  } finally {
    isLoading.value = false
  }
}

// ADD ITEM (CREATE)
const addTransaction = async () => {
  try {
    const headers = getAuthHeaders()
    const isPemasukan = form.type === 'in'
    const endpoint = isPemasukan ? `${API_BASE_URL}/transaksi` : `${API_BASE_URL}/pengeluaran`
    
    const payload = {
      keterangan: form.title,
      nominal: form.amount
    }

    await axios.post(endpoint, payload, headers)

    form.title = ''
    form.type = 'in'
    form.amount = null
    showModal.value = false

    await fetchDashboardData()
  } catch (error) {
    console.error('Store error:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan data baru.')
  }
}

// OPEN READ MODAL
const openDetailModal = (item) => {
  selectedDetail.value = item
  showDetailModal.value = true
}

// OPEN EDIT MODAL
const openEditModal = (item) => {
  editForm.id = item.id
  editForm.title = item.title
  editForm.type = item.type
  editForm.amount = item.amount
  showEditModal.value = true
}

// UPDATE ITEM
const updateTransaction = async () => {
  try {
    const headers = getAuthHeaders()
    const isPemasukan = editForm.type === 'in'
    const endpoint = isPemasukan 
      ? `${API_BASE_URL}/transaksi/${editForm.id}`
      : `${API_BASE_URL}/pengeluaran/${editForm.id}`

    const payload = {
      keterangan: editForm.title,
      nominal: editForm.amount
    }

    await axios.put(endpoint, payload, headers)

    showEditModal.value = false
    await fetchDashboardData()
  } catch (error) {
    console.error('Update error:', error)
    alert(error.response?.data?.message || 'Gagal memperbarui transaksi.')
  }
}

// DELETE ITEM
const deleteTransaction = async (item) => {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return

  try {
    const headers = getAuthHeaders()
    const endpoint = item.type === 'in' 
      ? `${API_BASE_URL}/transaksi/${item.id}`
      : `${API_BASE_URL}/pengeluaran/${item.id}`

    await axios.delete(endpoint, headers)
    await fetchDashboardData()
  } catch (error) {
    console.error('Delete error:', error)
    alert(error.response?.data?.message || 'Gagal menghapus transaksi.')
  }
}

// LOGOUT
const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, getAuthHeaders())
  } catch (error) {
    console.warn('Logout API warning:', error)
  } finally {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

// ON COMPONENT MOUNT
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
  background-color: #f4f7fe;
  color: #0f172a;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* Sidebar Styling */
.sidebar {
  width: 260px;
  background-color: #1a56ff;
  display: flex;
  flex-direction: column;
  padding: 30px 0 20px 20px;
  color: #ffffff;
  position: relative;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 10px;
  margin-bottom: 40px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  color: #1a56ff;
  font-weight: 800;
  font-size: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.brand h2 {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item i {
  font-size: 18px;
}

.nav-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active,
.nav-item.active {
  background-color: #f4f7fe;
  color: #1a56ff;
  font-weight: 600;
}

.nav-item.router-link-active::before,
.nav-item.active::before {
  content: '';
  position: absolute;
  top: -20px;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: transparent;
  border-bottom-right-radius: 20px;
  box-shadow: 5px 5px 0 5px #f4f7fe;
  pointer-events: none;
}

.nav-item.router-link-active::after,
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  right: 0;
  width: 20px;
  height: 20px;
  background-color: transparent;
  border-top-right-radius: 20px;
  box-shadow: 5px -5px 0 5px #f4f7fe;
  pointer-events: none;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  padding-right: 20px;
}

.btn-logout-action {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
}

.logout-btn {
  color: #ff6b6b;
}

.logout-btn:hover {
  background-color: rgba(255, 107, 107, 0.15);
  color: #ff4d4d;
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
  background: #1a56ff;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(26, 86, 255, 0.3);
  transition: background 0.2s ease;
}

.btn-add:hover {
  background: #003ebd;
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
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus, .form-group select:focus {
  border-color: #1a56ff;
  box-shadow: 0 0 0 3px rgba(26, 86, 255, 0.2);
}

.detail-container { display: flex; flex-direction: column; gap: 14px; margin: 20px 0; }
.detail-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; }
.detail-label { font-size: 13px; color: #64748b; font-weight: 600; }
.detail-value { font-size: 14px; color: #0f172a; font-weight: 600; }
.detail-amount { font-size: 16px; font-weight: 700; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-submit { background: #1a56ff; color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>