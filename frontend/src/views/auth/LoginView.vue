<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-50 p-4 sm:p-8 lg:p-12 font-sans">
    <div class="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden grid grid-cols-1 lg:grid-cols-5">
      
      <!-- Form Login -->
      <div class="lg:col-span-2 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 bg-white">
        <div class="mx-auto w-full max-w-sm">
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">Klasify</h1>
            <p class="text-zinc-500 text-sm mt-1">Masuk untuk mengelola kas kelas Anda</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Error Server -->
            <div v-if="serverError" class="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
              {{ serverError }}
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-xs font-medium text-zinc-600 mb-1.5">Alamat Email</label>
              <input
                v-model="form.email"
                @input="clearErrors"
                type="email"
                id="email"
                class="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 outline-none transition border-zinc-200"
                placeholder="nama@email.com"
              />
              <p v-if="errors.email" class="text-red-500 text-[11px] mt-1">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-xs font-medium text-zinc-600 mb-1.5">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  @input="clearErrors"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 outline-none transition border-zinc-200 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-[11px] mt-1">{{ errors.password }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg font-semibold text-sm transition disabled:bg-zinc-400"
            >
              {{ loading ? "Memuat..." : "Masuk Sekarang" }}
            </button>
          </form>

          <p class="text-center text-xs text-zinc-400 mt-8">© 2026 Klasify</p>
        </div>
      </div>

      <!-- Branding / Image -->
      <div class="hidden lg:block lg:col-span-3 relative bg-zinc-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
          class="absolute inset-0 h-full w-full object-cover opacity-40"
          alt="background"
        />
        <div class="relative z-10 flex flex-col justify-end h-full p-10 text-white">
          <div class="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 class="text-2xl font-bold mb-2">Selamat Datang Kembali!</h2>
            <p class="text-sm text-zinc-200">Kelola iuran, pengeluaran, dan laporan kas kelas Anda dengan mudah.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const showPassword = ref(false);
const serverError = ref("");
const errors = reactive({
  email: "",
  password: "",
});

const clearErrors = () => {
  errors.email = "";
  errors.password = "";
  serverError.value = "";
};

const handleLogin = async () => {
  if (!form.email) return (errors.email = "Email wajib diisi");
  if (!form.password) return (errors.password = "Password wajib diisi");

  loading.value = true;
  try {
    await authStore.login(form);

    const user = authStore.user || JSON.parse(localStorage.getItem('user_data') || '{}');

    let rawRole = "";
    if (typeof user.role === 'string') {
      rawRole = user.role;
    } else if (typeof user.role === 'object' && user.role !== null) {
      rawRole = user.role.name || user.role.slug || "";
    } else if (user.role_id) {
      if (user.role_id === 1) rawRole = "bendahara";
      else if (user.role_id === 2) rawRole = "siswa";
      else if (user.role_id === 3) rawRole = "guru";
    }

    const role = String(rawRole).toLowerCase();

    if (role === 'siswa') {
      router.push('/dashboard-siswa');
    } else if (role === 'bendahara') {
      router.push('/dashboard');
    } else if (role === 'guru') {
      router.push('/dashboard-guru');
    } else {
      router.push('/dashboard-siswa');
    }

  } catch (error) {
    serverError.value = error.response?.data?.message || "Gagal masuk, periksa jaringan atau akun Anda.";
  } finally {
    loading.value = false;
  }
};
</script>