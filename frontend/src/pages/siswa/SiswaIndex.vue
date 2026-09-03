<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Siswa</h1>
        <p class="text-sm text-gray-500">Kelola data siswa di kelas Anda</p>
      </div>
      <router-link
        v-if="canCreate"
        to="/siswa/tambah"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
      >
        <PlusIcon class="w-5 h-5" />
        Tambah Siswa
      </router-link>
    </div>

    <!-- Filter & Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="filters.search"
          placeholder="Cari nama atau NIS..."
          @update:model-value="debounceSearch"
        >
          <template #append>
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          </template>
        </BaseInput>
      </div>
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
        :data="siswaList"
        empty-text="Tidak ada data siswa"
      >
        <!-- Column: Nama -->
        <template #column-nama="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium"
            >
              {{ row.user?.name?.charAt(0) || "?" }}
            </div>
            <div>
              <p class="font-medium text-gray-800">
                {{ row.user?.name || "-" }}
              </p>
              <p class="text-xs text-gray-500">{{ row.user?.email || "-" }}</p>
            </div>
          </div>
        </template>

        <!-- Column: NIS -->
        <template #column-nis="{ row }">
          <span class="font-mono text-sm">{{ row.nis }}</span>
        </template>

        <!-- Column: Kelas -->
        <template #column-kelas="{ row }">
          <span
            class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {{ row.kelas?.nama || "-" }}
          </span>
        </template>

        <!-- Column: Status -->
        <template #column-status="{ row }">
          <StatusBadge
            :status="row.user?.is_active ? 'aktif' : 'nonaktif'"
            custom-label="Aktif"
            v-if="row.user?.is_active"
          />
          <StatusBadge status="nonaktif" custom-label="Nonaktif" v-else />
        </template>

        <!-- Column: Telat -->
        <template #column-telat="{ row }">
          <span
            v-if="row.keterlambatan_count > 0"
            class="text-red-600 font-medium flex items-center gap-1"
          >
            <ExclamationTriangleIcon class="w-4 h-4" />
            {{ row.keterlambatan_count }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </template>

        <!-- Column: Aksi -->
        <template #column-aksi="{ row }">
          <div class="flex items-center gap-2">
            <router-link
              :to="`/siswa/${row.id}`"
              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Detail"
            >
              <EyeIcon class="w-4 h-4" />
            </router-link>
            <router-link
              v-if="canEdit"
              :to="`/siswa/${row.id}/edit`"
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
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import { siswaApi } from "../../api/siswa";
import { kelasApi } from "../../api/kelas";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseTable from "../../components/common/BaseTable.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import StatusBadge from "../../components/common/StatusBadge.vue";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const siswaList = ref([]);
const kelasList = ref([]);

const filters = reactive({
  search: "",
  kelas_id: "",
  is_active: "",
});

let searchTimeout = null;

const columns = [
  { key: "nama", label: "Nama" },
  { key: "nis", label: "NIS" },
  { key: "kelas", label: "Kelas" },
  { key: "status", label: "Status" },
  { key: "telat", label: "Telat" },
  { key: "aksi", label: "Aksi" },
];

const canCreate = computed(() => user?.role?.name === "guru");
const canEdit = computed(() => user?.role?.name === "guru");
const canDelete = computed(() => user?.role?.name === "guru");

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.kelas_id) params.kelas_id = filters.kelas_id;
    if (filters.is_active !== "") params.is_active = filters.is_active;

    const [siswaRes, kelasRes] = await Promise.all([
      siswaApi.getAll({ params }),
      kelasApi.getAll(),
    ]);

    if (siswaRes.data.success) {
      siswaList.value = siswaRes.data.data;
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

const debounceSearch = (value) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.search = value;
    fetchData();
  }, 300);
};

const confirmDelete = async (row) => {
  const result = await Swal.fire({
    title: "Hapus Siswa?",
    text: `Apakah Anda yakin ingin menghapus siswa ${row.user?.name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await siswaApi.delete(row.id);
      toast.success("Siswa berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus siswa");
    }
  }
};

// Watch perubahan filter
watch(
  () => filters.kelas_id,
  () => fetchData(),
);
watch(
  () => filters.is_active,
  () => fetchData(),
);

onMounted(() => {
  fetchData();
});
</script>
