<template>
  <div class="dashboard-wrapper">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>
      <nav class="nav-menu">
        <router-link to="/guru/dashboard" class="nav-item"><i class="bi bi-grid-fill"></i><span>Dashboard</span></router-link>
        <router-link to="/guru/kelas" class="nav-item"><i class="bi bi-easel-fill"></i><span>Data Kelas</span></router-link>
        <router-link to="/guru/siswa" class="nav-item active"><i class="bi bi-people-fill"></i><span>Data Siswa</span></router-link>
        <router-link to="/guru/iuran" class="nav-item"><i class="bi bi-wallet2"></i><span>Data Iuran</span></router-link>
        <router-link to="/guru/transaksi" class="nav-item"><i class="bi bi-receipt"></i><span>Transaksi</span></router-link>
        <router-link to="/guru/pengeluaran" class="nav-item"><i class="bi bi-bag-dash-fill"></i><span>Pengeluaran</span></router-link>
        <router-link to="/guru/keterlambatan" class="nav-item"><i class="bi bi-clock-history"></i><span>Keterlambatan</span></router-link>
        <router-link to="/guru/laporan" class="nav-item"><i class="bi bi-file-earmark-bar-graph-fill"></i><span>Laporan</span></router-link>
        <router-link to="/guru/notifikasi" class="nav-item"><i class="bi bi-bell-fill"></i><span>Notifikasi</span></router-link>
        <router-link to="/guru/pengaturan" class="nav-item"><i class="bi bi-gear-fill"></i><span>Pengaturan</span></router-link>
        <router-link to="/guru/profile" class="nav-item"><i class="bi bi-person-fill"></i><span>Profile</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn-logout"><i class="bi bi-box-arrow-right"></i><span>Keluar</span></button>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <h1>Data Siswa</h1>
          <p>Daftar seluruh siswa di kelas <strong>XII RPL 1</strong>.</p>
        </div>
        <button class="btn-primary" @click="openModal"><i class="bi bi-plus-lg"></i> Tambah Siswa</button>
      </header>

      <div class="card-box">
        <div class="table-header">
          <input type="text" v-model="search" placeholder="Cari nama atau NIS..." class="search-input" />
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Status Iuran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="siswa in filteredSiswa" :key="siswa.id">
              <td>{{ siswa.nis }}</td>
              <td><strong>{{ siswa.nama }}</strong></td>
              <td>{{ siswa.jk === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
              <td>
                <span :class="['badge', siswa.status === 'Lunas' ? 'badge-success' : 'badge-warning']">
                  {{ siswa.status }}
                </span>
              </td>
              <td>
                <button class="btn-action edit" @click="editSiswa(siswa)"><i class="bi bi-pencil"></i></button>
                <button class="btn-action delete" @click="deleteSiswa(siswa.id)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/service/api' // Import helper fetch

const router = useRouter()
const search = ref('')
const siswas = ref([]) // Akan diisi data asli dari database
const loading = ref(true)

// 1. Ambil Data Siswa (GET /api/siswa)
const fetchSiswa = async () => {
  loading.value = true
  try {
    const res = await apiFetch('/siswa', { method: 'GET' })
    // Menyesuaikan struktur respon data dari Laravel Controller
    siswas.value = res.data || res
  } catch (err) {
    console.error('Gagal mengambil data siswa:', err.message)
  } finally {
    loading.value = false
  }
}

// 2. Hapus Siswa (DELETE /api/siswa/{id})
const deleteSiswa = async (id) => {
  if (confirm('Yakin hapus data siswa ini?')) {
    try {
      await apiFetch(`/siswa/${id}`, { method: 'DELETE' })
      alert('Siswa berhasil dihapus!')
      fetchSiswa() // Refresh data
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message)
    }
  }
}

// 3. Logout (POST /api/logout)
const handleLogout = async () => {
  try {
    await apiFetch('/logout', { method: 'POST' })
  } catch (e) {
    // Abaikan jika error
  } finally {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

// Pencarian Siswa
const filteredSiswa = computed(() => {
  if (!Array.isArray(siswas.value)) return []
  return siswas.value.filter(s => 
    (s.nama && s.nama.toLowerCase().includes(search.value.toLowerCase())) || 
    (s.nis && s.nis.includes(search.value))
  )
})

const openModal = () => alert('Modal Tambah Siswa dibuka')
const editSiswa = (s) => alert('Edit siswa: ' + s.nama)

// Ambil data dari backend saat halaman dimuat
onMounted(() => {
  fetchSiswa()
})
</script>

<style scoped>
.dashboard-wrapper { display: flex; width: 100vw; min-height: 100vh; background-color: #f8fafc; color: #0f172a; font-family: 'Inter', sans-serif; }
.sidebar { width: 260px; background: #ffffff; padding: 28px 20px; display: flex; flex-direction: column; border-right: 1px solid #e2e8f0; }
.brand { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; }
.brand-logo { width: 38px; height: 38px; background: #3b82f6; color: #fff; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.brand h2 { font-size: 20px; font-weight: 700; margin: 0; }
.nav-menu { display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; color: #64748b; text-decoration: none; font-size: 13px; font-weight: 600; }
.nav-item:hover { background: #f1f5f9; color: #0f172a; }
.nav-item.active { background: #3b82f6; color: #ffffff; }
.btn-logout { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 10px; }
.main-content { flex: 1; padding: 32px 40px; overflow-y: auto; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.topbar h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px 0; }
.topbar p { color: #64748b; font-size: 13px; margin: 0; }
.btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.card-box { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
.table-header { margin-bottom: 16px; }
.search-input { width: 260px; padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; outline: none; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
.custom-table th, .custom-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
.custom-table th { background: #f8fafc; color: #64748b; font-weight: 600; }
.badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.badge-success { background: #dcfce7; color: #15803d; }
.badge-warning { background: #fef3c7; color: #b45309; }
.btn-action { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px 8px; border-radius: 4px; }
.btn-action.edit { color: #3b82f6; }
.btn-action.delete { color: #ef4444; }
</style>