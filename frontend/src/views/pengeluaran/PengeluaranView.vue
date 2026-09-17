<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/bendahara/dashboard" class="nav-item">
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
        <router-link to="/pengeluaran" class="nav-item active">
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
          <h1>Pengeluaran</h1>
          <p>Pengajuan & persetujuan pengeluaran kas kelas.</p>
        </div>
        <button @click="showAddModal = true" class="btn-add">
          + Ajukan Pengeluaran
        </button>
      </header>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari kategori / pengaju..." 
            />
          </div>

          <div class="filter-wrapper">
            <select v-model="selectedStatus" class="select-chip">
              <option value="semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Diproses">Diproses</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kategori / Deskripsi</th>
              <th>Nominal</th>
              <th>Diajukan Oleh</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredPengeluaran" :key="item.id">
              <td>#{{ item.id }}</td>
              <td><strong>{{ item.kategori }}</strong></td>
              <td>Rp {{ item.nominal.toLocaleString('id-ID') }}</td>
              <td>{{ item.pengaju }}</td>
              <td>{{ item.tanggal }}</td>
              <td>
                <span :class="['badge', getStatusClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(item)" class="btn-edit">Edit</button>
                  <button @click="deletePengeluaran(item.id)" class="btn-delete">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPengeluaran.length === 0">
              <td colspan="7" class="empty-state">
                Data pengeluaran tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL AJUKAN PENGELUARAN (CREATE) -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Ajukan Pengeluaran Baru</h3>
        <form @submit.prevent="addPengeluaran">
          <div class="form-group">
            <label>Kategori / Keperluan</label>
            <input type="text" v-model="form.kategori" placeholder="Contoh: Pembelian Alat Kebersihan" required />
          </div>

          <div class="form-group">
            <label>Nominal (Rp)</label>
            <input type="number" v-model.number="form.nominal" placeholder="35000" required />
          </div>

          <div class="form-group">
            <label>Diajukan Oleh</label>
            <input type="text" v-model="form.pengaju" placeholder="Contoh: Bendahara / Siti Nurhaliza" required />
          </div>

          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="form.tanggal" required />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status" required>
              <option value="Diproses">Diproses</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EDIT PENGELUARAN (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Data Pengeluaran</h3>
        <form @submit.prevent="updatePengeluaran">
          <div class="form-group">
            <label>Kategori / Keperluan</label>
            <input type="text" v-model="editForm.kategori" required />
          </div>

          <div class="form-group">
            <label>Nominal (Rp)</label>
            <input type="number" v-model.number="editForm.nominal" required />
          </div>

          <div class="form-group">
            <label>Diajukan Oleh</label>
            <input type="text" v-model="editForm.pengaju" required />
          </div>

          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="editForm.tanggal" required />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="editForm.status" required>
              <option value="Diproses">Diproses</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
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
import axios from 'axios' // Pastikan axios sudah terinstall

const router = useRouter()

// Endpoint API
const API_BASE_URL = 'http://localhost:8000/api/pengeluaran' // Sesuaikan dengan domain/port backend kamu

// State Data & Loading
const pengeluaranList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search & Filter State
const searchQuery = ref('')
const selectedStatus = ref('semua')

// Form States
const form = reactive({
  kelas_id: 1, // Sesuaikan dengan kelas_id default atau dari context user login
  judul: '',
  deskripsi: '',
  jumlah: 0,
  tanggal: new Date().toISOString().split('T')[0],
  kategori: '',
  bukti_foto: null
})

const editForm = reactive({
  id: null,
  judul: '',
  deskripsi: '',
  jumlah: 0,
  tanggal: '',
  kategori: '',
  bukti_foto: null
})

// Header Config untuk Authorization Token
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// 1. Fetch Data dari Backend
const fetchPengeluaran = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeader())
    
    // Mapping response backend ke struktur yang dibutuhkan komponen
    pengeluaranList.value = response.data.data.map(item => ({
      id: item.id,
      kategori: item.judul, // judul dijadikan kategori/nama pengeluaran di frontend
      nominal: item.jumlah,
      pengaju: item.created_by?.name || 'Sistem',
      tanggal: item.tanggal,
      status: mapStatusToFrontend(item.status),
      deskripsi: item.deskripsi,
      bukti_foto: item.bukti_foto
    }))
  } catch (error) {
    if (error.response?.status === 401) {
      handleLogout()
    } else {
      errorMessage.value = 'Gagal mengambil data pengeluaran dari server.'
    }
  } finally {
    isLoading.value = false
  }
}

// Helper mapping status backend ke penamaan frontend
const mapStatusToFrontend = (status) => {
  if (status === 'approved') return 'Disetujui'
  if (status === 'pending') return 'Diproses'
  if (status === 'rejected') return 'Ditolak'
  return status
}

// 2. Tambah Pengeluaran (POST)
const addPengeluaran = async () => {
  try {
    const formData = new FormData()
    formData.append('kelas_id', form.kelas_id)
    formData.append('judul', form.kategori)
    formData.append('jumlah', form.nominal)
    formData.append('tanggal', form.tanggal)
    formData.append('deskripsi', form.deskripsi || '')
    if (form.bukti_foto) {
      formData.append('bukti_foto', form.bukti_foto)
    }

    await axios.post(API_BASE_URL, formData, {
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    })

    await fetchPengeluaran() // Reload data
    
    // Reset Form
    form.kategori = ''
    form.nominal = 0
    form.deskripsi = ''
    form.bukti_foto = null
    showAddModal.value = false
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menambahkan pengeluaran.')
  }
}

// 3. Open Edit Modal
const openEditModal = (item) => {
  editForm.id = item.id
  editForm.kategori = item.kategori
  editForm.nominal = item.nominal
  editForm.tanggal = item.tanggal
  editForm.deskripsi = item.deskripsi || ''
  showEditModal.value = true
}

// 4. Update Pengeluaran (PUT)
const updatePengeluaran = async () => {
  try {
    const payload = {
      judul: editForm.kategori,
      jumlah: editForm.nominal,
      tanggal: editForm.tanggal,
      deskripsi: editForm.deskripsi
    }

    await axios.put(`${API_BASE_URL}/${editForm.id}`, payload, getAuthHeader())
    
    await fetchPengeluaran() // Reload data
    showEditModal.value = false
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal memperbarui pengeluaran.')
  }
}

// 5. Hapus Pengeluaran (DELETE)
const deletePengeluaran = async (id) => {
  if (confirm('Yakin ingin menghapus pengajuan pengeluaran ini?')) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader())
      await fetchPengeluaran() // Reload data
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus pengeluaran.')
    }
  }
}

// Handling File Input
const handleFileUpload = (event, type = 'add') => {
  const file = event.target.files[0]
  if (type === 'add') {
    form.bukti_foto = file
  } else {
    editForm.bukti_foto = file
  }
}

// Filter Logic (Client-side)
const filteredPengeluaran = computed(() => {
  return pengeluaranList.value.filter(item => {
    const matchSearch = item.kategori.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        item.pengaju.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = selectedStatus.value === 'semua' || item.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

// Badge Styling Helper
const getStatusClass = (status) => {
  if (status === 'Disetujui') return 'approved'
  if (status === 'Diproses') return 'pending'
  if (status === 'Ditolak') return 'rejected'
  return ''
}

// Logout Action
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Fetch data saat komponen di-mount
onMounted(() => {
  fetchPengeluaran()
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

.badge.rejected {
  background: #fee2e2;
  color: #991b1b;
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
  z-index: 100;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
}

.form-group input, 
.form-group select {
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

.form-group input:focus, 
.form-group select:focus {
  border-color: #3b82f6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>