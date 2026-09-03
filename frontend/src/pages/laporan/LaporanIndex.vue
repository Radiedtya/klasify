<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Laporan</h1>
        <p class="text-sm text-gray-500">Lihat dan export laporan keuangan</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportPdf"
          :disabled="loadingExport"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
        >
          <DocumentArrowDownIcon class="w-5 h-5" />
          {{ loadingExport ? "Memproses..." : "Export PDF" }}
        </button>
        <button
          @click="exportExcel"
          :disabled="loadingExport"
          class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
        >
          <TableCellsIcon class="w-5 h-5" />
          {{ loadingExport ? "Memproses..." : "Export Excel" }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 text-sm font-medium border-b-2 transition"
        :class="
          activeTab === tab.key
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Laporan Kas -->
      <div v-if="activeTab === 'kas'">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseCard class="border-l-4 border-l-blue-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Total Pemasukan</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ formatRupiah(kasData?.total_pemasukan || 0) }}
              </p>
            </div>
          </BaseCard>
          <BaseCard class="border-l-4 border-l-red-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Total Pengeluaran</p>
              <p class="text-2xl font-bold text-red-600">
                {{ formatRupiah(kasData?.total_pengeluaran || 0) }}
              </p>
            </div>
          </BaseCard>
          <BaseCard class="border-l-4 border-l-green-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Saldo</p>
              <p class="text-2xl font-bold text-green-600">
                {{ formatRupiah(kasData?.saldo || 0) }}
              </p>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Laporan Per Bulan -->
      <div v-if="activeTab === 'bulan'">
        <div class="flex gap-4 mb-4">
          <select
            v-model="bulanFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            <option
              v-for="(nama, index) in bulanList"
              :key="index"
              :value="index + 1"
            >
              {{ nama }}
            </option>
          </select>
          <select
            v-model="tahunFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            <option v-for="tahun in tahunList" :key="tahun" :value="tahun">
              {{ tahun }}
            </option>
          </select>
          <button
            @click="fetchPerBulan"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Tampilkan
          </button>
        </div>

        <div v-if="bulanData" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseCard class="border-l-4 border-l-blue-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Pemasukan</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ formatRupiah(bulanData.total_pemasukan || 0) }}
              </p>
            </div>
          </BaseCard>
          <BaseCard class="border-l-4 border-l-red-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Pengeluaran</p>
              <p class="text-2xl font-bold text-red-600">
                {{ formatRupiah(bulanData.total_pengeluaran || 0) }}
              </p>
            </div>
          </BaseCard>
          <BaseCard class="border-l-4 border-l-green-500">
            <div class="text-center">
              <p class="text-sm text-gray-500">Saldo</p>
              <p class="text-2xl font-bold text-green-600">
                {{ formatRupiah(bulanData.saldo || 0) }}
              </p>
            </div>
          </BaseCard>
        </div>

        <!-- Detail Transaksi -->
        <BaseCard v-if="bulanData?.transaksi?.length" title="Detail Transaksi">
          <BaseTable
            :columns="transaksiColumns"
            :data="bulanData.transaksi"
            empty-text="Tidak ada transaksi"
          >
            <template #column-siswa="{ row }">
              {{ row.siswa?.user?.name || "-" }}
            </template>
            <template #column-jumlah="{ row }">
              {{ formatRupiah(row.jumlah) }}
            </template>
            <template #column-status="{ row }">
              <StatusBadge :status="row.status" />
            </template>
          </BaseTable>
        </BaseCard>
      </div>

      <!-- Laporan Per Siswa -->
      <div v-if="activeTab === 'siswa'">
        <div class="flex gap-4 mb-4">
          <select
            v-model="siswaFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm flex-1"
          >
            <option value="">Pilih Siswa</option>
            <option v-for="s in siswaList" :key="s.id" :value="s.id">
              {{ s.user?.name }} ({{ s.nis }})
            </option>
          </select>
          <button
            @click="fetchPerSiswa"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Tampilkan
          </button>
        </div>

        <div v-if="siswaData">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <BaseCard>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <span class="text-gray-500">Nama</span>
                <span class="font-medium">{{
                  siswaData.siswa?.user?.name
                }}</span>
                <span class="text-gray-500">NIS</span>
                <span class="font-medium">{{ siswaData.siswa?.nis }}</span>
                <span class="text-gray-500">Kelas</span>
                <span class="font-medium">{{
                  siswaData.siswa?.kelas?.nama
                }}</span>
                <span class="text-gray-500">Total Bayar</span>
                <span class="font-medium text-blue-600">{{
                  formatRupiah(siswaData.total_bayar || 0)
                }}</span>
                <span class="text-gray-500">Total Transaksi</span>
                <span class="font-medium">{{
                  siswaData.total_transaksi || 0
                }}</span>
              </div>
            </BaseCard>
          </div>

          <BaseCard title="Riwayat Transaksi">
            <BaseTable
              :columns="siswaTransaksiColumns"
              :data="siswaData.transaksi || []"
              empty-text="Tidak ada transaksi"
            >
              <template #column-jumlah="{ row }">
                {{ formatRupiah(row.jumlah) }}
              </template>
              <template #column-status="{ row }">
                <StatusBadge :status="row.status" />
              </template>
            </BaseTable>
          </BaseCard>
        </div>
      </div>

      <!-- Laporan Per Kelas -->
      <div v-if="activeTab === 'kelas'">
        <div class="flex gap-4 mb-4">
          <select
            v-model="kelasFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm flex-1"
          >
            <option value="">Pilih Kelas</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">
              {{ k.nama }}
            </option>
          </select>
          <button
            @click="fetchPerKelas"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Tampilkan
          </button>
        </div>

        <div v-if="kelasData">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <BaseCard class="border-l-4 border-l-blue-500">
              <div class="text-center">
                <p class="text-sm text-gray-500">Total Siswa</p>
                <p class="text-2xl font-bold text-blue-600">
                  {{ kelasData.total_siswa || 0 }}
                </p>
              </div>
            </BaseCard>
            <BaseCard class="border-l-4 border-l-yellow-500">
              <div class="text-center">
                <p class="text-sm text-gray-500">Total Iuran</p>
                <p class="text-2xl font-bold text-yellow-600">
                  {{ kelasData.total_iuran || 0 }}
                </p>
              </div>
            </BaseCard>
            <BaseCard class="border-l-4 border-l-green-500">
              <div class="text-center">
                <p class="text-sm text-gray-500">Pemasukan</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ formatRupiah(kelasData.total_pemasukan || 0) }}
                </p>
              </div>
            </BaseCard>
            <BaseCard class="border-l-4 border-l-red-500">
              <div class="text-center">
                <p class="text-sm text-gray-500">Saldo</p>
                <p class="text-2xl font-bold text-red-600">
                  {{ formatRupiah(kelasData.saldo || 0) }}
                </p>
              </div>
            </BaseCard>
          </div>

          <BaseCard title="Status Siswa">
            <BaseTable
              :columns="kelasSiswaColumns"
              :data="kelasData.status_siswa || []"
              empty-text="Tidak ada data"
            >
              <template #column-status="{ row }">
                <StatusBadge
                  :status="row.status === 'lunas' ? 'success' : 'warning'"
                  :custom-label="
                    row.status === 'lunas' ? 'Lunas' : 'Belum Lunas'
                  "
                />
              </template>
            </BaseTable>
          </BaseCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { laporanApi } from "@/api/laporan";
import { siswaApi } from "@/api/siswa";
import { kelasApi } from "@/api/kelas";
import {
  DocumentArrowDownIcon,
  TableCellsIcon,
} from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseTable from "@/components/common/BaseTable.vue";
import StatusBadge from "@/components/common/StatusBadge.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const loadingExport = ref(false);

const activeTab = ref("kas");
const tabs = [
  { key: "kas", label: "Kas Total" },
  { key: "bulan", label: "Per Bulan" },
  { key: "siswa", label: "Per Siswa" },
  { key: "kelas", label: "Per Kelas" },
];

// Data
const kasData = ref(null);
const bulanData = ref(null);
const siswaData = ref(null);
const kelasData = ref(null);

// Filters
const bulanFilter = ref(new Date().getMonth() + 1);
const tahunFilter = ref(new Date().getFullYear());
const siswaFilter = ref("");
const kelasFilter = ref("");

// Lists
const siswaList = ref([]);
const kelasList = ref([]);

const bulanList = [
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
const tahunList = [];
for (
  let i = new Date().getFullYear() - 2;
  i <= new Date().getFullYear() + 2;
  i++
) {
  tahunList.push(i);
}

const transaksiColumns = [
  { key: "siswa", label: "Siswa" },
  { key: "tanggal_bayar", label: "Tanggal" },
  { key: "jumlah", label: "Jumlah" },
  { key: "status", label: "Status" },
];

const siswaTransaksiColumns = [
  { key: "tanggal_bayar", label: "Tanggal" },
  { key: "iuran.bulan_tahun", label: "Bulan" },
  { key: "jumlah", label: "Jumlah" },
  { key: "status", label: "Status" },
];

const kelasSiswaColumns = [
  { key: "nama", label: "Nama" },
  { key: "nis", label: "NIS" },
  { key: "status", label: "Status" },
];

// Fetch Functions
const fetchKas = async () => {
  loading.value = true;
  try {
    const res = await laporanApi.getKas();
    if (res.data.success) {
      kasData.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data kas");
  } finally {
    loading.value = false;
  }
};

const fetchPerBulan = async () => {
  if (!bulanFilter.value || !tahunFilter.value) return;
  loading.value = true;
  try {
    const res = await laporanApi.getPerBulan(
      bulanFilter.value,
      tahunFilter.value,
    );
    if (res.data.success) {
      bulanData.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data bulan");
  } finally {
    loading.value = false;
  }
};

const fetchPerSiswa = async () => {
  if (!siswaFilter.value) return;
  loading.value = true;
  try {
    const res = await laporanApi.getPerSiswa(siswaFilter.value);
    if (res.data.success) {
      siswaData.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data siswa");
  } finally {
    loading.value = false;
  }
};

const fetchPerKelas = async () => {
  if (!kelasFilter.value) return;
  loading.value = true;
  try {
    const res = await laporanApi.getPerKelas(kelasFilter.value);
    if (res.data.success) {
      kelasData.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data kelas");
  } finally {
    loading.value = false;
  }
};

// Export
const exportPdf = async () => {
  loadingExport.value = true;
  try {
    const params = { type: activeTab.value };
    if (activeTab.value === "siswa" && siswaFilter.value) {
      params.siswa_id = siswaFilter.value;
    }
    const res = await laporanApi.exportPdf(params);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan_${activeTab.value}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("PDF berhasil di-download");
  } catch (error) {
    toast.error("Gagal export PDF");
  } finally {
    loadingExport.value = false;
  }
};

const exportExcel = async () => {
  loadingExport.value = true;
  try {
    const params = { type: activeTab.value };
    if (activeTab.value === "siswa" && siswaFilter.value) {
      params.siswa_id = siswaFilter.value;
    }
    if (activeTab.value === "bulan") {
      params.bulan = bulanFilter.value;
      params.tahun = tahunFilter.value;
    }
    const res = await laporanApi.exportExcel(params);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan_${activeTab.value}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Excel berhasil di-download");
  } catch (error) {
    toast.error("Gagal export Excel");
  } finally {
    loadingExport.value = false;
  }
};

// Initial load
const loadInitialData = async () => {
  await Promise.all([
    fetchKas(),
    siswaApi.getAll().then((res) => {
      if (res.data.success) siswaList.value = res.data.data;
    }),
    kelasApi.getAll().then((res) => {
      if (res.data.success) kelasList.value = res.data.data;
    }),
  ]);
};

onMounted(() => {
  loadInitialData();
  fetchPerBulan();
});
</script>
