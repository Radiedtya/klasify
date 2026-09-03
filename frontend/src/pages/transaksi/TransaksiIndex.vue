<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Transaksi</h1>
        <p class="text-sm text-gray-500">Kelola data transaksi pembayaran</p>
      </div>
      <div class="flex gap-2">
        <router-link
          v-if="canBayar"
          to="/transaksi/bayar"
          class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
        >
          <CreditCardIcon class="w-5 h-5" />
          Bayar Iuran
        </router-link>
        <router-link
          v-if="canKonfirmasi"
          to="/transaksi/konfirmasi"
          class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition"
        >
          <CheckCircleIcon class="w-5 h-5" />
          Konfirmasi
        </router-link>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="search"
          placeholder="Cari nama atau NIS..."
          @update:model-value="debounceSearch"
        >
          <template #append>
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          </template>
        </BaseInput>
      </div>
      <select
        v-model="filters.status"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-full sm:w-36"
        @change="fetchData"
      >
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Table -->
    <BaseCard v-else>
      <BaseTable
        :columns="columns"
        :data="transaksiList"
        empty-text="Tidak ada data transaksi"
      >
        <!-- Column: Siswa -->
        <template #column-siswa="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium"
            >
              {{ row.siswa?.user?.name?.charAt(0) || "?" }}
            </div>
            <div>
              <p class="font-medium text-gray-800">
                {{ row.siswa?.user?.name || "-" }}
              </p>
              <p class="text-xs text-gray-500">{{ row.siswa?.nis || "-" }}</p>
            </div>
          </div>
        </template>

        <!-- Column: Kelas -->
        <template #column-kelas="{ row }">
          <span
            class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {{ row.iuran?.kelas?.nama || "-" }}
          </span>
        </template>

        <!-- Column: Bulan -->
        <template #column-bulan="{ row }">
          {{ getNamaBulan(row.iuran?.bulan) }} {{ row.iuran?.tahun }}
        </template>

        <!-- Column: Jumlah -->
        <template #column-jumlah="{ row }">
          {{ formatRupiah(row.jumlah) }}
        </template>

        <!-- Column: Status -->
        <template #column-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>

        <!-- Column: Aksi -->
        <template #column-aksi="{ row }">
          <div class="flex items-center gap-2">
            <button
              v-if="row.status === 'pending' && canKonfirmasi"
              @click="openKonfirmasi(row)"
              class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Konfirmasi"
            >
              <CheckCircleIcon class="w-4 h-4" />
            </button>
            <button
              v-if="canDelete && row.status === 'pending'"
              @click="confirmDelete(row)"
              class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Hapus"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { transaksiApi } from "../../api/transaksi";
import {
  CreditCardIcon,
  CheckCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseTable from "../../components/common/BaseTable.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import StatusBadge from "../../components/common/StatusBadge.vue";
import { formatRupiah } from "../../utils/formatRupiah";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const transaksiList = ref([]);
const search = ref("");

const filters = reactive({
  status: "",
});

let searchTimeout = null;

const columns = [
  { key: "siswa", label: "Siswa" },
  { key: "kelas", label: "Kelas" },
  { key: "bulan", label: "Bulan" },
  { key: "jumlah", label: "Jumlah" },
  { key: "tanggal_bayar", label: "Tanggal Bayar" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" },
];

const canBayar = computed(() =>
  ["siswa", "bendahara"].includes(user?.role?.name),
);
const canKonfirmasi = computed(() =>
  ["guru", "bendahara"].includes(user?.role?.name),
);
const canDelete = computed(() => user?.role?.name === "guru");

const getNamaBulan = (bulan) => {
  const nama = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return nama[bulan - 1] || bulan;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (filters.status) params.status = filters.status;

    const res = await transaksiApi.getAll({ params });
    if (res.data.success) {
      transaksiList.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const debounceSearch = (value) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    search.value = value;
    fetchData();
  }, 300);
};

const openKonfirmasi = (row) => {
  router.push({
    path: "/transaksi/konfirmasi",
    query: { id: row.id },
  });
};

const confirmDelete = async (row) => {
  const result = await Swal.fire({
    title: "Hapus Transaksi?",
    text: `Apakah Anda yakin ingin menghapus transaksi ini?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await transaksiApi.delete(row.id);
      toast.success("Transaksi berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus transaksi");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
