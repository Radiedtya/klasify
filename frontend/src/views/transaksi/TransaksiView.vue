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
        <router-link to="/transaksi" class="nav-item active">
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
          <h1>Riwayat Transaksi</h1>
          <p>Riwayat dan konfirmasi transaksi kas kelas.</p>
        </div>
        <button @click="showAddModal = true" class="btn-add">
          + Catat Transaksi
        </button>
      </header>

      <!-- Tabel Section -->
      <section class="table-section">
        <div class="table-header-wrapper">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari siswa / deskripsi..." 
            />
          </div>

          <div class="filter-wrapper">
            <select v-model="selectedTipe" class="select-chip">
              <option value="semua">Semua Transaksi</option>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Siswa / Keterangan</th>
              <th>Tanggal</th>
              <th>Metode</th>
              <th>Jumlah</th>
              <th>Tipe</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredTransaksi" :key="item.id">
              <td>#{{ item.id }}</td>
              <td><strong>{{ item.siswa }}</strong></td>
              <td>{{ item.tanggal }}</td>
              <td>{{ item.metode }}</td>
              <td>Rp {{ item.jumlah.toLocaleString('id-ID') }}</td>
              <td>
                <span :class="['badge', item.tipe === 'Pemasukan' ? 'in' : 'out']">
                  {{ item.tipe }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(item)" class="btn-edit">Edit</button>
                  <button @click="deleteTransaksi(item.id)" class="btn-delete">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTransaksi.length === 0">
              <td colspan="7" class="empty-state">
                Data transaksi tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL CATAT TRANSAKSI (CREATE) -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Catat Transaksi Baru</h3>
        <form @submit.prevent="addTransaksi">
          <div class="form-group">
            <label>Nama Siswa / Keterangan</label>
            <input type="text" v-model="form.siswa" placeholder="Contoh: Siti Nurhaliza / Beli Spidol" required />
          </div>

          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="form.tanggal" required />
          </div>

          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select v-model="form.metode" required>
              <option value="Tunai">Tunai</option>
              <option value="Transfer QRIS">Transfer QRIS</option>
              <option value="Transfer Bank">Transfer Bank</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="form.jumlah" placeholder="20000" required />
          </div>

          <div class="form-group">
            <label>Tipe Transaksi</label>
            <select v-model="form.tipe" required>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EDIT TRANSAKSI (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Data Transaksi</h3>
        <form @submit.prevent="updateTransaksi">
          <div class="form-group">
            <label>Nama Siswa / Keterangan</label>
            <input type="text" v-model="editForm.siswa" required />
          </div>

          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="editForm.tanggal" required />
          </div>

          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select v-model="editForm.metode" required>
              <option value="Tunai">Tunai</option>
              <option value="Transfer QRIS">Transfer QRIS</option>
              <option value="Transfer Bank">Transfer Bank</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="editForm.jumlah" required />
          </div>

          <div class="form-group">
            <label>Tipe Transaksi</label>
            <select v-model="editForm.tipe" required>
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
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
import axios from 'axios'

const router = useRouter()

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search & Filter State
const searchQuery = ref('')
const selectedTipe = ref('semua')

// Data Transaksi dari Backend
const transaksiList = ref([])

// Form States
const form = reactive({
  siswa: '',
  tanggal: new Date().toISOString().split('T')[0],
  metode: 'Tunai',
  jumlah: 20000,
  tipe: 'Pemasukan'
})

const editForm = reactive({
  id: null,
  siswa: '',
  tanggal: '',
  metode: 'Tunai',
  jumlah: 0,
  tipe: 'Pemasukan'
})

// Configuration Axios Instance / Headers
const API_BASE_URL = 'http://127.0.0.1:8000/api' // Sesuaikan port/URL backend
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

// 1. Fetch Data dari Backend (READ)
const fetchTransaksi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaksi`, getAuthHeader())
    // Menyesuaikan jika response format backend adalah response.data.data
    transaksiList.value = response.data.data || response.data
  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error)
    if (error.response && error.response.status === 401) {
      handleLogout()
    }
  }
}

// Fetch data saat komponen pertama kali dimuat
onMounted(() => {
  fetchTransaksi()
})

// Filter Logic (Tetap berjalan di frontend dari hasil fetch)
const filteredTransaksi = computed(() => {
  return transaksiList.value.filter(item => {
    const matchSearch = item.siswa ? item.siswa.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const matchTipe = selectedTipe.value === 'semua' || item.tipe === selectedTipe.value
    return matchSearch && matchTipe
  })
})

// 2. Tambah Data (CREATE)
const addTransaksi = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transaksi`, form, getAuthHeader())
    
    // Tambahkan item baru dari respon server atau refetch data
    if (response.data.data) {
      transaksiList.value.unshift(response.data.data)
    } else {
      await fetchTransaksi()
    }

    // Reset Form & Tutup Modal
    form.siswa = ''
    form.jumlah = 20000
    form.metode = 'Tunai'
    form.tipe = 'Pemasukan'
    showAddModal.value = false
  } catch (error) {
    console.error('Gagal menambah transaksi:', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

// Open Edit Modal
const openEditModal = (item) => {
  editForm.id = item.id
  editForm.siswa = item.siswa
  editForm.tanggal = item.tanggal
  editForm.metode = item.metode
  editForm.jumlah = item.jumlah
  editForm.tipe = item.tipe
  showEditModal.value = true
}

// 3. Update Data (UPDATE)
const updateTransaksi = async () => {
  try {
    const response = await axios.put(`${API_BASE_URL}/transaksi/${editForm.id}`, editForm, getAuthHeader())
    
    const index = transaksiList.value.findIndex(t => t.id === editForm.id)
    if (index !== -1) {
      transaksiList.value[index] = response.data.data || { ...editForm }
    }
    
    showEditModal.value = false
  } catch (error) {
    console.error('Gagal memperbarui transaksi:', error)
    alert('Terjadi kesalahan saat mengubah data.')
  }
}

// 4. Hapus Data (DELETE)
const deleteTransaksi = async (id) => {
  if (confirm('Yakin ingin menghapus riwayat transaksi ini?')) {
    try {
      await axios.delete(`${API_BASE_URL}/transaksi/${id}`, getAuthHeader())
      transaksiList.value = transaksiList.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Gagal menghapus transaksi:', error)
      alert('Gagal menghapus data dari server.')
    }
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

.badge.in {
  background: #d1fae5;
  color: #065f46;
}

.badge.out {
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