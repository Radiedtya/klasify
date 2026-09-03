<template>
  <nav class="text-sm text-gray-500 flex items-center gap-2 truncate">
    <span class="text-gray-400">/</span>
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <router-link
        v-if="item.path && index < breadcrumbs.length - 1"
        :to="item.path"
        class="hover:text-blue-600 transition"
      >
        {{ item.label }}
      </router-link>
      <span
        v-else-if="index === breadcrumbs.length - 1"
        class="text-gray-800 font-medium"
      >
        {{ item.label }}
      </span>
      <span v-else class="text-gray-400">/</span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  const items = [];

  let currentPath = "";
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);

    // Mapping label
    const labelMap = {
      dashboard: "Dashboard",
      siswa: "Siswa",
      kelas: "Kelas",
      iuran: "Iuran",
      transaksi: "Transaksi",
      pengeluaran: "Pengeluaran",
      keterlambatan: "Keterlambatan",
      notifikasi: "Notifikasi",
      laporan: "Laporan",
      tambah: "Tambah",
      edit: "Edit",
      detail: "Detail",
    };

    const finalLabel = labelMap[label] || label;

    items.push({
      label: finalLabel,
      path: index < paths.length - 1 ? currentPath : undefined,
    });
  });

  return items;
});
</script>
