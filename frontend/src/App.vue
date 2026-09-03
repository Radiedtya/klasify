<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from "./stores/auth";
import { useNotifikasiStore } from "./stores/notifikasi";

const authStore = useAuthStore();
const notifikasiStore = useNotifikasiStore();

// Cek token di localStorage
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (token && user) {
  authStore.setAuth(user, token);
  notifikasiStore.fetchNotifikasi();
}
</script>
