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
        <h1 class="text-2xl font-bold text-gray-800">Bayar Iuran</h1>
        <p class="text-sm text-gray-500">Lakukan pembayaran iuran Anda</p>
      </div>
    </div>

    <!-- Form -->
    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Siswa (hanya untuk bendahara) -->
        <div v-if="isBendahara">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Pilih Siswa <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.siswa_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.siswa_id }"
            >
              <option value="">Pilih Siswa</option>
              <option
                v-for="siswa in siswaList"
                :key="siswa.id"
                :value="siswa.id"
              >
                {{ siswa.user?.name }} ({{ siswa.nis }})
              </option>
            </select>
            <p v-if="errors.siswa_id" class="mt-1 text-sm text-red-500">
              {{ errors.siswa_id }}
            </p>
          </div>
        </div>

        <!-- Iuran -->
        <div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Pilih Iuran <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.iuran_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.iuran_id }"
              @change="onIuranChange"
            >
              <option value="">Pilih Iuran</option>
              <option
                v-for="iuran in iuranList"
                :key="iuran.id"
                :value="iuran.id"
              >
                {{ getNamaBulan(iuran.bulan) }} {{ iuran.tahun }} -
                {{ iuran.kelas?.nama }} ({{ formatRupiah(iuran.nominal) }})
              </option>
            </select>
            <p v-if="errors.iuran_id" class="mt-1 text-sm text-red-500">
              {{ errors.iuran_id }}
            </p>
          </div>
        </div>

        <!-- Info Iuran -->
        <div v-if="selectedIuran" class="p-4 bg-blue-50 rounded-lg">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <span class="text-gray-500">Kelas</span>
            <span class="font-medium">{{ selectedIuran.kelas?.nama }}</span>
            <span class="text-gray-500">Nominal</span>
            <span class="font-medium">{{
              formatRupiah(selectedIuran.nominal)
            }}</span>
            <span class="text-gray-500">Jatuh Tempo</span>
            <span class="font-medium">{{
              formatTanggal(selectedIuran.jatuh_tempo)
            }}</span>
          </div>
        </div>

        <!-- Jumlah (auto filled) -->
        <BaseInput
          v-model="form.jumlah"
          label="Jumlah"
          type="number"
          placeholder="Masukkan jumlah"
          required
          :error="errors.jumlah"
        />

        <!-- Tanggal Bayar -->
        <BaseInput
          v-model="form.tanggal_bayar"
          label="Tanggal Bayar"
          type="date"
          required
          :error="errors.tanggal_bayar"
        />

        <!-- Metode -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Metode Pembayaran <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-3">
            <label
              v-for="metode in metodeList"
              :key="metode.value"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                :value="metode.value"
                v-model="form.metode"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm">{{ metode.label }}</span>
            </label>
          </div>
          <p v-if="errors.metode" class="mt-1 text-sm text-red-500">
            {{ errors.metode }}
          </p>
        </div>

        <!-- Bukti Bayar (opsional) -->
        <BaseInput
          v-model="form.bukti_bayar"
          label="Bukti Bayar"
          placeholder="Nama file bukti (opsional)"
          :error="errors.bukti_bayar"
        />

        <!-- Keterangan -->
        <BaseInput
          v-model="form.keterangan"
          label="Keterangan"
          placeholder="Catatan tambahan (opsional)"
          :error="errors.keterangan"
        />

        <!-- Submit -->
        <div class="flex gap-3 pt-4 border-t border-gray-100">
          <BaseButton
            type="submit"
            variant="success"
            size="lg"
            :loading="loading"
          >
            Bayar
          </BaseButton>
          <router-link to="/transaksi">
            <BaseButton variant="secondary" size="lg">Batal</BaseButton>
          </router-link>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { transaksiApi } from "../../api/transaksi";
import { iuranApi } from "../../api/iuran";
import { siswaApi } from "../../api/siswa";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import BaseButton from "../../components/common/BaseButton.vue";
import { formatRupiah } from "../../utils/formatRupiah";
import { formatTanggal } from "../../utils/formatTanggal";
import { toast } from "vue3-toastify";

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const siswaList = ref([]);
const iuranList = ref([]);
const selectedIuran = ref(null);

const isBendahara = computed(() => user?.role?.name === "bendahara");
const isSiswa = computed(() => user?.role?.name === "siswa");

const metodeList = [
  { value: "tunai", label: "Tunai" },
  { value: "transfer", label: "Transfer" },
  { value: "qris", label: "QRIS" },
];

const form = reactive({
  siswa_id: "",
  iuran_id: "",
  jumlah: "",
  tanggal_bayar: new Date().toISOString().split("T")[0],
  metode: "tunai",
  bukti_bayar: "",
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

const fetchSiswa = async () => {
  try {
    const res = await siswaApi.getAll();
    if (res.data.success) {
      siswaList.value = res.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch siswa:", error);
  }
};

const fetchIuran = async () => {
  try {
    const params = {};
    if (isSiswa.value) {
      // Ambil iuran untuk kelas siswa
      const userSiswa = await siswaApi.getMy();
      if (userSiswa.data.success) {
        params.kelas_id = userSiswa.data.data.kelas_id;
      }
    }
    const res = await iuranApi.getAll({ params });
    if (res.data.success) {
      iuranList.value = res.data.data.filter((i) => i.is_active);
    }
  } catch (error) {
    console.error("Gagal fetch iuran:", error);
  }
};

const onIuranChange = () => {
  const iuran = iuranList.value.find((i) => i.id === Number(form.iuran_id));
  selectedIuran.value = iuran;
  if (iuran) {
    form.jumlah = iuran.nominal;
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  const siswaId = isSiswa.value ? null : form.siswa_id;
  if (!isSiswa.value && !form.siswa_id) errors.siswa_id = "Siswa wajib dipilih";
  if (!form.iuran_id) errors.iuran_id = "Iuran wajib dipilih";
  if (!form.jumlah) errors.jumlah = "Jumlah wajib diisi";
  if (!form.tanggal_bayar) errors.tanggal_bayar = "Tanggal bayar wajib diisi";
  if (!form.metode) errors.metode = "Metode wajib dipilih";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const payload = { ...form };

    // Siswa: ambil dari user yang login
    if (isSiswa.value) {
      const userSiswa = await siswaApi.getMy();
      if (userSiswa.data.success) {
        payload.siswa_id = userSiswa.data.data.id;
      }
    }

    const res = await transaksiApi.create(payload);
    if (res.data.success) {
      toast.success(
        res.data.message || "Pembayaran berhasil! Menunggu konfirmasi.",
      );
      router.push("/transaksi");
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(
        error.response?.data?.message || "Gagal melakukan pembayaran",
      );
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchIuran();
  if (isBendahara.value) {
    await fetchSiswa();
  }
});
</script>
