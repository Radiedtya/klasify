import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = computed(() => !!token.value);

  function setAuth(userData, tokenData) {
    user.value = userData;
    token.value = tokenData;
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async function login(email, password) {
    try {
      const response = await api.post("/login", { email, password });
      if (response.data.success) {
        const { user: userData, token: tokenData } = response.data.data;
        setAuth(userData, tokenData);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  }

  async function register(data) {
    try {
      const response = await api.post("/register", data);
      if (response.data.success) {
        const { user: userData, token: tokenData } = response.data.data;
        setAuth(userData, tokenData);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registrasi gagal",
      };
    }
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      // Ignore
    } finally {
      clearAuth();
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    clearAuth,
    login,
    register,
    logout,
  };
});
