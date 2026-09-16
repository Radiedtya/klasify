<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item active">
    <i class="bi bi-grid-fill"></i>
    <span>Dashboard</span>
  </router-link>
  
  <!-- UBAH DI SINI -->
  <router-link to="/siswa" class="nav-item">
    <i class="bi bi-people-fill"></i>
    <span>Siswa</span>
  </router-link>

  <router-link to="/iuran" class="nav-item">
    <i class="bi bi-wallet2"></i>
    <span>Iuran</span>
  </router-link>

  <router-link to="/kelas" class="nav-item">
    <i class="bi bi-wallet2"></i>
    <span>Kelas</span>
  </router-link>

  <router-link to="/transaksi" class="nav-item">
    <i class="bi bi-wallet2"></i>
    <span>Transaksi</span>
  </router-link>

  <router-link to="/pengeluaran" class="nav-item">
    <i class="bi bi-wallet2"></i>
    <span>Pengeluaran</span>
  </router-link>

  <router-link to="/laporan" class="nav-item">
    <i class="bi bi-wallet2"></i>
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
          <h1>Kelola Data Kelas</h1>
          <p>Kelola daftar kelas, wali kelas, dan jumlah siswa.</p>
        </div>
        <button @click="showAddModal = true" class="btn-add">
          + Tambah Kelas
        </button>
      </header>

      <!-- Grid Section -->
      <section class="content-section">
        <div class="toolbar">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari kelas / wali kelas..." 
            />
          </div>
        </div>

        <div class="kelas-grid">
          <div v-for="kelas in filteredKelas" :key="kelas.id" class="kelas-card">
            <div class="card-header">
              <h3>{{ kelas.namaKelas }}</h3>
              <span class="badge">{{ kelas.jurusan }}</span>
            </div>
            
            <div class="card-body">
              <div class="info-row">
                <span class="label">Wali Kelas:</span>
                <span class="value">{{ kelas.waliKelas }}</span>
              </div>
              <div class="info-row">
                <span class="label">Jumlah Siswa:</span>
                <span class="value">{{ kelas.jumlahSiswa }} Siswa</span>
              </div>
              <div class="info-row">
                <span class="label">Tahun Ajaran:</span>
                <span class="value">{{ kelas.tahunAjaran }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button @click="openEditModal(kelas)" class="btn-edit">Edit</button>
              <button @click="deleteKelas(kelas.id)" class="btn-delete">Hapus</button>
            </div>
          </div>

          <div v-if="filteredKelas.length === 0" class="empty-state">
            Data kelas tidak ditemukan.
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL TAMBAH KELAS (CREATE) -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Tambah Kelas Baru</h3>
        <form @submit.prevent="addKelas">
          <div class="form-group">
            <label>Nama Kelas</label>
            <input type="text" v-model="form.namaKelas" placeholder="Contoh: XII RPL 2" required />
          </div>

          <div class="form-group">
            <label>Jurusan</label>
            <input type="text" v-model="form.jurusan" placeholder="Contoh: RPL" required />
          </div>

          <div class="form-group">
            <label>Wali Kelas</label>
            <input type="text" v-model="form.waliKelas" placeholder="Nama wali kelas" required />
          </div>

          <div class="form-group">
            <label>Jumlah Siswa</label>
            <input type="number" v-model.number="form.jumlahSiswa" placeholder="32" required />
          </div>

          <div class="form-group">
            <label>Tahun Ajaran</label>
            <input type="text" v-model="form.tahunAjaran" placeholder="2025/2026" required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EDIT KELAS (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Data Kelas</h3>
        <form @submit.prevent="updateKelas">
          <div class="form-group">
            <label>Nama Kelas</label>
            <input type="text" v-model="editForm.namaKelas" required />
          </div>

          <div class="form-group">
            <label>Jurusan</label>
            <input type="text" v-model="editForm.jurusan" required />
          </div>

          <div class="form-group">
            <label>Wali Kelas</label>
            <input type="text" v-model="editForm.waliKelas" required />
          </div>

          <div class="form-group">
            <label>Jumlah Siswa</label>
            <input type="number" v-model.number="editForm.jumlahSiswa" required />
          </div>

          <div class="form-group">
            <label>Tahun Ajaran</label>
            <input type="text" v-model="editForm.tahunAjaran" required />
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search State
const searchQuery = ref('')

// Data Dummy Kelas
const kelasList = ref([
  { id: 1, namaKelas: 'XII RPL 1', jurusan: 'RPL', waliKelas: 'Siti Nurhaliza', jumlahSiswa: 34, tahunAjaran: '2025/2026' },
  { id: 2, namaKelas: 'XII RPL 2', jurusan: 'RPL', waliKelas: 'Budi Santoso', jumlahSiswa: 32, tahunAjaran: '2025/2026' },
  { id: 3, namaKelas: 'XII TKJ 1', jurusan: 'TKJ', waliKelas: 'Ahmad Dahlan', jumlahSiswa: 36, tahunAjaran: '2025/2026' }
])

// Form States
const form = reactive({
  namaKelas: '',
  jurusan: '',
  waliKelas: '',
  jumlahSiswa: 30,
  tahunAjaran: '2025/2026'
})

const editForm = reactive({
  id: null,
  namaKelas: '',
  jurusan: '',
  waliKelas: '',
  jumlahSiswa: 0,
  tahunAjaran: ''
})

// Filter Logic
const filteredKelas = computed(() => {
  return kelasList.value.filter(k => {
    const query = searchQuery.value.toLowerCase()
    return k.namaKelas.toLowerCase().includes(query) || k.waliKelas.toLowerCase().includes(query)
  })
})

// CRUD Actions
const addKelas = () => {
  kelasList.value.unshift({
    id: Date.now(),
    namaKelas: form.namaKelas,
    jurusan: form.jurusan,
    waliKelas: form.waliKelas,
    jumlahSiswa: form.jumlahSiswa,
    tahunAjaran: form.tahunAjaran
  })

  // Reset Form
  form.namaKelas = ''
  form.jurusan = ''
  form.waliKelas = ''
  showAddModal.value = false
}

const openEditModal = (kelas) => {
  editForm.id = kelas.id
  editForm.namaKelas = kelas.namaKelas
  editForm.jurusan = kelas.jurusan
  editForm.waliKelas = kelas.waliKelas
  editForm.jumlahSiswa = kelas.jumlahSiswa
  editForm.tahunAjaran = kelas.tahunAjaran
  showEditModal.value = true
}

const updateKelas = () => {
  const index = kelasList.value.findIndex(k => k.id === editForm.id)
  if (index !== -1) {
    kelasList.value[index] = { ...editForm }
  }
  showEditModal.value = false
}

const deleteKelas = (id) => {
  if (confirm('Yakin ingin menghapus kelas ini?')) {
    kelasList.value = kelasList.value.filter(k => k.id !== id)
  }
}

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

/* Content Container & Toolbar */
.content-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.toolbar {
  margin-bottom: 24px;
}

.search-box {
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

/* Grid Layout */
.kelas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.kelas-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.kelas-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.badge {
  background: #e0f2fe;
  color: #0284c7;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-row .label {
  color: #64748b;
}

.info-row .value {
  font-weight: 600;
  color: #0f172a;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-edit {
  background: #e0f2fe;
  color: #0284c7;
  border: none;
  padding: 6px 14px;
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
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: #94a3b8;
  padding: 20px;
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
}

.modal-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #0f172a;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
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
</style>