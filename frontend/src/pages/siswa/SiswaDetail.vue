<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <template v-else>
      <!-- Back -->
      <router-link
        to="/siswa"
        class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Kembali ke Daftar Siswa
      </router-link>

      <!-- Profile Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BaseCard class="lg:col-span-1">
          <div class="text-center">
            <div
              class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold mx-auto"
            >
              {{ siswa?.user?.name?.charAt(0) || "?" }}
            </div>
            <h2 class="mt-3 text-xl font-bold text-gray-800">
              {{ siswa?.user?.name }}
            </h2>
            <p class="text-sm text-gray-500">{{ siswa?.user?.email }}</p>
            <div class="mt-2">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                :class="
                  siswa?.user?.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ siswa?.user?.is_active ? "Aktif" : "Nonaktif" }}
              </span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">NIS</span>
              <span class="font-medium">{{ siswa?.nis || "-" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">NISN</span>
              <span class="font-medium">{{ siswa?.nisn || "-" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kelas</span>
              <span class="font-medium">{{ siswa?.kelas?.nama || "-" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">No. HP</span>
              <span class="font-medium">{{ siswa?.user?.no_hp || "-" }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="Informasi Pribadi" class="lg:col-span-2">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Tempat Lahir</p>
              <p class="font-medium">{{ siswa?.tempat_lahir || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">Tanggal Lahir</p>
              <p class="font-medium">
                {{ formatTanggal(siswa?.tanggal_lahir) || "-" }}
              </p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-500">Alamat</p>
              <p class="font-medium">{{ siswa?.alamat || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">Nama Orang Tua</p>
              <p class="font-medium">{{ siswa?.nama_ortu || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500">No. HP Orang Tua</p>
              <p class="font-medium">{{ siswa?.no_hp_ortu || "-" }}</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Riwayat Transaksi -->
      <BaseCard title="Riwayat Transaksi">
        <BaseTable
          :columns="transaksiColumns"
          :data="siswa?.transaksi || []"
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { siswaApi } from "@/api/siswa";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal } from "@/utils/formatTanggal";

const route = useRoute();
const loading = ref(false);
const siswa = ref(null);

const transaksiColumns = [
  { key: "tanggal_bayar", label: "Tanggal" },
  { key: "iuran.bulan_tahun", label: "Bulan" },
  { key: "jumlah", label: "Jumlah" },
  { key: "status", label: "Status" },
];

const fetchSiswa = async () => {
  loading.value = true;
  try {
    const res = await siswaApi.getById(route.params.id);
    if (res.data.success) {
      siswa.value = res.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch siswa:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSiswa();
});
</script>
