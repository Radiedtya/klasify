import api from "./axios";

export const notifikasiApi = {
  // Get all notifikasi
  getAll: () => api.get("/notifikasi"),

  // Get unread notifikasi
  getUnread: () => api.get("/notifikasi/unread"),

  // Mark as read
  markAsRead: (id) => api.put(`/notifikasi/${id}/read`),

  // Mark all as read
  markAllAsRead: () => api.put("/notifikasi/read-all"),

  // Send manual notification
  sendManual: (data) => api.post("/notifikasi/send", data),

  // Send to class
  sendToKelas: (data) => api.post("/notifikasi/send-kelas", data),

  // Delete notification
  delete: (id) => api.delete(`/notifikasi/${id}`),

  // Delete all read
  deleteAllRead: () => api.delete("/notifikasi/read-all"),
};
