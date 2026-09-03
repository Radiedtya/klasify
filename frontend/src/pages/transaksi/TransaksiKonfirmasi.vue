<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/transaksi"
        class="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeftIcon class="w-5 h-5 text-gray-500" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Konfirmasi Transaksi</h1>
        <p class="text-sm text-gray-500">
          Konfirmasi atau tolak pembayaran siswa
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Detail Transaksi -->
    <template v-else-if="transaksi">
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Siswa</p>
            <p class="font-medium">{{ transaksi.siswa?.user?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Kelas</p>
            <p class="font-medium">{{ transaksi.iuran?.kelas?.nama }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Bulan</p>
            <p class="font-medium">
              {{ getNamaBulan(transaksi.iuran?.bulan) }}
              {{ transaksi.iuran?.tahun }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jumlah</p>
            <p class="font-medium text-lg text-blue-600">
              {{ formatRupiah(transaksi.jumlah) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tanggal Bayar</p>
            <p class="font-medium">
              {{ formatTanggal(transaksi.tanggal_bayar) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Metode</p>
            <p class="font-medium">{{ transaksi.metode?.toUpperCase() }}</p>
          </div>
          <div v-if="transaksi.bukti_bayar" class="md:col-span-2">
            <p class="text-sm text-gray-500">Bukti Bayar</p>
            <p class="font-medium">{{ transaksi.bukti_bayar }}</p>
          </div>
          <div v-if="transaksi.keterangan" class="md:col-span-2">
            <p class="text-sm text-gray-500">Keterangan</p>
            <p class="font-medium">{{ transaksi.keterangan }}</p>
          </div>
        </div>
      </BaseCard>

      <!-- Form Konfirmasi -->
      <BaseCard>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="confirmed"
                  v-model="form.status"
                  class="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm text-green-600">Konfirmasi</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="rejected"
                  v-model="form.status"
                  class="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span class="text-sm text-red-600">Tolak</span>
              </label>
            </div>
            <p v-if="errors.status" class="mt-1 text-sm text-red-500">
              {{ errors.status }}
            </p>
          </div>

          <BaseInput
            v-model="form.keterangan"
            label="Catatan"
            placeholder="Tambahkan catatan (opsional)"
            :error="errors.keterangan"
          />

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <BaseButton
              type="submit"
              :variant="form.status === 'confirmed' ? 'success' : 'danger'"
              size="lg"
              :loading="loading"
            >
              {{ form.status === "confirmed" ? "Konfirmasi" : "Tolak" }}
            </BaseButton>
            <router-link to="/transaksi">
              <BaseButton variant="secondary" size="lg">Batal</BaseButton>
            </router-link>
          </div>
        </form>
      </BaseCard>
    </template>

    <!-- Tidak ada transaksi -->
    <div v-else class="text-center py-12">
      <p class="text-gray-400">Tidak ada transaksi pending</p>
      <router-link to="/transaksi" class="text-blue-600 hover:underline"
        >Kembali ke daftar transaksi</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { transaksiApi } from "../../api/transaksi";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import BaseButton from "../../components/common/BaseButton.vue";
import { formatRupiah } from "../../utils/formatRupiah";
import { formatTanggal } from "../../utils/formatTanggal";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const transaksi = ref(null);

const form = reactive({
  status: "confirmed",
  keterangan: "",
});

const errors = reactive({});

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
    let id = route.query.id;

    // Jika tidak ada id, ambil transaksi pending pertama
    if (!id) {
      const res = await transaksiApi.getPending();
      if (res.data.success && res.data.data.length > 0) {
        id = res.data.data[0].id;
      } else {
        loading.value = false;
        return;
      }
    }

    const res = await transaksiApi.getById(id);
    if (res.data.success) {
      transaksi.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data transaksi");
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.status) errors.status = "Status wajib dipilih";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const res = await transaksiApi.konfirmasi(transaksi.value.id, {
      status: form.status,
      keterangan: form.keterangan,
    });

    if (res.data.success) {
      toast.success(res.data.message || "Transaksi berhasil dikonfirmasi");
      router.push("/transaksi");
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(
        error.response?.data?.message || "Gagal mengkonfirmasi transaksi",
      );
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
