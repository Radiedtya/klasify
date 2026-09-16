import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard-siswa',
      name: 'dashboard-siswa',
      component: () => import('../views/dashboard/DashboardSiswa.vue'), 
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/dashboard',
      name: 'dashboard-guru',
      component: () => import('../views/dashboard/DashboardGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/kelas',
      name: 'guru-kelas',
      component: () => import('../views/guru/DataKelasGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/siswa',
      name: 'guru-siswa',
      component: () => import('../views/guru/DataSiswaGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/iuran',
      name: 'guru-iuran',
      component: () => import('../views/guru/DataIuranGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/transaksi',
      name: 'guru-transaksi',
      component: () => import('../views/guru/TransaksiGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/pengeluaran',
      name: 'guru-pengeluaran',
      component: () => import('../views/guru/PengeluaranGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/keterlambatan',
      name: 'guru-keterlambatan',
      component: () => import('../views/guru/KeterlambatanGuruView.vue'),
      meta: { requiresAuth: true }
    },
     {
      path: '/guru/laporan',
      name: 'guru-laporan',
      component: () => import('../views/guru/LaporanGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/notifikasi',
      name: 'guru-notifikasi',
      component: () => import('../views/guru/NotifikasiGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/pengaturan',
      name: 'guru-pengaturan',
      component: () => import('../views/guru/PengaturanGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/guru/profile',
      name: 'guru-profile',
      component: () => import('../views/guru/ProfileGuruView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/siswa',
      name: 'siswa',
      component: () => import('../views/siswa/SiswaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/iuran',
      name: 'iuran',
      component: () => import('../views/iuran/IuranView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kelas',
      name: 'kelas',
      component: () => import('../views/kelas/KelasView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router