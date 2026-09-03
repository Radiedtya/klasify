<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
    >
      <BellIcon class="w-5 h-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-100"
      >
        <h3 class="font-semibold text-gray-800">Notifikasi</h3>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="text-xs text-blue-600 hover:text-blue-800 transition"
        >
          Tandai semua dibaca
        </button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-gray-400 text-sm">
          Memuat...
        </div>
        <div
          v-else-if="notifikasi.length === 0"
          class="p-4 text-center text-gray-400 text-sm"
        >
          Tidak ada notifikasi
        </div>
        <div
          v-else
          v-for="item in notifikasi.slice(0, 10)"
          :key="item.id"
          class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
          :class="{ 'bg-blue-50/50': !item.is_read }"
          @click="handleClick(item)"
        >
          <div class="flex items-start gap-2">
            <div class="shrink-0 mt-0.5">
              <div
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-blue-500': item.tipe === 'info',
                  'bg-yellow-500': item.tipe === 'warning',
                  'bg-red-500': item.tipe === 'danger',
                  'bg-green-500': item.tipe === 'success',
                }"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ item.judul }}
              </p>
              <p class="text-xs text-gray-500 truncate">{{ item.pesan }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatWaktu(item.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2 border-t border-gray-100 text-center">
        <router-link
          to="/notifikasi"
          class="text-sm text-blue-600 hover:text-blue-800 transition"
          @click="isOpen = false"
        >
          Lihat semua notifikasi
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { BellIcon } from "@heroicons/vue/24/outline";
import { useNotifikasiStore } from "../../stores/notifikasi";
import { formatTanggalWaktu } from "../../utils/formatTanggal";
import { useRouter } from "vue-router";

const router = useRouter();
const notifikasiStore = useNotifikasiStore();
const isOpen = ref(false);
const loading = ref(false);

const notifikasi = computed(() => notifikasiStore.notifikasi);
const unreadCount = computed(() => notifikasiStore.unreadCount);

const dropdownRef = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    notifikasiStore.fetchNotifikasi();
  }
};

const markAllRead = async () => {
  await notifikasiStore.markAllAsRead();
};

const handleClick = async (item) => {
  if (!item.is_read) {
    await notifikasiStore.markAsRead(item.id);
  }
  if (item.link) {
    router.push(item.link);
  }
  isOpen.value = false;
};

const formatWaktu = (date) => formatTanggalWaktu(date);

// Click outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  notifikasiStore.fetchNotifikasi();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
