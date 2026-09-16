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
          <p>Kelola data siswa dan status akun terdaftar.</p>
        </div>
        <!-- Tombol Tambah Siswa khusus Guru / Admin -->
        <button v-if="isGuru" @click="openAddModal" class="btn-add">
          + Tambah Siswa
        </button>
      </header>

      <!-- Alert Message -->
      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="fetchSiswa"
              placeholder="Cari nama atau NIS..." 
            />
          </div>

          <!-- Filter Tab Status Akun -->
          <div class="table-tabs">
            <button 
              :class="['tab-btn', activeTab === 'semua' ? 'active' : '']" 
              @click="setTab('semua')">
              Semua ({{ siswaList.length }})
            </button>
            <button 
              :class="['tab-btn', activeTab === 'aktif' ? 'active' : '']" 
              @click="setTab('aktif')">
              Aktif
            </button>
            <button 
              :class="['tab-btn', activeTab === 'nonaktif' ? 'active' : '']" 
              @click="setTab('nonaktif')">
              Non-Aktif
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          Memuat data...
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>NIS</th>
              <th>NISN</th>
              <th>Kelas</th>
              <!-- Kolom Orang Tua hanya muncul untuk Guru -->
              <th v-if="isGuru">Orang Tua</th>
              <th v-if="isGuru">No. HP Ortu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="siswa in siswaList" :key="siswa.id">
              <td>
                <strong>{{ siswa.user?.name || siswa.user?.nama || siswa.user?.nama_lengkap || '-' }}</strong>
              </td>
              <td>#{{ siswa.nis || '-' }}</td>
              <td>{{ siswa.nisn || '-' }}</td>
              <!-- Menampilkan Nama Kelas dari Relasi -->
              <td>{{ siswa.kelas?.nama_kelas || siswa.kelas?.nama || `Kelas #${siswa.kelas_id}` }}</td>
              <!-- Data Orang Tua hanya dimuat untuk Guru -->
              <td v-if="isGuru">{{ siswa.nama_ortu || '-' }}</td>
              <td v-if="isGuru">{{ siswa.no_hp_ortu || '-' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="openDetailModal(siswa.id)" class="btn-show" title="Detail">Lihat</button>
                  <!-- Edit dan Hapus hanya untuk Guru -->
                  <button v-if="isGuru" @click="openEditModal(siswa)" class="btn-edit" title="Edit">Edit</button>
                  <button v-if="isGuru" @click="deleteSiswa(siswa.id)" class="btn-delete" title="Hapus">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="siswaList.length === 0">
              <td :colspan="isGuru ? 7 : 5" style="text-align: center; color: #94a3b8; padding: 20px;">
                Data siswa tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL CREATE (Khusus Guru) -->
    <div v-if="showAddModal && isGuru" class="modal-overlay">
      <div class="modal-card modal-lg">
        <h3>Tambah Siswa Baru</h3>
        <form @submit.prevent="addSiswa">
          <div class="form-grid">
            <div class="form-group">
              <label>User ID*</label>
              <input type="number" v-model.number="form.user_id" placeholder="1" required />
            </div>

            <div class="form-group">
              <label>NIS*</label>
              <input type="text" v-model="form.nis" placeholder="123456" required />
            </div>

            <div class="form-group">
              <label>NISN</label>
              <input type="text" v-model="form.nisn" placeholder="000123456" />
            </div>

            <div class="form-group">
              <label>Kelas*</label>
              <select v-model.number="form.kelas_id" required>
                <option value="" disabled>Pilih Kelas</option>
                <option v-for="k in kelasList" :key="k.id" :value="k.id">
                  {{ k.nama_kelas || k.nama || `Kelas #${k.id}` }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Nama Orang Tua</label>
              <input type="text" v-model="form.nama_ortu" placeholder="Nama Orang Tua" />
            </div>

            <div class="form-group">
              <label>No. HP Orang Tua</label>
              <input type="text" v-model="form.no_hp_ortu" placeholder="081234567890" />
            </div>

            <div class="form-group">
              <label>Tempat Lahir</label>
              <input type="text" v-model="form.tempat_lahir" placeholder="Jakarta" />
            </div>

            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input type="date" v-model="form.tanggal_lahir" />
            </div>
          </div>

          <div class="form-group full-width">
            <label>Alamat</label>
            <textarea v-model="form.alamat" rows="2" placeholder="Alamat lengkap"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
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
            <span class="detail-label">Nama Siswa</span>
            <span class="detail-value">{{ selectedDetail.user?.name || selectedDetail.user?.nama || selectedDetail.user?.nama_lengkap || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">ID / User ID</span>
            <span class="detail-value">{{ selectedDetail.id }} / {{ selectedDetail.user_id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">NIS / NISN</span>
            <span class="detail-value">{{ selectedDetail.nis }} / {{ selectedDetail.nisn || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kelas</span>
            <span class="detail-value">{{ selectedDetail.kelas?.nama_kelas || selectedDetail.kelas?.nama || `Kelas #${selectedDetail.kelas_id}` }}</span>
          </div>
          
          <!-- Detail Orang Tua hanya tampil jika Guru -->
          <div class="detail-item" v-if="isGuru">
            <span class="detail-label">Orang Tua</span>
            <span class="detail-value">{{ selectedDetail.nama_ortu || '-' }} ({{ selectedDetail.no_hp_ortu || '-' }})</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">TTL</span>
            <span class="detail-value">{{ selectedDetail.tempat_lahir || '-' }}, {{ formatDate(selectedDetail.tanggal_lahir) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Alamat</span>
            <span class="detail-value">{{ selectedDetail.alamat || '-' }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="showDetailModal = false" class="btn-cancel">Tutup</button>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT (UPDATE - Khusus Guru) -->
    <div v-if="showEditModal && isGuru" class="modal-overlay">
      <div class="modal-card modal-lg">
        <h3>Edit Data Siswa</h3>
        <form @submit.prevent="updateSiswa">
          <div class="form-grid">
            <div class="form-group">
              <label>User ID*</label>
              <input type="number" v-model.number="editForm.user_id" required />
            </div>

            <div class="form-group">
              <label>NIS</label>
              <input type="text" v-model="editForm.nis" required />
            </div>

            <div class="form-group">
              <label>NISN</label>
              <input type="text" v-model="editForm.nisn" />
            </div>

            <div class="form-group">
              <label>Kelas</label>
              <select v-model.number="editForm.kelas_id" required>
                <option v-for="k in kelasList" :key="k.id" :value="k.id">
                  {{ k.nama_kelas || k.nama || `Kelas #${k.id}` }}
                </option>
              </select>
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
              <label>Tempat Lahir</label>
              <input type="text" v-model="editForm.tempat_lahir" />
            </div>

            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input type="date" v-model="editForm.tanggal_lahir" />
            </div>
          </div>

          <div class="form-group full-width">
            <label>Alamat</label>
            <textarea v-model="editForm.alamat" rows="2"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan' }}
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
import api from '@/api/axios.js' 

const router = useRouter()

const siswaList = ref([])
const kelasList = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const showAddModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedDetail = ref(null)

const searchQuery = ref('')
const activeTab = ref('semua')

// Role Checking
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const userRole = computed(() => currentUser.value.role?.toLowerCase() || '')

// Pengecekan role Guru / Admin vs Bendahara
const isGuru = computed(() => userRole.value === 'guru' || userRole.value === 'admin')
const isBendahara = computed(() => userRole.value === 'bendahara')

const initialFormState = {
  user_id: null,
  nis: '',
  nisn: '',
  kelas_id: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat: '',
  nama_ortu: '',
  no_hp_ortu: ''
}

const form = reactive({ ...initialFormState })
const editForm = reactive({ id: null, ...initialFormState })

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID')
}

const fetchSiswa = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    let url = '/siswa'
    if (searchQuery.value) {
      url += `?search=${encodeURIComponent(searchQuery.value)}`
    }

    const response = await api.get(url)
    
    if (response.data && response.data.success) {
      siswaList.value = response.data.data
    } else {
      siswaList.value = []
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal memuat data siswa'
  } finally {
    isLoading.value = false
  }
}

const fetchKelas = async () => {
  try {
    const response = await api.get('/kelas')
    if (response.data && response.data.success) {
      kelasList.value = response.data.data
    }
  } catch (err) {
    console.error('Gagal memuat data kelas:', err)
  }
}

const setTab = (tab) => {
  activeTab.value = tab
  fetchSiswa()
}

const openAddModal = () => {
  if (!isGuru.value) return
  Object.assign(form, initialFormState)
  showAddModal.value = true
}

const openDetailModal = async (id) => {
  try {
    const response = await api.get(`/siswa/${id}`)
    if (response.data && response.data.success) {
      selectedDetail.value = response.data.data
      showDetailModal.value = true
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal mengambil detail siswa')
  }
}

const openEditModal = (siswa) => {
  if (!isGuru.value) return
  editForm.id = siswa.id
  editForm.user_id = siswa.user_id
  editForm.nis = siswa.nis || ''
  editForm.nisn = siswa.nisn || ''
  editForm.kelas_id = siswa.kelas_id || ''
  editForm.nama_ortu = siswa.nama_ortu || ''
  editForm.no_hp_ortu = siswa.no_hp_ortu || ''
  editForm.tempat_lahir = siswa.tempat_lahir || ''
  editForm.tanggal_lahir = siswa.tanggal_lahir ? siswa.tanggal_lahir.split('T')[0] : ''
  editForm.alamat = siswa.alamat || ''
  
  showEditModal.value = true
}

const addSiswa = async () => {
  if (!isGuru.value) return
  isSubmitting.value = true
  try {
    const response = await api.post('/siswa', form)
    if (response.data && response.data.success) {
      showAddModal.value = false
      fetchSiswa()
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menambahkan siswa')
  } finally {
    isSubmitting.value = false
  }
}

const updateSiswa = async () => {
  if (!isGuru.value) return
  isSubmitting.value = true
  try {
    const response = await api.put(`/siswa/${editForm.id}`, editForm)
    if (response.data && response.data.success) {
      showEditModal.value = false
      fetchSiswa()
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memperbarui siswa')
  } finally {
    isSubmitting.value = false
  }
}

const deleteSiswa = async (id) => {
  if (!isGuru.value) return
  if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
    try {
      const response = await api.delete(`/siswa/${id}`)
      if (response.data && response.data.success) {
        fetchSiswa()
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus siswa')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  fetchSiswa()
  fetchKelas()
})
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', -apple-system, sans-serif;
}

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

.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

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
  outline: none;
  box-sizing: border-box;
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

.tab-btn.active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
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

.modal-card.modal-lg {
  max-width: 640px;
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
  gap: 12px 16px;
}

.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
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

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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