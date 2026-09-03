<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Iuran</h1>
        <p class="text-sm text-gray-500">Kelola iuran per kelas</p>
      </div>
      <router-link
        v-if="canCreate"
        to="/iuran/tambah"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
      >
        <PlusIcon class="w-5 h-5" />
        Tambah Iuran
      </router-link>
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
        v-model="filters.is_active"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm w-full sm:w-36"
        @change="fetchData"
      >
        <option value="">Semua Status</option>
        <option value="1">Aktif</option>
        <option value="0">Nonaktif</option>
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
        :data="iuranList"
        empty-text="Tidak ada data iuran"
      >
        <!-- Column: Kelas -->
        <template #column-kelas="{ row }">
          <span
            class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {{ row.kelas?.nama || "-" }}
          </span>
        </template>

        <!-- Column: Bulan -->
        <template #column-bulan="{ row }">
          {{ getNamaBulan(row.bulan) }}
        </template>

        <!-- Column: Nominal -->
        <template #column-nominal="{ row }">
          {{ formatRupiah(row.nominal) }}
        </template>

        <!-- Column: Jatuh Tempo -->
        <template #column-jatuh_tempo="{ row }">
          {{ formatTanggal(row.jatuh_tempo) }}
        </template>

        <!-- Column: Status -->
        <template #column-status="{ row }">
          <StatusBadge
            :status="row.is_active ? 'aktif' : 'nonaktif'"
            custom-label="Aktif"
            v-if="row.is_active"
          />
          <StatusBadge status="nonaktif" custom-label="Nonaktif" v-else />
        </template>

        <!-- Column: Aksi -->
        <template #column-aksi="{ row }">
          <div class="flex items-center gap-2">
            <router-link
              :to="`/iuran/${row.id}/siswa`"
              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Status Siswa"
            >
              <UsersIcon class="w-4 h-4" />
            </router-link>
            <router-link
              v-if="canEdit"
              :to="`/iuran/${row.id}/edit`"
              class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
              title="Edit"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </router-link>
            <button
              v-if="canDelete"
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
import { useAuthStore } from "@/stores/auth";
import { iuranApi } from "@/api/iuran";
import { kelasApi } from "@/api/kelas";
import {
  PlusIcon,
  UsersIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal } from "@/utils/formatTanggal";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const iuranList = ref([]);
const kelasList = ref([]);

const filters = reactive({
  kelas_id: "",
  is_active: "",
});

const columns = [
  { key: "kelas", label: "Kelas" },
  { key: "bulan", label: "Bulan" },
  { key: "tahun", label: "Tahun" },
  { key: "nominal", label: "Nominal" },
  { key: "jatuh_tempo", label: "Jatuh Tempo" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" },
];

const canCreate = computed(() => user?.role?.name === "guru");
const canEdit = computed(() => user?.role?.name === "guru");
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
    if (filters.kelas_id) params.kelas_id = filters.kelas_id;
    if (filters.is_active !== "") params.is_active = filters.is_active;

    const [iuranRes, kelasRes] = await Promise.all([
      iuranApi.getAll({ params }),
      kelasApi.getAll(),
    ]);

    if (iuranRes.data.success) {
      iuranList.value = iuranRes.data.data;
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

const confirmDelete = async (row) => {
  const result = await Swal.fire({
    title: "Hapus Iuran?",
    text: `Apakah Anda yakin ingin menghapus iuran ${getNamaBulan(row.bulan)} ${row.tahun}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await iuranApi.delete(row.id);
      toast.success("Iuran berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus iuran");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
