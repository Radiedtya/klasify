<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/kelas"
        class="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeftIcon class="w-5 h-5 text-gray-500" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          Siswa Kelas {{ kelas?.nama }}
        </h1>
        <p class="text-sm text-gray-500">Total {{ siswaList.length }} siswa</p>
      </div>
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
        empty-text="Belum ada siswa di kelas ini"
      >
        <template #column-nama="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium"
            >
              {{ row.user?.name?.charAt(0) || "?" }}
            </div>
            <span>{{ row.user?.name || "-" }}</span>
          </div>
        </template>
        <template #column-nis="{ row }">
          <span class="font-mono text-sm">{{ row.nis }}</span>
        </template>
        <template #column-status="{ row }">
          <StatusBadge
            :status="row.user?.is_active ? 'aktif' : 'nonaktif'"
            custom-label="Aktif"
            v-if="row.user?.is_active"
          />
          <StatusBadge status="nonaktif" custom-label="Nonaktif" v-else />
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { kelasApi } from "../../api/kelas";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseTable from "../../components/common/BaseTable.vue";
import StatusBadge from "../../components/common/StatusBadge.vue";

const route = useRoute();
const loading = ref(false);
const kelas = ref(null);
const siswaList = ref([]);

const columns = [
  { key: "nama", label: "Nama" },
  { key: "nis", label: "NIS" },
  { key: "status", label: "Status" },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await kelasApi.getSiswa(route.params.id);
    if (res.data.success) {
      kelas.value = res.data.data.kelas;
      siswaList.value = res.data.data.siswa || [];
    }
  } catch (error) {
    console.error("Gagal fetch siswa:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
