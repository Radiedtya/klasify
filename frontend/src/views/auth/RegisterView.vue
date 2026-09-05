<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <div class="brand-logo">K</div>
        <h2>Daftar Akun Klasify</h2>
        <p>Buat akun baru untuk mulai kelola kas kelas</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            v-model="form.name" 
            placeholder="Masukkan nama lengkap" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="email@contoh.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="Minimal 6 karakter" 
            required 
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Daftar Sekarang</span>
          <span v-else>Memproses...</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Sudah punya akun? <router-link to="/login">Masuk di sini</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  loading.value = true
  
  try {
    // Siap disambungkan ke API Backend (Laravel/Django)
    // const response = await fetch('http://localhost:8000/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form)
    // })

    // Simulasi respons sukses
    setTimeout(() => {
      alert('Pendaftaran berhasil! Silakan login dengan akun barumu.')
      router.push('/login')
      loading.value = false
    }, 800)

  } catch (error) {
    alert('Gagal mendaftar, periksa koneksi backend.')
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: var(--bg);
  padding: 20px;
  box-sizing: border-box;
}

.auth-card {
  background: #ffffff;
  padding: 40px 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: var(--accent);
  color: #fff;
  font-weight: 800;
  font-size: 22px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.auth-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 6px;
}

.auth-header p {
  font-size: 13px;
  color: var(--text);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-h);
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.form-group input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 0.2rem var(--accent-bg);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: var(--accent);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--text);
}

.auth-footer a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>