<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar (Sama dengan DashboardView) -->
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
                  <i class="bi bi-wallet2"></i>
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
          <h1>Kelola Data Siswa</h1>
          <p>Kelola data siswa dan status pembayaran iuran kas kelas.</p>
        </div>
        <button @click="showAddModal = true" class="btn-add">
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
              placeholder="Cari nama siswa..." 
            />
          </div>

          <!-- Filter Tab -->
          <div class="table-tabs">
            <button 
              :class="['tab-btn', activeTab === 'semua' ? 'active' : '']" 
              @click="activeTab = 'semua'">
              Semua ({{ siswaList.length }})
            </button>
            <button 
              :class="['tab-btn', activeTab === 'lunas' ? 'active' : '']" 
              @click="activeTab = 'lunas'">
              Sudah Bayar
            </button>
            <button 
              :class="['tab-btn', activeTab === 'belum' ? 'active' : '']" 
              @click="activeTab = 'belum'">
              Belum Bayar
            </button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Kontak</th>
              <th>Status Iuran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="siswa in filteredSiswa" :key="siswa.id">
              <td>#{{ siswa.id }}</td>
              <td><strong>{{ siswa.nama }}</strong></td>
              <td>{{ siswa.kelas }}</td>
              <td>{{ siswa.kontak || '-' }}</td>
              <td>
                <span :class="['badge', siswa.status_kas === 'lunas' ? 'in' : 'out']">
                  {{ siswa.status_kas === 'lunas' ? 'Sudah Bayar' : 'Belum Bayar' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openDetailModal(siswa)" class="btn-show" title="Detail">Lihat</button>
                  <button @click="openEditModal(siswa)" class="btn-edit" title="Edit">Edit</button>
                  <button @click="deleteSiswa(siswa.id)" class="btn-delete" title="Hapus">Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredSiswa.length === 0">
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
      <div class="modal-card">
        <h3>Tambah Siswa Baru</h3>
        <form @submit.prevent="addSiswa">
          <div class="form-group">
            <label>Nama Lengkap</label>
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
            <label>Kontak / No. HP</label>
            <input type="text" v-model="form.kontak" placeholder="081234567890" />
          </div>

          <div class="form-group">
            <label>Status Iuran Kas</label>
            <select v-model="form.status_kas" required>
              <option value="lunas">Sudah Bayar (Lunas)</option>
              <option value="belum">Belum Bayar</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
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
            <span class="detail-label">ID Siswa</span>
            <span class="detail-value">#{{ selectedDetail.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nama Lengkap</span>
            <span class="detail-value">{{ selectedDetail.nama }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kelas</span>
            <span class="detail-value">{{ selectedDetail.kelas }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kontak</span>
            <span class="detail-value">{{ selectedDetail.kontak || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status Iuran</span>
            <span :class="['badge', selectedDetail.status_kas === 'lunas' ? 'in' : 'out']">
              {{ selectedDetail.status_kas === 'lunas' ? 'Sudah Bayar' : 'Belum Bayar' }}
            </span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="showDetailModal = false" class="btn-cancel">Tutup</button>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT (UPDATE) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Data Siswa</h3>
        <form @submit.prevent="updateSiswa">
          <div class="form-group">
            <label>Nama Lengkap</label>
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
            <label>Kontak / No. HP</label>
            <input type="text" v-model="editForm.kontak" />
          </div>

          <div class="form-group">
            <label>Status Iuran Kas</label>
            <select v-model="editForm.status_kas" required>
              <option value="lunas">Sudah Bayar (Lunas)</option>
              <option value="belum">Belum Bayar</option>
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

// Modal states
const showAddModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedDetail = ref(null)

// Search & Filter State
const searchQuery = ref('')
const activeTab = ref('semua')

// Data Dummy Siswa
const siswaList = ref([
  { id: 101, nama: 'Siti Nurhaliza', kelas: 'XII RPL 1', kontak: '081298765432', status_kas: 'lunas' },
  { id: 102, nama: 'Rangga Pratama', kelas: 'XII RPL 1', kontak: '085711223344', status_kas: 'belum' },
  { id: 103, nama: 'Ani Rahayu', kelas: 'XII RPL 1', kontak: '089655443322', status_kas: 'lunas' }
])

// Form State
const form = reactive({
  nama: '',
  kelas: 'XII RPL 1',
  kontak: '',
  status_kas: 'belum'
})

const editForm = reactive({
  id: null,
  nama: '',
  kelas: 'XII RPL 1',
  kontak: '',
  status_kas: 'belum'
})

// Filter Logic
const filteredSiswa = computed(() => {
  return siswaList.value.filter(siswa => {
    const matchName = siswa.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (activeTab.value === 'lunas') return matchName && siswa.status_kas === 'lunas'
    if (activeTab.value === 'belum') return matchName && siswa.status_kas === 'belum'
    return matchName
  })
})

// CRUD Functions
const addSiswa = () => {
  siswaList.value.unshift({
    id: Date.now(),
    nama: form.nama,
    kelas: form.kelas,
    kontak: form.kontak,
    status_kas: form.status_kas
  })

  // Reset Form
  form.nama = ''
  form.kontak = ''
  form.status_kas = 'belum'
  showAddModal.value = false
}

const openDetailModal = (siswa) => {
  selectedDetail.value = siswa
  showDetailModal.value = true
}

const openEditModal = (siswa) => {
  editForm.id = siswa.id
  editForm.nama = siswa.nama
  editForm.kelas = siswa.kelas
  editForm.kontak = siswa.kontak
  editForm.status_kas = siswa.status_kas
  showEditModal.value = true
}

const updateSiswa = () => {
  const index = siswaList.value.findIndex(s => s.id === editForm.id)
  if (index !== -1) {
    siswaList.value[index].nama = editForm.nama
    siswaList.value[index].kelas = editForm.kelas
    siswaList.value[index].kontak = editForm.kontak
    siswaList.value[index].status_kas = editForm.status_kas
  }
  showEditModal.value = false
}

const deleteSiswa = (id) => {
  if (confirm('Yakin ingin menghapus data siswa ini?')) {
    siswaList.value = siswaList.value.filter(s => s.id !== id)
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

.table-section { background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid var(--border); }
.table-header-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.search-box input { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000; outline: none; width: 220px; }

.table-tabs { display: flex; gap: 8px; }
.tab-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.tab-btn.active { background: var(--accent); color: #ffffff; }

.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: #000000; }
.data-table th { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.in { background: #d1fae5; color: #065f46; }
.badge.out { background: #fee2e2; color: #991b1b; }

.action-buttons { display: flex; gap: 6px; }
.btn-show { background: #f1f5f9; color: #475569; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-show:hover { background: #e2e8f0; }
.btn-edit { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-edit:hover { background: #bae6fd; }
.btn-delete { background: #fee2e2; color: #ef4444; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-delete:hover { background: #fca5a5; }

/* Detail Read Section */
.detail-container { display: flex; flex-direction: column; gap: 14px; margin: 20px 0; }
.detail-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: 8px; }
.detail-label { font-size: 13px; color: #64748b; font-weight: 600; }
.detail-value { font-size: 14px; color: #000000; font-weight: 600; }

/* Modal Styling */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 999; }
.modal-card { background: #ffffff; width: 100%; max-width: 420px; padding: 28px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.modal-card h3 { font-size: 18px; font-weight: 700; color: #000000; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; }
.form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000000 !important; background-color: #ffffff; outline: none; box-sizing: border-box; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-submit { background: var(--accent); color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>