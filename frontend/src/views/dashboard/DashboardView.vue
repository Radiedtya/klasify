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
        <a href="#" class="nav-item">
          <i class="bi bi-journal-text"></i>
          <span>Laporan</span>
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
          <h1>Dashboard Kas Kelas</h1>
          <p>Selamat datang di sistem pengawasan dan pengelolaan kas Klasify!</p>
        </div>
        <div class="user-profile">
          <div class="avatar">A</div>
          <span class="user-name">Pengurus Kelas</span>
        </div>
      </header>

      <!-- Grid Ringkasan Kas -->
      <section class="cards-grid">
        <div class="card">
          <div class="card-info">
            <h3>Total Kas Saat Ini</h3>
            <p class="amount">Rp 1.500.000</p>
          </div>
          <div class="card-icon blue">💰</div>
        </div>

        <div class="card">
          <div class="card-info">
            <h3>Pemasukan Bulan Ini</h3>
            <p class="amount green">+ Rp 450.000</p>
          </div>
          <div class="card-icon green">📈</div>
        </div>

        <div class="card">
          <div class="card-info">
            <h3>Pengeluaran Bulan Ini</h3>
            <p class="amount red">- Rp 120.000</p>
          </div>
          <div class="card-icon red">📉</div>
        </div>
      </section>

      <!-- Tabel Transaksi Terakhir Dummy -->
      <section class="table-section">
        <h2>Transaksi Terakhir</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Tipe</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>03 Sep 2026</td>
              <td>Uang Kas Mingguan - Ani</td>
              <td><span class="badge in">Pemasukan</span></td>
              <td class="text-green">+ Rp 10.000</td>
            </tr>
            <tr>
              <td>02 Sep 2026</td>
              <td>Beli Spidol & Penghapus Board</td>
              <td><span class="badge out">Pengeluaran</span></td>
              <td class="text-red">- Rp 25.000</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background-color: var(--bg);
  color: #000000;
}

/* Sidebar Styling */
.sidebar {
  width: 260px;
  background: #ffffff;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  box-shadow: 2px 0 10px rgba(0,0,0,0.02);
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
  background: var(--accent);
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
  color: #000000;
  margin: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item:hover, .nav-item.active {
  background: var(--accent);
  color: #ffffff;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  margin-top: auto;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #fee2e2;
}

/* Main Area Styling */
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
  color: #000000;
  margin: 0 0 4px 0;
}

.topbar p {
  color: #64748b;
  font-size: 14px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 30px;
  border: 1px solid var(--border);
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--accent);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

/* Grid Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.card-info h3 {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
}

.amount {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
}

.amount.green { color: #10b981; }
.amount.red { color: #ef4444; }

.card-icon {
  font-size: 28px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

/* Table Section */
.table-section {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.table-section h2 {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th, .data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  color: #000000;
}

.data-table th {
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.in { background: #d1fae5; color: #065f46; }
.badge.out { background: #fee2e2; color: #991b1b; }

.text-green { color: #10b981; font-weight: 600; }
.text-red { color: #ef4444; font-weight: 600; }
</style>