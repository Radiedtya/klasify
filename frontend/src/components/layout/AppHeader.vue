<template>
  <header
    class="bg-white border-b border-gray-200 h-16 flex items-center px-6 shrink-0"
  >
    <!-- Left: Toggle Sidebar + Breadcrumb -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
      >
        <Bars3Icon class="w-5 h-5" />
      </button>

      <!-- Breadcrumb -->
      <AppBreadcrumb />
    </div>

    <!-- Right: Notifications + Profile -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- Notifications -->
      <NotificationDropdown />

      <!-- Divider -->
      <div class="w-px h-8 bg-gray-200 mx-2" />

      <!-- Profile -->
      <ProfileDropdown />
    </div>
  </header>
</template>

<script setup>
import { Bars3Icon } from "@heroicons/vue/24/outline";
import AppBreadcrumb from "./AppBreadcrumb.vue";
import NotificationDropdown from "./NotificationDropdown.vue";
import ProfileDropdown from "./ProfileDropdown.vue";

defineEmits(["toggle-sidebar"]);
</script>
