<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center max-w-2xl px-4">
      <!-- Logo -->
      <div
        class="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg shadow-blue-100"
      >
        K
      </div>

      <!-- Title -->
      <h1 class="mt-6 text-4xl font-bold text-gray-800">Kas Kelas</h1>
      <p class="mt-2 text-gray-500 text-lg">Sistem Manajemen Kas Kelas</p>

      <!-- Description -->
      <p class="mt-4 text-gray-400">
        Kelola iuran, transaksi, dan pengeluaran kelas dengan mudah.
      </p>

      <!-- Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/login"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition"
        >
          Register
        </router-link>
      </div>

      <!-- Info -->
      <div class="mt-8 text-sm text-gray-400">
        <p>Demo Akun:</p>
        <div class="flex flex-wrap justify-center gap-2 mt-1">
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
