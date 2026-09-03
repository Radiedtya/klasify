<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Pengeluaran</h1>
        <p class="text-sm text-gray-500">Kelola data pengeluaran kas kelas</p>
      </div>
      <router-link
        v-if="canAjukan"
        to="/pengeluaran/ajukan"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
      >
        <PlusIcon class="w-5 h-5" />
        Ajukan Pengeluaran
      </router-link>
    </div>

    <!-- Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="search"
          placeholder="Cari judul..."
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
        <option value="approved">Disetujui</option>
        <option value="rejected">Ditolak</option>
      </select>
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
        :data="pengeluaranList"
        empty-text="Tidak ada data pengeluaran"
      >
        <!-- Column: Judul -->
        <template #column-judul="{ row }">
          <div>
            <p class="font-medium text-gray-800">{{ row.judul }}</p>
            <p class="text-xs text-gray-500 truncate max-w-xs">
              {{ row.deskripsi }}
            </p>
          </div>
        </template>

        <!-- Column: Kelas -->
        <template #column-kelas="{ row }">
          <span
            class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {{ row.kelas?.nama || "-" }}
          </span>
        </template>

        <!-- Column: Jumlah -->
        <template #column-jumlah="{ row }">
          {{ formatRupiah(row.jumlah) }}
        </template>

        <!-- Column: Pengaju -->
        <template #column-pengaju="{ row }">
          {{ row.created_by?.name || "-" }}
        </template>

        <!-- Column: Status -->
        <template #column-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>

        <!-- Column: Aksi -->
        <template #column-aksi="{ row }">
          <div class="flex items-center gap-2">
            <button
              v-if="row.status === 'pending' && canSetujui"
              @click="openSetujui(row)"
              class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Setujui/Tolak"
            >
              <CheckCircleIcon class="w-4 h-4" />
            </button>
            <router-link
              v-if="
                canEdit &&
                row.status === 'pending' &&
                row.created_by?.id === user?.id
              "
              :to="`/pengeluaran/${row.id}/edit`"
              class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
              title="Edit"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </router-link>
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
import { pengeluaranApi } from "../../api/pengeluaran";
import { kelasApi } from "../../api/kelas";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
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
const pengeluaranList = ref([]);
const kelasList = ref([]);
const search = ref("");

const filters = reactive({
  status: "",
  kelas_id: "",
});

let searchTimeout = null;

const columns = [
  { key: "judul", label: "Judul" },
  { key: "kelas", label: "Kelas" },
  { key: "jumlah", label: "Jumlah" },
  { key: "pengaju", label: "Pengaju" },
  { key: "tanggal", label: "Tanggal" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" },
];

const canAjukan = computed(() => user?.role?.name === "bendahara");
const canSetujui = computed(() => user?.role?.name === "guru");
const canEdit = computed(() => user?.role?.name === "bendahara");
const canDelete = computed(() => user?.role?.name === "guru");

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (filters.status) params.status = filters.status;
    if (filters.kelas_id) params.kelas_id = filters.kelas_id;

    const [pengeluaranRes, kelasRes] = await Promise.all([
      pengeluaranApi.getAll({ params }),
      kelasApi.getAll(),
    ]);

    if (pengeluaranRes.data.success) {
      pengeluaranList.value = pengeluaranRes.data.data;
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
    search.value = value;
    fetchData();
  }, 300);
};

const openSetujui = (row) => {
  router.push({
    path: "/pengeluaran/setujui",
    query: { id: row.id },
  });
};

const confirmDelete = async (row) => {
  const result = await Swal.fire({
    title: "Hapus Pengeluaran?",
    text: `Apakah Anda yakin ingin menghapus pengeluaran "${row.judul}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await pengeluaranApi.delete(row.id);
      toast.success("Pengeluaran berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal menghapus pengeluaran",
      );
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
