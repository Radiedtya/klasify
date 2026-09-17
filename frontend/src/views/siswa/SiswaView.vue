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
        <router-link to="/siswa" class="nav-item active">
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
          <h1>Kelola Data Siswa</h1>
          <p>Kelola data siswa dan akun pengguna terkait.</p>
        </div>
        <button @click="openAddModal" class="btn-add">
          + Tambah Siswa
        </button>
      </header>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari nama atau NIS..." 
              @input="fetchSiswa"
            />
          </div>

          <!-- Filter Status Aktif User -->
          <div class="table-tabs">
            <button 
              :class="['tab-btn', activeTab === '' ? 'active' : '']" 
              @click="setTab('')">
              Semua ({{ siswaList.length }})
            </button>
            <button 
              :class="['tab-btn', activeTab === '1' ? 'active' : '']" 
              @click="setTab('1')">
              Aktif
            </button>
            <button 
              :class="['tab-btn', activeTab === '0' ? 'active' : '']" 
              @click="setTab('0')">
              Nonaktif
            </button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>NIS / NISN</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Email / No. HP</th>
              <th>Status Account</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" style="text-align: center; color: #64748b; padding: 20px;">
                Memuat data dari server...
              </td>
            </tr>
            <tr v-else v-for="siswa in siswaList" :key="siswa.id">
              <td>
                <strong>{{ siswa.nis }}</strong>
                <div style="font-size: 11px; color: #94a3b8;">NISN: {{ siswa.nisn || '-' }}</div>
              </td>
              <td>
                <strong>{{ siswa.user?.name || '-' }}</strong>
                <div style="font-size: 11px; color: #64748b;">Ortu: {{ siswa.nama_ortu || '-' }}</div>
              </td>
              <td>{{ siswa.kelas?.nama_kelas || `Kelas #${siswa.kelas_id}` }}</td>
              <td>
                <div>{{ siswa.user?.email || '-' }}</div>
                <div style="font-size: 11px; color: #64748b;">{{ siswa.user?.no_hp || '-' }}</div>
              </td>
              <td>
                <span :class="['badge', siswa.user?.is_active ? 'sudah' : 'belum']">
                  {{ siswa.user?.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openDetailModal(siswa.id)" class="btn-show" title="Detail">Lihat</button>
                  <button @click="openEditModal(siswa)" class="btn-edit" title="Edit">Edit</button>
                  <button @click="deleteSiswa(siswa.id)" class="btn-delete" title="Hapus">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && siswaList.length === 0">
              <td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">
                Data siswa tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL CREATE -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-card modal-large">
        <h3>Tambah Siswa Baru</h3>
        <form @submit.prevent="addSiswa">
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Lengkap *</label>
              <input type="text" v-model="form.name" placeholder="Rangga Pratama" required />
            </div>

            <div class="form-group">
              <label>Email (Login) *</label>
              <input type="email" v-model="form.email" placeholder="rangga@example.com" required />
            </div>

            <div class="form-group">
              <label>Password *</label>
              <input type="password" v-model="form.password" placeholder="Minimal 8 karakter" required />
            </div>

            <div class="form-group">
              <label>Kelas ID *</label>
              <input type="number" v-model="form.kelas_id" placeholder="ID Kelas (contoh: 1)" required />
            </div>

            <div class="form-group">
              <label>NIS *</label>
              <input type="text" v-model="form.nis" placeholder="12345" required />
            </div>

            <div class="form-group">
              <label>NISN</label>
              <input type="text" v-model="form.nisn" placeholder="00123456" />
            </div>

            <div class="form-group">
              <label>No. HP Siswa</label>
              <input type="text" v-model="form.no_hp" placeholder="08123456789" />
            </div>

            <div class="form-group">
              <label>Nama Orang Tua</label>
              <input type="text" v-model="form.nama_ortu" placeholder="Nama wali/ortu" />
            </div>

            <div class="form-group">
              <label>No. HP Orang Tua</label>
              <input type="text" v-model="form.no_hp_ortu" placeholder="08987654321" />
            </div>

            <div class="form-group">
              <label>Status Akun</label>
              <select v-model="form.is_active">
                <option :value="true">Aktif</option>
                <option :value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Alamat</label>
            <textarea v-model="form.alamat" rows="2" placeholder="Alamat lengkap"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DETAIL (READ) -->
    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Detail Data Siswa</h3>
        <div class="detail-container" v-if="selectedDetail">
          <div class="detail-item">
            <span class="detail-label">NIS / NISN</span>
            <span class="detail-value">{{ selectedDetail.nis }} / {{ selectedDetail.nisn || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nama Lengkap</span>
            <span class="detail-value">{{ selectedDetail.user?.name || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ selectedDetail.user?.email || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kelas</span>
            <span class="detail-value">{{ selectedDetail.kelas?.nama_kelas || selectedDetail.kelas_id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">No. HP</span>
            <span class="detail-value">{{ selectedDetail.user?.no_hp || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tempat, Tgl Lahir</span>
            <span class="detail-value">
              {{ selectedDetail.tempat_lahir || '-' }}, {{ selectedDetail.tanggal_lahir || '-' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Orang Tua / Wali</span>
            <span class="detail-value">{{ selectedDetail.nama_ortu || '-' }} ({{ selectedDetail.no_hp_ortu || '-' }})</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Alamat</span>
            <span class="detail-value">{{ selectedDetail.alamat || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status Akun</span>
            <span :class="['badge', selectedDetail.user?.is_active ? 'sudah' : 'belum']">
              {{ selectedDetail.user?.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
        </div>
        <div v-else style="text-align: center; padding: 10px;">Mengambil data...</div>

        <div class="modal-actions">
          <button type="button" @click="showDetailModal = false" class="btn-cancel">Tutup</button>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card modal-large">
        <h3>Edit Data Siswa</h3>
        <form @submit.prevent="updateSiswa">
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" v-model="editForm.name" />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="editForm.email" />
            </div>

            <div class="form-group">
              <label>Password (Kosongkan jika tak diubah)</label>
              <input type="password" v-model="editForm.password" placeholder="********" />
            </div>

            <div class="form-group">
              <label>Kelas ID</label>
              <input type="number" v-model="editForm.kelas_id" />
            </div>

            <div class="form-group">
              <label>NIS</label>
              <input type="text" v-model="editForm.nis" />
            </div>

            <div class="form-group">
              <label>NISN</label>
              <input type="text" v-model="editForm.nisn" />
            </div>

            <div class="form-group">
              <label>No. HP Siswa</label>
              <input type="text" v-model="editForm.no_hp" />
            </div>

            <div class="form-group">
              <label>Nama Orang Tua</label>
              <input type="text" v-model="editForm.nama_ortu" />
            </div>

            <div class="form-group">
              <label>No. HP Orang Tua</label>
              <input type="text" v-model="editForm.no_hp_ortu" />
            </div>

            <div class="form-group">
              <label>Status Akun</label>
              <select v-model="editForm.is_active">
                <option :value="true">Aktif</option>
                <option :value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top: 10px;">
            <label>Alamat</label>
            <textarea v-model="editForm.alamat" rows="2"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn-cancel">Batal</button>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// State Data API
const siswaList = ref([])
const loading = ref(false)
const submitting = ref(false)

// Modal states
const showAddModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedDetail = ref(null)

// Search & Filter State
const searchQuery = ref('')
const activeTab = ref('') // '' = semua, '1' = aktif, '0' = nonaktif

// Form State (Store)
const form = reactive({
  name: '',
  email: '',
  password: '',
  kelas_id: '',
  nis: '',
  nisn: '',
  no_hp: '',
  nama_ortu: '',
  no_hp_ortu: '',
  alamat: '',
  is_active: true
})

// Form State (Update)
const editForm = reactive({
  id: null,
  name: '',
  email: '',
  password: '',
  kelas_id: '',
  nis: '',
  nisn: '',
  no_hp: '',
  nama_ortu: '',
  no_hp_ortu: '',
  alamat: '',
  is_active: true
})

// HTTP API: Fetch All Siswa
const fetchSiswa = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (activeTab.value !== '') params.is_active = activeTab.value

    const res = await axios.get('/api/siswa', { params })
    if (res.data.success) {
      siswaList.value = res.data.data
    }
  } catch (err) {
    console.error('Gagal mengambil data siswa:', err)
  } finally {
    loading.value = false
  }
}

const setTab = (status) => {
  activeTab.value = status
  fetchSiswa()
}

// HTTP API: Store Siswa
const openAddModal = () => {
  // Reset Form
  Object.assign(form, {
    name: '', email: '', password: '', kelas_id: '',
    nis: '', nisn: '', no_hp: '', nama_ortu: '',
    no_hp_ortu: '', alamat: '', is_active: true
  })
  showAddModal.value = true
}

const addSiswa = async () => {
  submitting.value = true
  try {
    const res = await axios.post('/api/siswa', form)
    alert(res.data.message || 'Siswa berhasil ditambahkan!')
    showAddModal.value = false
    fetchSiswa()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menambahkan siswa')
  } finally {
    submitting.value = false
  }
}

// HTTP API: Show Detail Siswa
const openDetailModal = async (id) => {
  selectedDetail.value = null
  showDetailModal.value = true
  try {
    const res = await axios.get(`/api/siswa/${id}`)
    if (res.data.success) {
      selectedDetail.value = res.data.data
    }
  } catch (err) {
    alert('Gagal mengambil detail siswa')
    showDetailModal.value = false
  }
}

// HTTP API: Edit & Update Siswa
const openEditModal = (siswa) => {
  editForm.id = siswa.id
  editForm.name = siswa.user?.name || ''
  editForm.email = siswa.user?.email || ''
  editForm.password = ''
  editForm.kelas_id = siswa.kelas_id
  editForm.nis = siswa.nis
  editForm.nisn = siswa.nisn || ''
  editForm.no_hp = siswa.user?.no_hp || ''
  editForm.nama_ortu = siswa.nama_ortu || ''
  editForm.no_hp_ortu = siswa.no_hp_ortu || ''
  editForm.alamat = siswa.alamat || ''
  editForm.is_active = Boolean(siswa.user?.is_active)
  
  showEditModal.value = true
}

const updateSiswa = async () => {
  submitting.value = true
  try {
    const payload = { ...editForm }
    if (!payload.password) delete payload.password // Jangan kirim jika kosong

    const res = await axios.put(`/api/siswa/${editForm.id}`, payload)
    alert(res.data.message || 'Data siswa berhasil diperbarui!')
    showEditModal.value = false
    fetchSiswa()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memperbarui data')
  } finally {
    submitting.value = false
  }
}

// HTTP API: Delete Siswa
const deleteSiswa = async (id) => {
  if (!confirm('Yakin ingin menghapus data siswa ini?')) return
  try {
    const res = await axios.delete(`/api/siswa/${id}`)
    alert(res.data.message || 'Siswa berhasil dihapus')
    fetchSiswa()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus siswa')
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  fetchSiswa()
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

/* Content Container & Filter Bar */
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
  margin-bottom: 24px;
  gap: 16px;
}

.search-box {
  flex: 1;
  max-width: 320px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.table-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.tab-btn.active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

/* Tabel Data Siswa */
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

/* Badge Status */
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.sudah { background: #dcfce7; color: #15803d; }
.badge.belum { background: #fee2e2; color: #b91c1c; }

/* Tombol Aksi */
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

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-card.modal-large {
  max-width: 650px;
}

.modal-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #0f172a;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #3b82f6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 16px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  padding: 10px 16px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-label {
  color: #64748b;
  font-size: 13px;
}

.detail-value {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}
</style>