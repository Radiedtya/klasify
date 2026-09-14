<script setup>
import { grafikBulanan, rupiah } from "@/stores/index";

function exportLaporan(type) {
  alert(`Menyiapkan export ${type}... (hubungkan ke backend untuk file asli)`);
}
</script>

<template>
  <section>
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Laporan kas</div>
      </div>
      
      <div class="report-filters">
        <select class="select-chip">
          <option>Per bulan</option>
          <option>Per kelas</option>
          <option>Per siswa</option>
        </select>
        <select class="select-chip">
          <option>Agustus 2025</option>
          <option>Juli 2025</option>
          <option>Juni 2025</option>
        </select>
        <select class="select-chip">
          <option>Semua kelas</option>
          <option>XII RPL 2</option>
          <option>XII RPL 1</option>
        </select>
      </div>

      <!-- Tabel Ringkasan Kas Bulanan -->
      <div class="table-card" style="margin: 20px 0; box-shadow: none; padding: 0;">
        <table>
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Pemasukan</th>
              <th>Pengeluaran</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in grafikBulanan" :key="index">
              <td style="font-weight: 600;">{{ item.bulan }}</td>
              <td style="color: var(--green); font-weight: 600;">{{ rupiah(item.masuk) }}</td>
              <td style="color: var(--red); font-weight: 600;">{{ rupiah(item.keluar) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="export-buttons">
        <button class="btn-ghost" @click="exportLaporan('PDF')">Export PDF</button>
        <button class="btn-primary" @click="exportLaporan('Excel')">Export Excel</button>
      </div>
    </div>
  </section>
</template>