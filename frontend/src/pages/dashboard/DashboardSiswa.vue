<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Siswa</h1>
      <p class="text-sm text-gray-500">
        Selamat datang, {{ user?.name }}! Pantau status pembayaran Anda.
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
      <!-- Profile Card -->
      <BaseCard>
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold"
          >
            {{ profil.nama?.charAt(0) || "?" }}
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ profil.nama }}
            </h2>
            <div
              class="flex flex-wrap items-center gap-2 text-sm text-gray-500"
            >
              <span>NIS: {{ profil.nis }}</span>
              <span class="w-px h-4 bg-gray-300"></span>
              <span>Kelas: {{ profil.kelas }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Statistik Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard class="border-l-4 border-l-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Transaksi</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ stats.total_transaksi || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
            >
              <CreditCardIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Bayar</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatRupiah(stats.total_bayar || 0) }}
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
              <p class="text-sm text-gray-500">Transaksi Pending</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ stats.transaksi_pending || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"
            >
              <ClockIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>

        <BaseCard class="border-l-4 border-l-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Keterlambatan</p>
              <p class="text-2xl font-bold text-red-600">
                {{ stats.total_keterlambatan || 0 }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
            >
              <ExclamationTriangleIcon class="w-6 h-6" />
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Status Bayar Bulan Ini -->
      <BaseCard title="Status Pembayaran Bulan Ini">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            :class="{
              'bg-green-100 text-green-600': statusBayar.status === 'confirmed',
              'bg-yellow-100 text-yellow-600': statusBayar.status === 'pending',
              'bg-red-100 text-red-600': statusBayar.status === 'belum_bayar',
            }"
          >
            <CheckCircleIcon
              v-if="statusBayar.status === 'confirmed'"
              class="w-8 h-8"
            />
            <ClockIcon
              v-else-if="statusBayar.status === 'pending'"
              class="w-8 h-8"
            />
            <XCircleIcon v-else class="w-8 h-8" />
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-800">
              {{ statusBayar.iuran || "Belum ada iuran" }}
            </p>
            <StatusBadge
              :status="statusBayar.status"
              :custom-label="statusLabel"
            />
            <p
              v-if="statusBayar.tanggal_bayar"
              class="text-sm text-gray-500 mt-1"
            >
              Dibayar: {{ formatTanggal(statusBayar.tanggal_bayar) }}
            </p>
          </div>
        </div>
      </BaseCard>

      <!-- Riwayat Transaksi -->
      <BaseCard title="Riwayat Transaksi">
        <template #header-action>
          <router-link
            to="/transaksi"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Lihat semua →
          </router-link>
        </template>

        <BaseTable
          :columns="riwayatColumns"
          :data="riwayatTransaksi"
          empty-text="Belum ada transaksi"
        >
          <template #column-tanggal_bayar="{ row }">
            {{ formatTanggal(row.tanggal_bayar) }}
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
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal } from "@/utils/formatTanggal";
import { getStatusLabel } from "@/utils/statusColor";
import api from "@/api/axios";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(true);
const profil = ref({});
const stats = ref({});
const statusBayar = ref({});
const riwayatTransaksi = ref([]);

const statusLabel = computed(() => {
  return getStatusLabel(statusBayar.value.status);
});

const riwayatColumns = [
  { key: "tanggal_bayar", label: "Tanggal" },
  { key: "iuran.kelas.nama", label: "Kelas" },
  { key: "iuran.bulan_tahun", label: "Bulan" },
  { key: "jumlah", label: "Jumlah" },
  { key: "status", label: "Status" },
];

const fetchDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    if (response.data.success) {
      const data = response.data.data;
      profil.value = data.profil || {};
      stats.value = data.statistik || {};
      statusBayar.value = data.status_bayar_bulan_ini || {};
      riwayatTransaksi.value = data.riwayat_transaksi || [];
    }
  } catch (error) {
    console.error("Gagal fetch dashboard:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>
