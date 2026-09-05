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
        <router-link to="/transaksi" class="nav-item active">
          <i class="bi bi-arrow-left-right"></i>
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
              <td colspan="7" style="text-align: center; color: #94a3b8; padding: 20px;">
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)

// Search & Filter State
const searchQuery = ref('')
const selectedTipe = ref('semua')

// Data Dummy Transaksi
const transaksiList = ref([
  { id: 101, siswa: 'Siti Nurhaliza', tanggal: '2026-05-02', metode: 'Tunai', jumlah: 20000, tipe: 'Pemasukan' },
  { id: 102, siswa: 'Pembelian Spidol & Penghapus', tanggal: '2026-05-03', metode: 'Tunai', jumlah: 15000, tipe: 'Pengeluaran' },
  { id: 103, siswa: 'Ani Rahayu', tanggal: '2026-05-04', metode: 'Transfer QRIS', jumlah: 20000, tipe: 'Pemasukan' }
])

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

// Filter Logic
const filteredTransaksi = computed(() => {
  return transaksiList.value.filter(item => {
    const matchSearch = item.siswa.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchTipe = selectedTipe.value === 'semua' || item.tipe === selectedTipe.value
    return matchSearch && matchTipe
  })
})

// CRUD Actions
const addTransaksi = () => {
  transaksiList.value.unshift({
    id: Date.now(),
    siswa: form.siswa,
    tanggal: form.tanggal,
    metode: form.metode,
    jumlah: form.jumlah,
    tipe: form.tipe
  })

  // Reset Form
  form.siswa = ''
  showAddModal.value = false
}

const openEditModal = (item) => {
  editForm.id = item.id
  editForm.siswa = item.siswa
  editForm.tanggal = item.tanggal
  editForm.metode = item.metode
  editForm.jumlah = item.jumlah
  editForm.tipe = item.tipe
  showEditModal.value = true
}

const updateTransaksi = () => {
  const index = transaksiList.value.findIndex(t => t.id === editForm.id)
  if (index !== -1) {
    transaksiList.value[index] = { ...editForm }
  }
  showEditModal.value = false
}

const deleteTransaksi = (id) => {
  if (confirm('Yakin ingin menghapus riwayat transaksi ini?')) {
    transaksiList.value = transaksiList.value.filter(t => t.id !== id)
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
.badge.in { background: #d1fae5; color: #065f46; }
.badge.out { background: #fee2e2; color: #991b1b; }

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