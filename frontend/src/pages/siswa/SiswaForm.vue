<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/siswa"
        class="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeftIcon class="w-5 h-5 text-gray-500" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          {{ isEdit ? "Edit Siswa" : "Tambah Siswa" }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ isEdit ? "Perbarui data siswa" : "Tambah data siswa baru" }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <BaseCard>
      <form
        @submit.prevent="handleSubmit"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <!-- Nama -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.name"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            required
            :error="errors.name"
          />
        </div>

        <!-- Email -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Masukkan email"
            required
            :error="errors.email"
          />
        </div>

        <!-- Password (hanya untuk tambah) -->
        <div v-if="!isEdit" class="md:col-span-2">
          <BaseInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            :error="errors.password"
          />
        </div>

        <!-- NIS -->
        <div>
          <BaseInput
            v-model="form.nis"
            label="NIS"
            placeholder="Nomor Induk Siswa"
            required
            :error="errors.nis"
          />
        </div>

        <!-- NISN -->
        <div>
          <BaseInput
            v-model="form.nisn"
            label="NISN"
            placeholder="NISN (opsional)"
            :error="errors.nisn"
          />
        </div>

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

        <!-- Tempat Lahir -->
        <div>
          <BaseInput
            v-model="form.tempat_lahir"
            label="Tempat Lahir"
            placeholder="Kota lahir"
          />
        </div>

        <!-- Tanggal Lahir -->
        <div>
          <BaseInput
            v-model="form.tanggal_lahir"
            label="Tanggal Lahir"
            type="date"
          />
        </div>

        <!-- Alamat -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.alamat"
            label="Alamat"
            placeholder="Alamat lengkap"
          />
        </div>

        <!-- Nama Orang Tua -->
        <div>
          <BaseInput
            v-model="form.nama_ortu"
            label="Nama Orang Tua"
            placeholder="Nama ayah/ibu"
          />
        </div>

        <!-- No HP Orang Tua -->
        <div>
          <BaseInput
            v-model="form.no_hp_ortu"
            label="No. HP Orang Tua"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <!-- No HP Siswa -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.no_hp"
            label="No. HP Siswa"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <!-- Status Active (hanya untuk edit) -->
        <div v-if="isEdit" class="md:col-span-2">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Siswa Aktif
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
          <router-link to="/siswa">
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
import { siswaApi } from "@/api/siswa";
import { kelasApi } from "@/api/kelas";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const kelasList = ref([]);

const form = reactive({
  name: "",
  email: "",
  password: "",
  no_hp: "",
  kelas_id: "",
  nis: "",
  nisn: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
  nama_ortu: "",
  no_hp_ortu: "",
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

const fetchSiswa = async () => {
  try {
    const res = await siswaApi.getById(route.params.id);
    if (res.data.success) {
      const data = res.data.data;
      form.name = data.user?.name || "";
      form.email = data.user?.email || "";
      form.no_hp = data.user?.no_hp || "";
      form.kelas_id = data.kelas_id || "";
      form.nis = data.nis || "";
      form.nisn = data.nisn || "";
      form.tempat_lahir = data.tempat_lahir || "";
      form.tanggal_lahir = data.tanggal_lahir || "";
      form.alamat = data.alamat || "";
      form.nama_ortu = data.nama_ortu || "";
      form.no_hp_ortu = data.no_hp_ortu || "";
      form.is_active = data.user?.is_active ?? true;
    }
  } catch (error) {
    toast.error("Gagal mengambil data siswa");
    router.push("/siswa");
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  if (!form.name) errors.name = "Nama wajib diisi";
  if (!form.email) errors.email = "Email wajib diisi";
  if (!form.kelas_id) errors.kelas_id = "Kelas wajib dipilih";
  if (!form.nis) errors.nis = "NIS wajib diisi";
  if (!isEdit.value && !form.password) errors.password = "Password wajib diisi";
  if (!isEdit.value && form.password && form.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
  }

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const payload = { ...form };
    if (!isEdit.value) {
      // Tambah siswa
      const res = await siswaApi.create(payload);
      if (res.data.success) {
        toast.success("Siswa berhasil ditambahkan");
        router.push("/siswa");
      }
    } else {
      // Edit siswa
      const res = await siswaApi.update(route.params.id, payload);
      if (res.data.success) {
        toast.success("Siswa berhasil diperbarui");
        router.push("/siswa");
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
    fetchSiswa();
  }
});
</script>
