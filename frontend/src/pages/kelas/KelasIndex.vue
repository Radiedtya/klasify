<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Data Kelas</h1>
        <p class="text-sm text-gray-500">Kelola data kelas di sekolah Anda</p>
      </div>
      <router-link
        v-if="canCreate"
        to="/kelas/tambah"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
      >
        <PlusIcon class="w-5 h-5" />
        Tambah Kelas
      </router-link>
    </div>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="search"
          placeholder="Cari nama kelas..."
          @update:model-value="debounceSearch"
        >
          <template #append>
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          </template>
        </BaseInput>
      </div>
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

    <!-- Grid Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseCard
        v-for="kelas in kelasList"
        :key="kelas.id"
        class="hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ kelas.nama }}
            </h3>
            <p class="text-sm text-gray-500">{{ kelas.tahun_ajaran }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-xs text-gray-400">Wali Kelas:</span>
              <span class="text-sm font-medium">{{
                kelas.wali_kelas?.name || "-"
              }}</span>
            </div>
            <div class="mt-1">
              <StatusBadge
                :status="kelas.is_active ? 'aktif' : 'nonaktif'"
                custom-label="Aktif"
                v-if="kelas.is_active"
              />
              <StatusBadge status="nonaktif" custom-label="Nonaktif" v-else />
            </div>
          </div>
          <div class="flex items-center gap-1">
            <router-link
              :to="`/kelas/${kelas.id}/siswa`"
              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Lihat Siswa"
            >
              <UsersIcon class="w-4 h-4" />
            </router-link>
            <router-link
              v-if="canEdit"
              :to="`/kelas/${kelas.id}/edit`"
              class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
              title="Edit"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </router-link>
            <button
              v-if="canDelete"
              @click="confirmDelete(kelas)"
              class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Hapus"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Statistik siswa -->
        <div
          class="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm"
        >
          <span class="text-gray-500">Total Siswa</span>
          <span class="font-medium">{{ kelas.siswa_count || 0 }}</span>
        </div>
      </BaseCard>
    </div>

    <!-- Kosong -->
    <div v-if="!loading && kelasList.length === 0" class="text-center py-12">
      <p class="text-gray-400">Belum ada data kelas</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { kelasApi } from "../../api/kelas";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import StatusBadge from "../../components/common/StatusBadge.vue";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const kelasList = ref([]);
const search = ref("");

const filters = reactive({
  is_active: "",
});

let searchTimeout = null;

const canCreate = computed(() => user?.role?.name === "guru");
const canEdit = computed(() => user?.role?.name === "guru");
const canDelete = computed(() => user?.role?.name === "guru");

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (filters.is_active !== "") params.is_active = filters.is_active;

    const res = await kelasApi.getAll({ params });
    if (res.data.success) {
      kelasList.value = res.data.data;
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

const confirmDelete = async (kelas) => {
  const result = await Swal.fire({
    title: "Hapus Kelas?",
    text: `Apakah Anda yakin ingin menghapus kelas ${kelas.nama}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await kelasApi.delete(kelas.id);
      toast.success("Kelas berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus kelas");
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>
