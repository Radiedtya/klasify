<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center max-w-md">
      <!-- Icon -->
      <div class="mb-6">
        <div
          class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto"
        >
          <svg
            class="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p class="text-gray-500 mb-8">
        Maaf, halaman yang Anda cari tidak tersedia.
      </p>

      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Kembali ke Home
      </router-link>
    </div>
  </div>
</template>
