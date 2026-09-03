<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition"
    >
      <div
        class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm"
      >
        {{ userInitial }}
      </div>
      <ChevronDownIcon class="w-4 h-4 text-gray-400" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
    >
      <div class="px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-800">{{ user?.name }}</p>
        <p class="text-xs text-gray-500">{{ user?.email }}</p>
        <p class="text-xs text-gray-400 mt-1">
          <span
            class="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs"
          >
            {{ user?.role?.display_name }}
          </span>
        </p>
      </div>

      <div class="py-1">
        <router-link
          to="/profile"
          class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <UserIcon class="w-4 h-4" />
          Profile
        </router-link>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const dropdownRef = ref(null);

const user = computed(() => authStore.user);
const userInitial = computed(
  () => user.value?.name?.charAt(0)?.toUpperCase() || "U",
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = async () => {
  const result = await Swal.fire({
    title: "Konfirmasi Logout",
    text: "Apakah Anda yakin ingin keluar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    await authStore.logout();
    router.push("/login");
  }
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
