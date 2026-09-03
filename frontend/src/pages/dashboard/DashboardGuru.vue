<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Guru</h1>
      <p class="text-sm text-gray-500">
        Selamat datang, {{ user?.name }}! Berikut ringkasan data kelas.
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
        <BaseCard class="border-l-4 border-l-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Siswa</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ stats.total_siswa || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              <UsersIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

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

        <BaseCard class="border-l-4 border-l-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Siswa Telat</p>
              <p class="text-2xl font-bold text-red-600">
                {{ stats.siswa_telat || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
            >
              <ExclamationTriangleIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Iuran Aktif</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ stats.total_iuran_aktif || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"
            >
              <CalendarIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Grafik -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Grafik Pembayaran -->
        <BaseCard title="Pembayaran per Bulan">
          <div class="h-64">
            <canvas ref="paymentChartRef"></canvas>
          </div>
        </BaseCard>

        <!-- Grafik Pengeluaran -->
        <BaseCard title="Pengeluaran per Bulan">
          <div class="h-64">
            <canvas ref="expenseChartRef"></canvas>
          </div>
        </BaseCard>
      </div>

      <!-- Daftar Siswa Telat -->
      <BaseCard title="🔴 Siswa Telat Bayar">
        <template #header-action>
          <router-link
            to="/keterlambatan"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Lihat semua →
          </router-link>
        </template>

        <BaseTable
          :columns="siswaTelatColumns"
          :data="siswaTelat"
          empty-text="Tidak ada siswa telat"
        >
          <template #column-nama="{ row }">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium"
              >
                {{ row.siswa?.user?.name?.charAt(0) || "?" }}
              </div>
              <span>{{ row.siswa?.user?.name || "-" }}</span>
            </div>
          </template>
          <template #column-hari_telat="{ row }">
            <span class="text-red-600 font-medium"
              >{{ row.hari_telat }} hari</span
            >
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
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
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
const siswaTelat = ref([]);
const paymentChartRef = ref(null);
const expenseChartRef = ref(null);

const siswaTelatColumns = [
  { key: "siswa.user.name", label: "Nama" },
  { key: "siswa.nis", label: "NIS" },
  { key: "siswa.kelas.nama", label: "Kelas" },
  { key: "hari_telat", label: "Telat" },
  { key: "status", label: "Status" },
];

const fetchDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    if (response.data.success) {
      const data = response.data.data;
      stats.value = data.statistik;
      siswaTelat.value = data.siswa_telat || [];

      // Render chart after data loaded
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
  // Load Chart.js dynamically
  import("chart.js/auto").then(({ default: Chart }) => {
    // Destroy existing charts if any
    if (window._paymentChart) {
      window._paymentChart.destroy();
    }
    if (window._expenseChart) {
      window._expenseChart.destroy();
    }

    // Payment Chart
    if (paymentChartRef.value && grafik?.pembayaran_per_bulan) {
      const ctx = paymentChartRef.value.getContext("2d");
      window._paymentChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: grafik.pembayaran_per_bulan.labels,
          datasets: [
            {
              label: "Pembayaran",
              data: grafik.pembayaran_per_bulan.data,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
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

    // Expense Chart
    if (expenseChartRef.value && grafik?.pengeluaran_per_bulan) {
      const ctx = expenseChartRef.value.getContext("2d");
      window._expenseChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: grafik.pengeluaran_per_bulan.labels,
          datasets: [
            {
              label: "Pengeluaran",
              data: grafik.pengeluaran_per_bulan.data,
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
            legend: { display: false },
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
