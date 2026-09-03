<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-2xl">
      <!-- Logo & Title -->
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-blue-100"
        >
          K
        </div>
        <h2 class="mt-3 text-2xl font-bold text-gray-800">Daftar Akun Siswa</h2>
        <p class="mt-1 text-sm text-gray-500">
          Isi data diri Anda untuk mendaftar
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-6"
      >
        <form
          @submit.prevent="handleRegister"
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
              @blur="clearError('name')"
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
              @blur="clearError('email')"
            />
          </div>

          <!-- Password -->
          <div>
            <BaseInput
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
              :error="errors.password"
              @blur="clearError('password')"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <BaseInput
              v-model="form.password_confirmation"
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              required
              :error="errors.password_confirmation"
              @blur="clearError('password_confirmation')"
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
              @blur="clearError('nis')"
            />
          </div>

          <!-- NISN -->
          <div>
            <BaseInput
              v-model="form.nisn"
              label="NISN"
              placeholder="NISN (opsional)"
              :error="errors.nisn"
              @blur="clearError('nisn')"
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
                :class="{
                  'border-red-500 focus:ring-red-500': errors.kelas_id,
                }"
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

          <!-- Submit -->
          <div class="md:col-span-2">
            <BaseButton
              type="submit"
              variant="primary"
              class="w-full"
              size="lg"
              :loading="loading"
              :disabled="loading"
            >
              Daftar
            </BaseButton>
          </div>
        </form>

        <!-- Login Link -->
        <p class="mt-4 text-center text-sm text-gray-500">
          Sudah punya akun?
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Masuk sekarang
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import api from "@/api/axios";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  no_hp: "",
  kelas_id: "",
  nis: "",
  nisn: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
  nama_ortu: "",
  no_hp_ortu: "",
});

const errors = reactive({});
const loading = ref(false);
const kelasList = ref([]);

const clearError = (field) => {
  delete errors[field];
};

// Ambil daftar kelas
const fetchKelas = async () => {
  try {
    const response = await api.get("/kelas");
    if (response.data.success) {
      kelasList.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch kelas:", error);
  }
};

const handleRegister = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi sederhana
  if (!form.name) errors.name = "Nama wajib diisi";
  if (!form.email) errors.email = "Email wajib diisi";
  if (!form.password) errors.password = "Password wajib diisi";
  if (form.password && form.password.length < 8)
    errors.password = "Password minimal 8 karakter";
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "Password tidak sama";
  }
  if (!form.nis) errors.nis = "NIS wajib diisi";
  if (!form.kelas_id) errors.kelas_id = "Kelas wajib dipilih";

  if (Object.keys(errors).length > 0) {
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.register(form);

    if (result.success) {
      toast.success("Registrasi berhasil! Selamat datang.");
      router.push("/dashboard/siswa");
    } else {
      toast.error(result.message || "Registrasi gagal. Periksa data Anda.");
      // Tampilkan error dari backend
      if (result.errors) {
        Object.assign(errors, result.errors);
      }
    }
  } catch (error) {
    toast.error("Terjadi kesalahan. Silakan coba lagi.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKelas();
});
</script>
