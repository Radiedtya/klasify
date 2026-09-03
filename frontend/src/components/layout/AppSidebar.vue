<template>
  <aside
    class="bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
    :class="collapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 h-16 px-4 border-b border-gray-100">
      <div
        class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0"
      >
        K
      </div>
      <span v-if="!collapsed" class="text-lg font-semibold text-gray-800"
        >Kas Kelas</span
      >
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <template v-for="menu in filteredMenus" :key="menu.path">
        <router-link
          :to="menu.path"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group"
          :class="
            isActive(menu.path)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          "
        >
          <component
            :is="menu.icon"
            class="w-5 h-5 shrink-0"
            :class="
              isActive(menu.path)
                ? 'text-blue-700'
                : 'text-gray-400 group-hover:text-gray-600'
            "
          />
          <span v-if="!collapsed" class="truncate">{{ menu.label }}</span>

          <!-- Badge untuk notifikasi -->
          <span
            v-if="menu.badge && !collapsed"
            class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ menu.badge }}
          </span>

          <!-- Tooltip saat collapsed -->
          <div
            v-if="collapsed"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50"
          >
            {{ menu.label }}
          </div>
        </router-link>
      </template>
    </nav>

    <!-- Bottom: User info -->
    <div class="border-t border-gray-100 p-3">
      <div v-if="!collapsed" class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium"
        >
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">
            {{ user?.name || "User" }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ user?.role?.display_name || "Role" }}
          </p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div
          class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium"
        >
          {{ userInitial }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotifikasiStore } from "@/stores/notifikasi";
import {
  HomeIcon,
  UsersIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ArrowUpOnSquareStackIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const authStore = useAuthStore();
const notifikasiStore = useNotifikasiStore();

const user = computed(() => authStore.user);
const userInitial = computed(
  () => user.value?.name?.charAt(0)?.toUpperCase() || "U",
);

const isActive = (path) => {
  if (path === "/dashboard") {
    return route.path.startsWith("/dashboard");
  }
  return route.path === path;
};

// Menu items
const allMenus = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: HomeIcon,
    roles: ["guru", "bendahara", "siswa"],
  },
  {
    label: "Siswa",
    path: "/siswa",
    icon: UsersIcon,
    roles: ["guru", "bendahara"],
  },
  {
    label: "Kelas",
    path: "/kelas",
    icon: BuildingLibraryIcon,
    roles: ["guru", "bendahara"],
  },
  {
    label: "Iuran",
    path: "/iuran",
    icon: CurrencyDollarIcon,
    roles: ["guru", "bendahara", "siswa"],
  },
  {
    label: "Transaksi",
    path: "/transaksi",
    icon: CreditCardIcon,
    roles: ["guru", "bendahara", "siswa"],
  },
  {
    label: "Pengeluaran",
    path: "/pengeluaran",
    icon: ArrowUpOnSquareStackIcon,
    roles: ["guru", "bendahara", "siswa"],
  },
  {
    label: "Keterlambatan",
    path: "/keterlambatan",
    icon: ExclamationTriangleIcon,
    roles: ["guru", "bendahara"],
  },
  {
    label: "Notifikasi",
    path: "/notifikasi",
    icon: BellIcon,
    roles: ["guru", "bendahara", "siswa"],
    badge: notifikasiStore.unreadCount || 0,
  },
  {
    label: "Laporan",
    path: "/laporan",
    icon: ChartBarIcon,
    roles: ["guru", "bendahara"],
  },
];

const filteredMenus = computed(() => {
  const userRole = user.value?.role?.name;
  return allMenus
    .filter((menu) => menu.roles.includes(userRole))
    .map((menu) => ({
      ...menu,
      badge: menu.label === "Notifikasi" ? notifikasiStore.unreadCount : 0,
    }));
});
</script>

<style scoped>
.router-link-active {
  background-color: #eff6ff !important;
  color: #1d4ed8 !important;
}

.router-link-active svg {
  color: #1d4ed8 !important;
}
</style>
