<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar Guru -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>

      <nav class="nav-menu">
        <router-link to="/guru/dashboard" class="nav-item active"><i class="bi bi-grid-fill"></i><span>Dashboard</span></router-link>
        <router-link to="/guru/kelas" class="nav-item"><i class="bi bi-easel-fill"></i><span>Data Kelas</span></router-link>
        <router-link to="/guru/siswa" class="nav-item"><i class="bi bi-people-fill"></i><span>Data Siswa</span></router-link>
        <router-link to="/guru/iuran" class="nav-item"><i class="bi bi-wallet2"></i><span>Data Iuran</span></router-link>
        <router-link to="/guru/transaksi" class="nav-item"><i class="bi bi-receipt"></i><span>Transaksi</span></router-link>
        <router-link to="/guru/pengeluaran" class="nav-item"><i class="bi bi-bag-dash-fill"></i><span>Pengeluaran</span></router-link>
        <router-link to="/guru/keterlambatan" class="nav-item"><i class="bi bi-clock-history"></i><span>Keterlambatan</span></router-link>
        <router-link to="/guru/laporan" class="nav-item"><i class="bi bi-file-earmark-bar-graph-fill"></i><span>Laporan</span></router-link>
        <router-link to="/guru/notifikasi" class="nav-item"><i class="bi bi-bell-fill"></i><span>Notifikasi</span></router-link>
        <router-link to="/guru/pengaturan" class="nav-item"><i class="bi bi-gear-fill"></i><span>Pengaturan</span></router-link>
        <router-link to="/guru/profile" class="nav-item"><i class="bi bi-person-fill"></i><span>Profile</span></router-link>
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
          <h1>Dashboard Wali Kelas</h1>
          <p>Ringkasan dan statistik keuangan kelas <strong>XII RPL 1</strong>.</p>
        </div>
        <div class="user-profile">
          <div class="avatar">G</div>
          <div class="profile-info">
            <span class="name">Guru Wali Kelas</span>
            <span class="role">XII RPL 1</span>
          </div>
        </div>
      </header>

      <!-- Stat Cards -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="bi bi-cash-stack"></i></div>
          <div class="stat-info">
            <span class="stat-label">Saldo Kas Kelas</span>
            <h3 class="stat-value">{{ rupiah(3450000) }}</h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="bi bi-check-circle-fill"></i></div>
          <div class="stat-info">
            <span class="stat-label">Siswa Lunas Iuran</span>
            <h3 class="stat-value">28 / 36 Siswa</h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber"><i class="bi bi-exclamation-triangle-fill"></i></div>
          <div class="stat-info">
            <span class="stat-label">Total Menunggak</span>
            <h3 class="stat-value">{{ rupiah(420000) }}</h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><i class="bi bi-box-arrow-up-right"></i></div>
          <div class="stat-info">
            <span class="stat-label">Pengeluaran Bulan Ini</span>
            <h3 class="stat-value">{{ rupiah(180000) }}</h3>
          </div>
        </div>
      </section>

      <!-- Visualisasi Grafik & Quick Action -->
      <section class="dashboard-grid">
        <!-- Minimalist Chart Simulation -->
        <div class="card-box">
          <h3>Grafik Pemasukan vs Pengeluaran (2026)</h3>
          <div class="chart-placeholder">
            <div class="bar-group" v-for="(bar, index) in chartData" :key="index">
              <div class="bars">
                <div class="bar in" :style="{ height: bar.in + '%' }" :title="'Masuk: ' + bar.in"></div>
                <div class="bar out" :style="{ height: bar.out + '%' }" :title="'Keluar: ' + bar.out"></div>
              </div>
              <span class="month-label">{{ bar.month }}</span>
            </div>
          </div>
        </div>

        <!-- Request Approvals Summary -->
        <div class="card-box">
          <h3>Menunggu Persetujuan Anda</h3>
          <div class="approval-list">
            <div class="approval-item">
              <div>
                <strong>Beli Spidol & Penghapus</strong>
                <p>Pengaju: Siti (Bendahara) • Rp 25.000</p>
              </div>
              <router-link to="/guru/pengeluaran" class="btn-sm">Review</router-link>
            </div>
            <div class="approval-item">
              <div>
                <strong>Pembayaran Cash Budi</strong>
                <p>Nominal: Rp 50.000 • Iuran Mei</p>
              </div>
              <router-link to="/guru/transaksi" class="btn-sm">Review</router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const rupiah = (val) => 'Rp ' + Number(val).toLocaleString('id-ID')

const chartData = ref([
  { month: 'Jan', in: 70, out: 20 },
  { month: 'Feb', in: 85, out: 40 },
  { month: 'Mar', in: 60, out: 15 },
  { month: 'Apr', in: 90, out: 50 },
  { month: 'Mei', in: 75, out: 30 }
])

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
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
.user-profile { display: flex; align-items: center; gap: 10px; background: #fff; padding: 6px 14px; border-radius: 30px; border: 1px solid #e2e8f0; }
.user-profile .avatar { width: 32px; height: 32px; background: #0284c7; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.profile-info .name { font-size: 12px; font-weight: 700; display: block; }
.profile-info .role { font-size: 10px; color: #64748b; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 14px; }
.stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.green { background: #f0fdf4; color: #16a34a; }
.stat-icon.amber { background: #fffbeb; color: #d97706; }
.stat-icon.red { background: #fef2f2; color: #ef4444; }
.stat-label { font-size: 11px; color: #64748b; font-weight: 600; display: block; }
.stat-value { font-size: 16px; font-weight: 700; margin: 0; }
.dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.card-box { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
.chart-placeholder { height: 160px; display: flex; align-items: flex-end; justify-content: space-around; padding-top: 20px; }
.bar-group { display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
.bars { display: flex; gap: 4px; align-items: flex-end; height: 120px; }
.bar { width: 14px; border-radius: 4px 4px 0 0; }
.bar.in { background: #3b82f6; }
.bar.out { background: #ef4444; }
.month-label { font-size: 11px; color: #64748b; }
.approval-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.approval-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 14px; border-radius: 8px; font-size: 12px; }
.approval-item p { margin: 2px 0 0 0; color: #64748b; font-size: 11px; }
.btn-sm { background: #3b82f6; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 11px; }
</style>