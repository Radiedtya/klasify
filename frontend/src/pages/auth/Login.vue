<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-blue-100"
        >
          K
        </div>
        <h2 class="mt-4 text-2xl font-bold text-gray-800">Kas Kelas</h2>
        <p class="mt-1 text-sm text-gray-500">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-6"
      >
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Masukkan email Anda"
            required
            :error="errors.email"
            @blur="clearError('email')"
          />

          <!-- Password -->
          <div class="mt-4">
            <BaseInput
              v-model="form.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password Anda"
              required
              :error="errors.password"
              @blur="clearError('password')"
            >
              <template #append>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon v-if="!showPassword" class="w-4 h-4" />
                  <EyeSlashIcon v-else class="w-4 h-4" />
                </button>
              </template>
            </BaseInput>
          </div>

          <!-- Remember Me & Forgot -->
          <div class="flex items-center justify-between mt-4">
            <label class="flex items-center text-sm text-gray-600">
              <input
                v-model="remember"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2">Ingat saya</span>
            </label>
            <a
              href="#"
              class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >Lupa password?</a
            >
          </div>

          <!-- Submit -->
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full mt-6"
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            Masuk
          </BaseButton>
        </form>

        <!-- Register Link -->
        <p class="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?
          <router-link
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Daftar sekarang
          </router-link>
        </p>
      </div>

      <!-- Demo Accounts -->
      <div class="mt-6 text-center text-xs text-gray-400">
        <p class="font-medium text-gray-500 mb-1">Akun Demo:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <span
            class="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
            >Guru: guru@sekolah.com</span
          >
          <span
            class="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded"
            >Bendahara: bendahara@sekolah.com</span
          >
          <span
            class="inline-block px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded"
            >Siswa: siswa@sekolah.com</span
          >
        </div>
        <p class="mt-1">Password: <span class="font-mono">password123</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { toast } from "vue3-toastify";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const remember = ref(false);
const showPassword = ref(false);

const clearError = (field) => {
  errors[field] = "";
};

const handleLogin = async () => {
  // Reset errors
  errors.email = "";
  errors.password = "";

  // Validasi sederhana
  if (!form.email) {
    errors.email = "Email wajib diisi";
    return;
  }
  if (!form.password) {
    errors.password = "Password wajib diisi";
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.login(form.email, form.password);

    if (result.success) {
      toast.success("Login berhasil! Selamat datang kembali.");

      // Redirect berdasarkan role
      const role = result.user?.role?.name;
      if (role === "guru") {
        router.push("/dashboard/guru");
      } else if (role === "bendahara") {
        router.push("/dashboard/bendahara");
      } else if (role === "siswa") {
        router.push("/dashboard/siswa");
      } else {
        router.push("/");
      }
    } else {
      toast.error(
        result.message || "Login gagal. Periksa email dan password Anda.",
      );
    }
  } catch (error) {
    toast.error("Terjadi kesalahan. Silakan coba lagi.");
  } finally {
    loading.value = false;
  }
};
</script>
