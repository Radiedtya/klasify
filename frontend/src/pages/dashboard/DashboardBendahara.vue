<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Bendahara</h1>
      <p class="text-sm text-gray-500">
        Selamat datang, {{ user?.name }}! Kelola keuangan kelas dengan mudah.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Statistik Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard class="border-l-4 border-l-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Kas</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatRupiah(stats.total_kas || 0) }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"
            >
              <CurrencyDollarIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Pemasukan Bulan Ini</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatRupiah(stats.pemasukan_bulan_ini || 0) }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"
            >
              <ArrowUpIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Pengeluaran Bulan Ini</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatRupiah(stats.pengeluaran_bulan_ini || 0) }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
            >
              <ArrowDownIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Transaksi Pending</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ stats.transaksi_pending || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              <ClockIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Grafik Kas -->
      <BaseCard title="Kas per Bulan">
        <div class="h-64">
          <canvas ref="kasChartRef"></canvas>
        </div>
      </BaseCard>

      <!-- Transaksi Pending -->
      <BaseCard title="⏳ Transaksi Pending">
        <template #header-action>
          <router-link
            to="/transaksi"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Lihat semua →
          </router-link>
        </template>

        <BaseTable
          :columns="pendingColumns"
          :data="transaksiPending"
          empty-text="Tidak ada transaksi pending"
        >
          <template #column-siswa="{ row }">
            {{ row.siswa?.user?.name || "-" }}
          </template>
          <template #column-jumlah="{ row }">
            {{ formatRupiah(row.jumlah) }}
          </template>
          <template #column-status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </BaseTable>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import api from "@/api/axios";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(true);
const stats = ref({});
const transaksiPending = ref([]);
const kasChartRef = ref(null);

const pendingColumns = [
  { key: "siswa.user.name", label: "Siswa" },
  { key: "iuran.kelas.nama", label: "Kelas" },
  { key: "tanggal_bayar", label: "Tanggal Bayar" },
  { key: "jumlah", label: "Jumlah" },
  { key: "status", label: "Status" },
];

const fetchDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    if (response.data.success) {
      const data = response.data.data;
      stats.value = data.statistik;
      transaksiPending.value = data.transaksi_pending || [];

      await nextTick();
      renderCharts(data.grafik);
    }
  } catch (error) {
    console.error("Gagal fetch dashboard:", error);
  } finally {
    loading.value = false;
  }
};

const renderCharts = (grafik) => {
  import("chart.js/auto").then(({ default: Chart }) => {
    if (window._kasChart) {
      window._kasChart.destroy();
    }

    if (kasChartRef.value && grafik?.kas_per_bulan) {
      const ctx = kasChartRef.value.getContext("2d");
      window._kasChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: grafik.kas_per_bulan.labels,
          datasets: [
            {
              label: "Pemasukan",
              data: grafik.kas_per_bulan.pemasukan,
              backgroundColor: "rgba(34, 197, 94, 0.6)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "Pengeluaran",
              data: grafik.kas_per_bulan.pengeluaran,
              backgroundColor: "rgba(239, 68, 68, 0.6)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => formatRupiah(value),
              },
            },
          },
        },
      });
    }
  });
};

onMounted(() => {
  fetchDashboard();
});
</script>
