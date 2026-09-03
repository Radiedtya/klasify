<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Keterlambatan</h1>
        <p class="text-sm text-gray-500">
          Daftar siswa yang telat membayar iuran
        </p>
      </div>
      <button
        v-if="isGuru"
        @click="runCekManual"
        :disabled="loadingCek"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
      >
        <ArrowPathIcon
          class="w-5 h-5"
          :class="{ 'animate-spin': loadingCek }"
        />
        {{ loadingCek ? "Memproses..." : "Cek Sekarang" }}
      </button>
    </div>

    <!-- Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <select
        v-model="filters.kelas_id"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-full sm:w-48"
        @change="fetchData"
      >
        <option value="">Semua Kelas</option>
        <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
          {{ kelas.nama }}
        </option>
      </select>
      <select
        v-model="filters.status"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-full sm:w-36"
        @change="fetchData"
      >
        <option value="">Semua Status</option>
        <option value="belum_bayar">Belum Bayar</option>
        <option value="sudah_bayar_denda">Sudah Bayar Denda</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Summary -->
    <div v-else class="grid grid-cols-3 gap-4">
      <BaseCard class="border-l-4 border-l-red-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-red-600">{{ totalBelumBayar }}</p>
          <p class="text-sm text-gray-500">Belum Bayar</p>
        </div>
      </BaseCard>
      <BaseCard class="border-l-4 border-l-green-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">
            {{ totalSudahBayarDenda }}
          </p>
          <p class="text-sm text-gray-500">Sudah Bayar Denda</p>
        </div>
      </BaseCard>
      <BaseCard class="border-l-4 border-l-blue-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">
            {{ totalKeterlambatan }}
          </p>
          <p class="text-sm text-gray-500">Total</p>
        </div>
      </BaseCard>
    </div>

    <!-- Table -->
    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="keterlambatanList"
        empty-text="Tidak ada data keterlambatan"
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
            {{ row.siswa?.kelas?.nama || "-" }}
          </span>
        </template>

        <!-- Column: Bulan -->
        <template #column-bulan="{ row }">
          {{ getNamaBulan(row.iuran?.bulan) }} {{ row.iuran?.tahun }}
        </template>

        <!-- Column: Hari Telat -->
        <template #column-hari_telat="{ row }">
          <span class="text-red-600 font-medium"
            >{{ row.hari_telat }} hari</span
          >
        </template>

        <!-- Column: Denda -->
        <template #column-denda="{ row }">
          {{ formatRupiah(row.denda) }}
        </template>

        <!-- Column: Status -->
        <template #column-status="{ row }">
          <StatusBadge
            :status="row.status === 'belum_bayar' ? 'danger' : 'success'"
            :custom-label="
              row.status === 'belum_bayar' ? 'Belum Bayar' : 'Sudah Bayar Denda'
            "
          />
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { keterlambatanApi } from "@/api/keterlambatan";
import { kelasApi } from "@/api/kelas";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const loadingCek = ref(false);
const keterlambatanList = ref([]);
const kelasList = ref([]);

const filters = reactive({
  kelas_id: "",
  status: "",
});

const columns = [
  { key: "siswa", label: "Siswa" },
  { key: "kelas", label: "Kelas" },
  { key: "bulan", label: "Bulan" },
  { key: "hari_telat", label: "Hari Telat" },
  { key: "denda", label: "Denda" },
  { key: "status", label: "Status" },
];

const isGuru = computed(() => user?.role?.name === "guru");
const totalKeterlambatan = computed(() => keterlambatanList.value.length);
const totalBelumBayar = computed(
  () =>
    keterlambatanList.value.filter((k) => k.status === "belum_bayar").length,
);
const totalSudahBayarDenda = computed(
  () =>
    keterlambatanList.value.filter((k) => k.status === "sudah_bayar_denda")
      .length,
);

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
    if (filters.kelas_id) params.kelas_id = filters.kelas_id;
    if (filters.status) params.status = filters.status;

    const [keterlambatanRes, kelasRes] = await Promise.all([
      keterlambatanApi.getAll({ params }),
      kelasApi.getAll(),
    ]);

    if (keterlambatanRes.data.success) {
      keterlambatanList.value = keterlambatanRes.data.data;
    }
    if (kelasRes.data.success) {
      kelasList.value = kelasRes.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const runCekManual = async () => {
  loadingCek.value = true;
  try {
    const res = await keterlambatanApi.cekManual();
    if (res.data.success) {
      toast.success(res.data.message || "Pengecekan keterlambatan berhasil");
      await fetchData();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal melakukan pengecekan");
  } finally {
    loadingCek.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
