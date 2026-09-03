<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/iuran"
        class="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeftIcon class="w-5 h-5 text-gray-500" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Status Siswa</h1>
        <p class="text-sm text-gray-500">
          {{ getNamaBulan(iuran?.bulan) }} {{ iuran?.tahun }} -
          {{ iuran?.kelas?.nama }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Summary -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <BaseCard class="border-l-4 border-l-blue-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">{{ data.total_siswa }}</p>
          <p class="text-sm text-gray-500">Total Siswa</p>
        </div>
      </BaseCard>
      <BaseCard class="border-l-4 border-l-green-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ data.lunas }}</p>
          <p class="text-sm text-gray-500">Lunas</p>
        </div>
      </BaseCard>
      <BaseCard class="border-l-4 border-l-yellow-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ data.pending }}</p>
          <p class="text-sm text-gray-500">Pending</p>
        </div>
      </BaseCard>
      <BaseCard class="border-l-4 border-l-red-500">
        <div class="text-center">
          <p class="text-2xl font-bold text-red-600">{{ data.belum_bayar }}</p>
          <p class="text-sm text-gray-500">Belum Bayar</p>
        </div>
      </BaseCard>
    </div>

    <!-- Table -->
    <BaseCard title="Daftar Siswa">
      <BaseTable
        :columns="columns"
        :data="siswaList"
        empty-text="Tidak ada data siswa"
      >
        <template #column-nama="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium"
            >
              {{ row.name?.charAt(0) || "?" }}
            </div>
            <span>{{ row.name || "-" }}</span>
          </div>
        </template>
        <template #column-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
        <template #column-tanggal_bayar="{ row }">
          {{ formatTanggal(row.tanggal_bayar) || "-" }}
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { iuranApi } from "../../api/iuran";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseTable from "../../components/common/BaseTable.vue";
import StatusBadge from "../../components/common/StatusBadge.vue";
import { formatTanggal } from "../../utils/formatTanggal";

const route = useRoute();
const loading = ref(false);
const iuran = ref(null);
const siswaList = ref([]);
const data = reactive({
  total_siswa: 0,
  lunas: 0,
  pending: 0,
  belum_bayar: 0,
});

const columns = [
  { key: "nama", label: "Nama" },
  { key: "nis", label: "NIS" },
  { key: "status", label: "Status" },
  { key: "tanggal_bayar", label: "Tanggal Bayar" },
];

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
    const res = await iuranApi.getStatusSiswa(route.params.id);
    if (res.data.success) {
      iuran.value = res.data.data.iuran;
      data.total_siswa = res.data.data.total_siswa;
      data.lunas = res.data.data.lunas;
      data.pending = res.data.data.pending;
      data.belum_bayar = res.data.data.belum_bayar;
      siswaList.value = res.data.data.siswa || [];
    }
  } catch (error) {
    console.error("Gagal fetch data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
