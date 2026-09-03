<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Klasify</h2>
      <p>Masuk ke Akun Kas Kelas</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="email@contoh.com" required />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Masukkan password" required />
        </div>

        <button type="submit" class="btn-login">Masuk</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  localStorage.setItem('token', 'sample-token')
  router.push('/dashboard')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #eef2f5;
}

.login-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.login-card h2 {
  color: #0f172a;
  margin-bottom: 4px;
}

.login-card p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  
  /* UBAH DI SINI */
  color: #000000 !important; /* Membuat teks tulisan berwarna hitam pekat */
  
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* Biar teks placeholder (petunjuk) tetep samar/abu-abu */
.form-group input::placeholder {
  color: #94a3b8;
}

.btn-login {
  width: 100%;
  padding: 10px;
  background: #1d61f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
</style>