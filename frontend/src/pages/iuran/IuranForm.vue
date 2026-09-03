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
        <h1 class="text-2xl font-bold text-gray-800">
          {{ isEdit ? "Edit Iuran" : "Tambah Iuran" }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ isEdit ? "Perbarui data iuran" : "Tambah data iuran baru" }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <BaseCard>
      <form
        @submit.prevent="handleSubmit"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <!-- Kelas -->
        <div class="md:col-span-2">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Kelas <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.kelas_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.kelas_id }"
            >
              <option value="">Pilih Kelas</option>
              <option
                v-for="kelas in kelasList"
                :key="kelas.id"
                :value="kelas.id"
              >
                {{ kelas.nama }}
              </option>
            </select>
            <p v-if="errors.kelas_id" class="mt-1 text-sm text-red-500">
              {{ errors.kelas_id }}
            </p>
          </div>
        </div>

        <!-- Bulan -->
        <div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Bulan <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.bulan"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.bulan }"
            >
              <option value="">Pilih Bulan</option>
              <option
                v-for="(nama, index) in bulanList"
                :key="index"
                :value="index + 1"
              >
                {{ nama }}
              </option>
            </select>
            <p v-if="errors.bulan" class="mt-1 text-sm text-red-500">
              {{ errors.bulan }}
            </p>
          </div>
        </div>

        <!-- Tahun -->
        <div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tahun <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.tahun"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.tahun }"
            >
              <option value="">Pilih Tahun</option>
              <option v-for="tahun in tahunList" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>
            <p v-if="errors.tahun" class="mt-1 text-sm text-red-500">
              {{ errors.tahun }}
            </p>
          </div>
        </div>

        <!-- Nominal -->
        <div>
          <BaseInput
            v-model="form.nominal"
            label="Nominal"
            type="number"
            placeholder="Masukkan nominal"
            required
            :error="errors.nominal"
          />
        </div>

        <!-- Jatuh Tempo -->
        <div>
          <BaseInput
            v-model="form.jatuh_tempo"
            label="Jatuh Tempo"
            type="date"
            required
            :error="errors.jatuh_tempo"
          />
        </div>

        <!-- Status Active -->
        <div class="md:col-span-2">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Iuran Aktif
          </label>
        </div>

        <!-- Submit -->
        <div class="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
          >
            {{ isEdit ? "Update" : "Simpan" }}
          </BaseButton>
          <router-link to="/iuran">
            <BaseButton variant="secondary" size="lg">Batal</BaseButton>
          </router-link>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { iuranApi } from "../../api/iuran";
import { kelasApi } from "../../api/kelas";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import BaseButton from "../../components/common/BaseButton.vue";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
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
const currentYear = new Date().getFullYear();
for (let i = currentYear - 2; i <= currentYear + 2; i++) {
  tahunList.push(i);
}

const form = reactive({
  kelas_id: "",
  bulan: "",
  tahun: "",
  nominal: "",
  jatuh_tempo: "",
  is_active: true,
});

const errors = reactive({});

const fetchKelas = async () => {
  try {
    const res = await kelasApi.getAll();
    if (res.data.success) {
      kelasList.value = res.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch kelas:", error);
  }
};

const fetchIuran = async () => {
  try {
    const res = await iuranApi.getById(route.params.id);
    if (res.data.success) {
      const data = res.data.data;
      form.kelas_id = data.kelas_id || "";
      form.bulan = data.bulan || "";
      form.tahun = data.tahun || "";
      form.nominal = data.nominal || "";
      form.jatuh_tempo = data.jatuh_tempo || "";
      form.is_active = data.is_active ?? true;
    }
  } catch (error) {
    toast.error("Gagal mengambil data iuran");
    router.push("/iuran");
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  if (!form.kelas_id) errors.kelas_id = "Kelas wajib dipilih";
  if (!form.bulan) errors.bulan = "Bulan wajib dipilih";
  if (!form.tahun) errors.tahun = "Tahun wajib dipilih";
  if (!form.nominal) errors.nominal = "Nominal wajib diisi";
  if (!form.jatuh_tempo) errors.jatuh_tempo = "Jatuh tempo wajib diisi";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const payload = { ...form };
    if (!isEdit.value) {
      const res = await iuranApi.create(payload);
      if (res.data.success) {
        toast.success("Iuran berhasil ditambahkan");
        router.push("/iuran");
      }
    } else {
      const res = await iuranApi.update(route.params.id, payload);
      if (res.data.success) {
        toast.success("Iuran berhasil diperbarui");
        router.push("/iuran");
      }
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKelas();
  if (isEdit.value) {
    fetchIuran();
  }
});
</script>
