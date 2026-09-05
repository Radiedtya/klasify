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
    },
    {
      path: '/transaksi',
      name: 'transaksi',
      component: () => import('../views/transaksi/TransaksiView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pengeluaran',
      name: 'pengeluaran',
      component: () => import('../views/pengeluaran/PengeluaranView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router