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
        <router-link to="/kelas" class="nav-item">
          <i class="bi bi-easel-fill"></i>
          <span>Kelas</span>
        </router-link>
        <router-link to="/iuran" class="nav-item">
          <i class="bi bi-wallet2"></i>
          <span>Iuran</span>
        </router-link>
        <router-link to="/transaksi" class="nav-item">
          <i class="bi bi-arrow-left-right"></i>
          <span>Transaksi</span>
        </router-link>
        <router-link to="/pengeluaran" class="nav-item active">
          <i class="bi bi-file-earmark-text-fill"></i>
          <span>Pengeluaran</span>
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
              <td colspan="7" style="text-align: center; color: #94a3b8; padding: 20px;">
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search & Filter State
const searchQuery = ref('')
const selectedStatus = ref('semua')

// Data Dummy Pengeluaran
const pengeluaranList = ref([
  { id: 201, kategori: 'Pembelian Spidol & Penghapus', nominal: 25000, pengaju: 'Siti Nurhaliza', tanggal: '2026-05-01', status: 'Disetujui' },
  { id: 202, kategori: 'Fotocopy Materil Pembelajaran', nominal: 15000, pengaju: 'Ani Rahayu', tanggal: '2026-05-03', status: 'Diproses' },
  { id: 203, kategori: 'Sewa Konsumsi Acara Kelas', nominal: 150000, pengaju: 'Budi Santoso', tanggal: '2026-05-04', status: 'Ditolak' }
])

// Form States
const form = reactive({
  kategori: '',
  nominal: 0,
  pengaju: '',
  tanggal: new Date().toISOString().split('T')[0],
  status: 'Diproses'
})

const editForm = reactive({
  id: null,
  kategori: '',
  nominal: 0,
  pengaju: '',
  tanggal: '',
  status: 'Diproses'
})

// Filter Logic
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

// CRUD Actions
const addPengeluaran = () => {
  pengeluaranList.value.unshift({
    id: Date.now(),
    kategori: form.kategori,
    nominal: form.nominal,
    pengaju: form.pengaju,
    tanggal: form.tanggal,
    status: form.status
  })

  // Reset Form
  form.kategori = ''
  form.nominal = 0
  form.pengaju = ''
  showAddModal.value = false
}

const openEditModal = (item) => {
  editForm.id = item.id
  editForm.kategori = item.kategori
  editForm.nominal = item.nominal
  editForm.pengaju = item.pengaju
  editForm.tanggal = item.tanggal
  editForm.status = item.status
  showEditModal.value = true
}

const updatePengeluaran = () => {
  const index = pengeluaranList.value.findIndex(p => p.id === editForm.id)
  if (index !== -1) {
    pengeluaranList.value[index] = { ...editForm }
  }
  showEditModal.value = false
}

const deletePengeluaran = (id) => {
  if (confirm('Yakin ingin menghapus pengajuan pengeluaran ini?')) {
    pengeluaranList.value = pengeluaranList.value.filter(p => p.id !== id)
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

.select-chip { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000; background: #ffffff; outline: none; }

.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: #000000; }
.data-table th { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.approved { background: #d1fae5; color: #065f46; }
.badge.pending { background: #fef3c7; color: #92400e; }
.badge.rejected { background: #fee2e2; color: #991b1b; }

.action-buttons { display: flex; gap: 6px; }
.btn-edit { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-edit:hover { background: #bae6fd; }
.btn-delete { background: #fee2e2; color: #ef4444; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn-delete:hover { background: #fca5a5; }

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