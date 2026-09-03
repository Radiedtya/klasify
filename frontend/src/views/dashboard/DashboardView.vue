<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-item active">
          <i class="bi bi-grid-fill"></i>
          <span>Dashboard</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-cash-stack"></i>
          <span>Uang Kas</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-people-fill"></i>
          <span>Siswa</span>
        </a>
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
          <h1>Pengelolaan Kas Kelas</h1>
          <p>Catat dan pantau transaksi kas kelas secara real-time.</p>
        </div>
        <button @click="showModal = true" class="btn-add">
          + Tambah Transaksi
        </button>
      </header>

      <!-- Grid Ringkasan Kas Otomatis Terhitung -->
      <section class="cards-grid">
        <div class="card">
          <div class="card-info">
            <h3>Total Sisa Kas</h3>
            <p class="amount">Rp {{ formatRupiah(totalKas) }}</p>
          </div>
          <div class="card-icon blue">💰</div>
        </div>

        <div class="card">
          <div class="card-info">
            <h3>Total Pemasukan</h3>
            <p class="amount green">+ Rp {{ formatRupiah(totalPemasukan) }}</p>
          </div>
          <div class="card-icon green">📈</div>
        </div>

        <div class="card">
          <div class="card-info">
            <h3>Total Pengeluaran</h3>
            <p class="amount red">- Rp {{ formatRupiah(totalPengeluaran) }}</p>
          </div>
          <div class="card-icon red">📉</div>
        </div>
      </section>

      <!-- Tabel Transaksi Kas (FULL CRUD IMPLEMENTED) -->
      <section class="table-section">
        <h2>Riwayat Transaksi</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Tipe</th>
              <th>Jumlah</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactions" :key="item.id">
              <td>{{ item.date }}</td>
              <td>{{ item.title }}</td>
              <td>
                <span :class="['badge', item.type === 'in' ? 'in' : 'out']">
                  {{ item.type === 'in' ? 'Pemasukan' : 'Pengeluaran' }}
                </span>
              </td>
              <td :class="item.type === 'in' ? 'text-green' : 'text-red'">
                {{ item.type === 'in' ? '+' : '-' }} Rp {{ formatRupiah(item.amount) }}
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openDetailModal(item)" class="btn-show" title="Detail / Read">
                    Lihat
                  </button>
                  <button @click="openEditModal(item)" class="btn-edit" title="Edit / Update">
                    Edit
                  </button>
                  <button @click="deleteTransaction(item.id)" class="btn-delete" title="Hapus / Delete">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="transactions.length === 0">
              <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
                Belum ada transaksi recorded.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Modal Form (CREATE) -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Tambah Transaksi Baru</h3>
        <form @submit.prevent="addTransaction">
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" v-model="form.title" placeholder="Contoh: Uang Kas Ani / Beli Spidol" required />
          </div>

          <div class="form-group">
            <label>Jenis Transaksi</label>
            <select v-model="form.type" required>
              <option value="in">Pemasukan (+)</option>
              <option value="out">Pengeluaran (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="form.amount" placeholder="10000" min="1" required />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail (READ / SHOW) -->
    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Rincian Transaksi</h3>
        <div class="detail-container" v-if="selectedDetail">
          <div class="detail-item">
            <span class="detail-label">ID Transaksi</span>
            <span class="detail-value">#{{ selectedDetail.id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tanggal</span>
            <span class="detail-value">{{ selectedDetail.date }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Keterangan</span>
            <span class="detail-value">{{ selectedDetail.title }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori Tipe</span>
            <span :class="['badge', selectedDetail.type === 'in' ? 'in' : 'out']">
              {{ selectedDetail.type === 'in' ? 'Pemasukan (+)' : 'Pengeluaran (-)' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nominal Uang</span>
            <span :class="['detail-amount', selectedDetail.type === 'in' ? 'text-green' : 'text-red']">
              {{ selectedDetail.type === 'in' ? '+' : '-' }} Rp {{ formatRupiah(selectedDetail.amount) }}
            </span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="showDetailModal = false" class="btn-cancel">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Modal Form (UPDATE / EDIT) -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Edit Transaksi</h3>
        <form @submit.prevent="updateTransaction">
          <div class="form-group">
            <label>Keterangan</label>
            <input type="text" v-model="editForm.title" placeholder="Contoh: Uang Kas Ani" required />
          </div>

          <div class="form-group">
            <label>Jenis Transaksi</label>
            <select v-model="editForm.type" required>
              <option value="in">Pemasukan (+)</option>
              <option value="out">Pengeluaran (-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Jumlah (Rp)</label>
            <input type="number" v-model.number="editForm.amount" placeholder="10000" min="1" required />
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
const showModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const selectedDetail = ref(null)

// State data transaksi (READ initial data)
const transactions = ref([
  { id: 1, date: '03 Sep 2026', title: 'Uang Kas Mingguan - Ani', type: 'in', amount: 10000 },
  { id: 2, date: '02 Sep 2026', title: 'Beli Spidol Boardmarker', type: 'out', amount: 15000 }
])

// Form state (CREATE)
const form = reactive({
  title: '',
  type: 'in',
  amount: null
})

// Form state (UPDATE)
const editForm = reactive({
  id: null,
  title: '',
  type: 'in',
  amount: null
})

// Hitung-hitungan kalkulasi otomatis (KAS)
const totalPemasukan = computed(() => {
  return transactions.value
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalPengeluaran = computed(() => {
  return transactions.value
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalKas = computed(() => totalPemasukan.value - totalPengeluaran.value)

// Format angka ke format Rupiah
const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

// Fungsi CREATE
const addTransaction = () => {
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  
  transactions.value.unshift({
    id: Date.now(),
    date: today,
    title: form.title,
    type: form.type,
    amount: form.amount
  })

  // Reset form & tutup modal
  form.title = ''
  form.type = 'in'
  form.amount = null
  showModal.value = false
}

// Fungsi SHOW / READ Single Item
const openDetailModal = (item) => {
  selectedDetail.value = item
  showDetailModal.value = true
}

// Fungsi Buka Modal Edit & Isi Datanya
const openEditModal = (item) => {
  editForm.id = item.id
  editForm.title = item.title
  editForm.type = item.type
  editForm.amount = item.amount
  showEditModal.value = true
}

// Fungsi UPDATE
const updateTransaction = () => {
  const index = transactions.value.findIndex(t => t.id === editForm.id)
  if (index !== -1) {
    transactions.value[index].title = editForm.title
    transactions.value[index].type = editForm.type
    transactions.value[index].amount = editForm.amount
  }
  showEditModal.value = false
}

// Fungsi DELETE
const deleteTransaction = (id) => {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    transactions.value = transactions.value.filter(t => t.id !== id)
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

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px; }
.card { background: #ffffff; padding: 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
.card-info h3 { font-size: 13px; color: #64748b; margin-bottom: 8px; font-weight: 600; }
.amount { font-size: 22px; font-weight: 700; color: #000000; margin: 0; }
.amount.green { color: #10b981; }
.amount.red { color: #ef4444; }
.card-icon { font-size: 28px; padding: 12px; border-radius: 12px; background: #f8fafc; }

.table-section { background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid var(--border); }
.table-section h2 { font-size: 18px; font-weight: 700; color: #000000; margin-bottom: 20px; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: #000000; }
.data-table th { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.in { background: #d1fae5; color: #065f46; }
.badge.out { background: #fee2e2; color: #991b1b; }
.text-green { color: #10b981; font-weight: 600; }
.text-red { color: #ef4444; font-weight: 600; }

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
.detail-amount { font-size: 16px; font-weight: 700; }

/* Modal Styling */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: flex; justify-content: center; align-items: center; z-index: 999; }
.modal-card { background: #ffffff; width: 100%; max-width: 420px; padding: 28px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.modal-card h3 { font-size: 18px; font-weight: 700; color: #000000; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; }
.form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; color: #000000 !important; background-color: #ffffff; outline: none; box-sizing: border-box; transition: all 0.2s ease; }
.form-group input::placeholder { color: #94a3b8; }
.form-group input:focus, .form-group select:focus { border-color: var(--accent); box-shadow: 0 0 0 0.2rem var(--accent-bg); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-submit { background: var(--accent); color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>