<<<<<<< HEAD
import { defineStore } from "pinia";
import api from "@/api/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    // Ambil name dari objek role
    role: (state) => state.user?.role?.name || "guest",
  },
  actions: {
    // Tambahan buat App.vue
    setAuth(user, token) {
      this.user = user;
      this.token = token;
    },
    
    async login(credentials) {
      try {
        const response = await api.post("/login", credentials);

        // Perhatikan response.data.data di sini!
        this.token = response.data.data.token;
        this.user = response.data.data.user;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async fetchUser() {
      try {
        // Sesuaikan juga kalau endpoint /me ngembalikan struktur yang sama
        const response = await api.get("/me");
        this.user = response.data.data.user || response.data.data; // Antisipasi struktur
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push({ name: "login", query: { logout: 'true' } });
    },
  },
});
=======
// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.clear()
  }

  return { token, user, setAuth, logout }
})
>>>>>>> 9fb4ad93105aa6351df1f2b945780e4302a20efe
