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
        <router-link to="/siswa" class="nav-item">
          <i class="bi bi-people-fill"></i>
          <span>Siswa</span>
        </router-link>
        <router-link to="/iuran" class="nav-item">
          <i class="bi bi-wallet2"></i>
          <span>Iuran</span>
        </router-link>
        <router-link to="/kelas" class="nav-item active">
          <i class="bi bi-easel-fill"></i>
          <span>Kelas</span>
        </router-link>
        <router-link to="/transaksi" class="nav-item">
        <i class="bi bi-wallet2"></i>
        <span>Transaksi</span>
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
.dashboard-wrapper { display: flex; width: 100vw; min-height: 100vh; background-color: var(--bg); color: #000000; }
.sidebar { width: 260px; background: #ffffff; padding: 28px 20px; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
.brand { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; padding-left: 8px; }
.brand-logo { width: 38px; height: 38px; background: var(--accent); color: #ffffff; font-weight: 800; font-size: 18px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.brand h2 { font-size: 20px; font-weight: 700; color: #000000; margin: 0; }
.nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: #475569; text-decoration: none; font-size: 14px; font-weight: 600; }
.nav-item.active { background: var(--accent); color: #ffffff; }
.btn-logout { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fef2f2; color: #ef4444; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; margin-top: auto; }

.main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.topbar h1 { font-size: 24px; font-weight: 700; color: #000000; margin: 0 0 4px 0; }
.topbar p { color: #64748b; font-size: 14px; margin: 0; }

.btn-add { background: var(--accent); color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
.btn-add:hover { opacity: 0.9; }

.content-section { background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid var(--border); }
.toolbar { margin-bottom: 24px; }
.search-box input { padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000; outline: none; width: 260px; }

/* Grid Layout */
.kelas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.kelas-card { background: #ffffff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; transition: box-shadow 0.2s; }
.kelas-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
.card-header h3 { font-size: 18px; font-weight: 700; color: #000000; margin: 0; }
.badge { background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

.card-body { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.info-row { display: flex; justify-content: space-between; font-size: 14px; }
.info-row .label { color: #64748b; }
.info-row .value { font-weight: 600; color: #000000; }

.card-actions { display: flex; gap: 8px; justify-content: flex-end; }
.btn-edit { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-edit:hover { background: #bae6fd; }
.btn-delete { background: #fee2e2; color: #ef4444; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-delete:hover { background: #fca5a5; }

.empty-state { grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 20px; }

/* Modal Styling */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 999; }
.modal-card { background: #ffffff; width: 100%; max-width: 420px; padding: 28px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.modal-card h3 { font-size: 18px; font-weight: 700; color: #000000; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; }
.form-group input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000000 !important; background-color: #ffffff; outline: none; box-sizing: border-box; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-submit { background: var(--accent); color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>