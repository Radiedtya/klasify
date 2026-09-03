import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const useNotifikasiStore = defineStore("notifikasi", () => {
  const notifikasi = ref([]);
  const unreadCount = ref(0);

  async function fetchNotifikasi() {
    try {
      const response = await api.get("/notifikasi");
      if (response.data.success) {
        notifikasi.value = response.data.data.notifikasi;
        unreadCount.value = response.data.data.belum_dibaca;
      }
    } catch (error) {
      console.error("Gagal fetch notifikasi:", error);
    }
  }

  async function fetchUnread() {
    try {
      const response = await api.get("/notifikasi/unread");
      if (response.data.success) {
        unreadCount.value = response.data.data.total;
        return response.data.data.notifikasi;
      }
    } catch (error) {
      console.error("Gagal fetch unread:", error);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifikasi/${id}/read`);
      await fetchNotifikasi();
    } catch (error) {
      console.error("Gagal mark as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await api.put("/notifikasi/read-all");
      await fetchNotifikasi();
    } catch (error) {
      console.error("Gagal mark all as read:", error);
    }
  }

  async function deleteNotifikasi(id) {
    try {
      await api.delete(`/notifikasi/${id}`);
      await fetchNotifikasi();
    } catch (error) {
      console.error("Gagal delete notifikasi:", error);
    }
  }

  async function deleteAllRead() {
    try {
      await api.delete("/notifikasi/read-all");
      await fetchNotifikasi();
    } catch (error) {
      console.error("Gagal delete all read:", error);
    }
  }

  return {
    notifikasi,
    unreadCount,
    fetchNotifikasi,
    fetchUnread,
    markAsRead,
    markAllAsRead,
    deleteNotifikasi,
    deleteAllRead,
  };
});
