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
          <h1>Kelola Iuran Kas</h1>
          <p>Status dan riwayat pembayaran iuran kas per siswa.</p>
        </div>
        <button @click="showAddModal = true" class="btn-add">
          + Catat Pembayaran
        </button>
      </header>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari nama siswa..." 
            />
          </div>

          <div class="filter-wrapper">
            <select v-model="selectedKelas" class="select-chip">
              <option value="semua">Semua Kelas</option>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XII TKJ 1">XII TKJ 1</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Bulan</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredIuran" :key="item.id">
              <td>#{{ item.id }}</td>
              <td><strong>{{ item.nama }}</strong></td>
              <td>{{ item.kelas }}</td>
              <td>{{ item.bulan }}</td>
              <td>Rp {{ item.nominal.toLocaleString('id-ID') }}</td>
              <td>
                <span :class="['badge', item.status === 'Lunas' ? 'sudah' : 'belum']">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(item)" class="btn-edit" title="Edit">Edit</button>
                  <button @click="deleteIuran(item.id)" class="btn-delete" title="Hapus">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredIuran.length === 0">
              <td colspan="7" style="text-align: center; color: #94a3b8; padding: 20px;">
                Data iuran tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL CATAT IURAN (CREATE) -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Catat Pembayaran Iuran</h3>
        <form @submit.prevent="addIuran">
          <div class="form-group">
            <label>Nama Siswa</label>
            <input type="text" v-model="form.nama" placeholder="Contoh: Rangga Pratama" required />
          </div>

          <div class="form-group">
            <label>Kelas</label>
            <select v-model="form.kelas" required>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XII TKJ 1">XII TKJ 1</option>
            </select>
          </div>

          <div class="form-group">
            <label>Bulan Pembayaran</label>
            <select v-model="form.bulan" required>
              <option value="Januari 2026">Januari 2026</option>
              <option value="Februari 2026">Februari 2026</option>
              <option value="Maret 2026">Maret 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="Mei 2026">Mei 2026</option>
            </select>
          </div>

          <div class="form-group">
            <label>Nominal (Rp)</label>
            <input type="number" v-model.number="form.nominal" placeholder="20000" required />
          </div>

          <div class="form-group">
            <label>Status Pembayaran</label>
            <select v-model="form.status" required>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EDIT IURAN (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Data Iuran</h3>
        <form @submit.prevent="updateIuran">
          <div class="form-group">
            <label>Nama Siswa</label>
            <input type="text" v-model="editForm.nama" required />
          </div>

          <div class="form-group">
            <label>Kelas</label>
            <select v-model="editForm.kelas" required>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XII TKJ 1">XII TKJ 1</option>
            </select>
          </div>

          <div class="form-group">
            <label>Bulan Pembayaran</label>
            <select v-model="editForm.bulan" required>
              <option value="Januari 2026">Januari 2026</option>
              <option value="Februari 2026">Februari 2026</option>
              <option value="Maret 2026">Maret 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="Mei 2026">Mei 2026</option>
            </select>
          </div>

          <div class="form-group">
            <label>Nominal (Rp)</label>
            <input type="number" v-model.number="editForm.nominal" required />
          </div>

          <div class="form-group">
            <label>Status Pembayaran</label>
            <select v-model="editForm.status" required>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search & Filter State
const searchQuery = ref('')
const selectedKelas = ref('semua')

// Data Dummy Iuran
const iuranList = ref([
  { id: 1, nama: 'Siti Nurhaliza', kelas: 'XII RPL 1', bulan: 'Mei 2026', nominal: 20000, status: 'Lunas' },
  { id: 2, nama: 'Rangga Pratama', kelas: 'XII RPL 1', bulan: 'Mei 2026', nominal: 20000, status: 'Belum Lunas' },
  { id: 3, nama: 'Ani Rahayu', kelas: 'XII RPL 2', bulan: 'Mei 2026', nominal: 20000, status: 'Lunas' }
])

// Form States
const form = reactive({
  nama: '',
  kelas: 'XII RPL 1',
  bulan: 'Mei 2026',
  nominal: 20000,
  status: 'Lunas'
})

const editForm = reactive({
  id: null,
  nama: '',
  kelas: 'XII RPL 1',
  bulan: '',
  nominal: 0,
  status: 'Lunas'
})

// Filter Logic
const filteredIuran = computed(() => {
  return iuranList.value.filter(item => {
    const matchName = item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchKelas = selectedKelas.value === 'semua' || item.kelas === selectedKelas.value
    return matchName && matchKelas
  })
})

// CRUD Actions
const addIuran = () => {
  iuranList.value.unshift({
    id: Date.now(),
    nama: form.nama,
    kelas: form.kelas,
    bulan: form.bulan,
    nominal: form.nominal,
    status: form.status
  })

  // Reset Form
  form.nama = ''
  showAddModal.value = false
}

const openEditModal = (item) => {
  editForm.id = item.id
  editForm.nama = item.nama
  editForm.kelas = item.kelas
  editForm.bulan = item.bulan
  editForm.nominal = item.nominal
  editForm.status = item.status
  showEditModal.value = true
}

const updateIuran = () => {
  const index = iuranList.value.findIndex(i => i.id === editForm.id)
  if (index !== -1) {
    iuranList.value[index] = { ...editForm }
  }
  showEditModal.value = false
}

const deleteIuran = (id) => {
  if (confirm('Yakin ingin menghapus riwayat iuran ini?')) {
    iuranList.value = iuranList.value.filter(i => i.id !== id)
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

.select-chip {
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  font-weight: 600;
}

.select-chip:focus {
  border-color: #3b82f6;
}

/* Tabel Data */
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

/* Badge Status Iuran */
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

.form-group input, .form-group select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus, .form-group select:focus {
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