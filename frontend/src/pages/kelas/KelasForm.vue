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
          {{ isEdit ? "Edit Kelas" : "Tambah Kelas" }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ isEdit ? "Perbarui data kelas" : "Tambah data kelas baru" }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nama Kelas -->
        <BaseInput
          v-model="form.nama"
          label="Nama Kelas"
          placeholder="Contoh: XII IPA 1"
          required
          :error="errors.nama"
        />

        <!-- Tahun Ajaran -->
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tahun Ajaran <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.tahun_ajaran"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            :class="{
              'border-red-500 focus:ring-red-500': errors.tahun_ajaran,
            }"
          >
            <option value="">Pilih Tahun Ajaran</option>
            <option
              v-for="tahun in tahunAjaranList"
              :key="tahun"
              :value="tahun"
            >
              {{ tahun }}
            </option>
          </select>
          <p v-if="errors.tahun_ajaran" class="mt-1 text-sm text-red-500">
            {{ errors.tahun_ajaran }}
          </p>
        </div>

        <!-- Wali Kelas -->
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Wali Kelas
          </label>
          <select
            v-model="form.wali_kelas_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="">Pilih Wali Kelas</option>
            <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
              {{ guru.name }}
            </option>
          </select>
        </div>

        <!-- Status Active -->
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Kelas Aktif
        </label>

        <!-- Submit -->
        <div class="flex gap-3 pt-4 border-t border-gray-100">
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
          >
            {{ isEdit ? "Update" : "Simpan" }}
          </BaseButton>
          <router-link to="/kelas">
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
import { kelasApi } from "../../api/kelas";
import { userApi } from "../../api/user";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import BaseButton from "../../components/common/BaseButton.vue";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const guruList = ref([]);

const tahunAjaranList = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];

const form = reactive({
  nama: "",
  tahun_ajaran: "",
  wali_kelas_id: "",
  is_active: true,
});

const errors = reactive({});

const fetchGuru = async () => {
  try {
    const res = await userApi.getByRole("guru");
    if (res.data.success) {
      guruList.value = res.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch guru:", error);
  }
};

const fetchKelas = async () => {
  try {
    const res = await kelasApi.getById(route.params.id);
    if (res.data.success) {
      const data = res.data.data;
      form.nama = data.nama || "";
      form.tahun_ajaran = data.tahun_ajaran || "";
      form.wali_kelas_id = data.wali_kelas_id || "";
      form.is_active = data.is_active ?? true;
    }
  } catch (error) {
    toast.error("Gagal mengambil data kelas");
    router.push("/kelas");
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  if (!form.nama) errors.nama = "Nama kelas wajib diisi";
  if (!form.tahun_ajaran) errors.tahun_ajaran = "Tahun ajaran wajib dipilih";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const payload = { ...form };
    if (!isEdit.value) {
      const res = await kelasApi.create(payload);
      if (res.data.success) {
        toast.success("Kelas berhasil ditambahkan");
        router.push("/kelas");
      }
    } else {
      const res = await kelasApi.update(route.params.id, payload);
      if (res.data.success) {
        toast.success("Kelas berhasil diperbarui");
        router.push("/kelas");
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
  fetchGuru();
  if (isEdit.value) {
    fetchKelas();
  }
});
</script>
