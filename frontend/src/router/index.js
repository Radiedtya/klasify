import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const routes = [
  // Auth routes (tanpa layout)
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/auth/Login.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/auth/Register.vue"),
    meta: { requiresGuest: true },
  },

  // Dashboard routes (dengan layout)
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        // Redirect berdasarkan role
        redirect: (to) => {
          const user = JSON.parse(localStorage.getItem("user") || "null");
          if (user?.role?.name === "guru") return "/dashboard/guru";
          if (user?.role?.name === "bendahara") return "/dashboard/bendahara";
          if (user?.role?.name === "siswa") return "/dashboard/siswa";
          return "/login";
        },
      },
      {
        path: "dashboard/guru",
        name: "DashboardGuru",
        component: () => import("../pages/dashboard/DashboardGuru.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: "dashboard/bendahara",
        name: "DashboardBendahara",
        component: () => import("../pages/dashboard/DashboardBendahara.vue"),
        meta: { roles: ["bendahara"] },
      },
      {
        path: "dashboard/siswa",
        name: "DashboardSiswa",
        component: () => import("../pages/dashboard/DashboardSiswa.vue"),
        meta: { roles: ["siswa"] },
      },
    ],
  },

  // ============ ROUTES SISWA ============
  {
    path: "/siswa",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara"] },
    children: [
      {
        path: "",
        name: "SiswaIndex",
        component: () => import("../pages/siswa/SiswaIndex.vue"),
      },
      {
        path: "tambah",
        name: "SiswaTambah",
        component: () => import("../pages/siswa/SiswaForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id/edit",
        name: "SiswaEdit",
        component: () => import("../pages/siswa/SiswaForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id",
        name: "SiswaDetail",
        component: () => import("../pages/siswa/SiswaDetail.vue"),
      },
    ],
  },

  // ============ ROUTES KELAS ============
  {
    path: "/kelas",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara"] },
    children: [
      {
        path: "",
        name: "KelasIndex",
        component: () => import("../pages/kelas/KelasIndex.vue"),
      },
      {
        path: "tambah",
        name: "KelasTambah",
        component: () => import("../pages/kelas/KelasForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id/edit",
        name: "KelasEdit",
        component: () => import("../pages/kelas/KelasForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id/siswa",
        name: "KelasSiswa",
        component: () => import("../pages/kelas/KelasSiswa.vue"),
      },
    ],
  },

  // ============ ROUTES IURAN ============
  {
    path: "/iuran",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara", "siswa"] },
    children: [
      {
        path: "",
        name: "IuranIndex",
        component: () => import("../pages/iuran/IuranIndex.vue"),
      },
      {
        path: "tambah",
        name: "IuranTambah",
        component: () => import("../pages/iuran/IuranForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id/edit",
        name: "IuranEdit",
        component: () => import("../pages/iuran/IuranForm.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: ":id/siswa",
        name: "IuranSiswa",
        component: () => import("../pages/iuran/IuranSiswa.vue"),
      },
    ],
  },

  // ============ ROUTES TRANSAKSI ============
  {
    path: "/transaksi",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara", "siswa"] },
    children: [
      {
        path: "",
        name: "TransaksiIndex",
        component: () => import("../pages/transaksi/TransaksiIndex.vue"),
      },
      {
        path: "bayar",
        name: "TransaksiBayar",
        component: () => import("../pages/transaksi/TransaksiBayar.vue"),
        meta: { roles: ["siswa", "bendahara"] },
      },
      {
        path: "konfirmasi",
        name: "TransaksiKonfirmasi",
        component: () => import("../pages/transaksi/TransaksiKonfirmasi.vue"),
        meta: { roles: ["guru", "bendahara"] },
      },
    ],
  },

  // ============ ROUTES PENGELUARAN ============
  {
    path: "/pengeluaran",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara", "siswa"] },
    children: [
      {
        path: "",
        name: "PengeluaranIndex",
        component: () => import("../pages/pengeluaran/PengeluaranIndex.vue"),
      },
      {
        path: "ajukan",
        name: "PengeluaranAjukan",
        component: () => import("../pages/pengeluaran/PengeluaranForm.vue"),
        meta: { roles: ["bendahara"] },
      },
      {
        path: ":id/edit",
        name: "PengeluaranEdit",
        component: () => import("../pages/pengeluaran/PengeluaranForm.vue"),
        meta: { roles: ["bendahara"] },
      },
      {
        path: "setujui",
        name: "PengeluaranSetujui",
        component: () => import("../pages/pengeluaran/PengeluaranSetujui.vue"),
        meta: { roles: ["guru"] },
      },
    ],
  },

  // ============ ROUTES KETERLAMBATAN ============
  {
    path: "/keterlambatan",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara"] },
    children: [
      {
        path: "",
        name: "KeterlambatanIndex",
        component: () =>
          import("../pages/keterlambatan/KeterlambatanIndex.vue"),
      },
    ],
  },

  // ============ ROUTES NOTIFIKASI ============
  {
    path: "/notifikasi",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara", "siswa"] },
    children: [
      {
        path: "",
        name: "NotifikasiIndex",
        component: () => import("../pages/notifikasi/NotifikasiIndex.vue"),
      },
    ],
  },

  // ============ ROUTES LAPORAN ============
  {
    path: "/laporan",
    component: DefaultLayout,
    meta: { requiresAuth: true, roles: ["guru", "bendahara"] },
    children: [
      {
        path: "",
        name: "LaporanIndex",
        component: () => import("../pages/laporan/LaporanIndex.vue"),
      },
    ],
  },

  // 404 Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/error/NotFound.vue"),
  },
];

// Navigation Guard
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Set auth state
  if (token && user) {
    authStore.setAuth(user, token);
  }

  // Jika route butuh guest (login/register) dan user sudah login
  if (to.meta.requiresGuest && token) {
    if (user?.role?.name === "guru") {
      return next("/dashboard/guru");
    } else if (user?.role?.name === "bendahara") {
      return next("/dashboard/bendahara");
    } else if (user?.role?.name === "siswa") {
      return next("/dashboard/siswa");
    }
    return next("/");
  }

  // Jika route butuh auth dan user belum login
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // Jika route butuh role tertentu
  if (to.meta.requiresAuth && to.meta.roles) {
    // Jika user belum login, redirect ke login
    if (!user) {
      return next("/login");
    }

    // Cek apakah user punya role yang diizinkan
    if (!to.meta.roles.includes(user.role?.name)) {
      // Redirect ke dashboard sesuai role
      if (user?.role?.name === "guru") {
        return next("/dashboard/guru");
      } else if (user?.role?.name === "bendahara") {
        return next("/dashboard/bendahara");
      } else if (user?.role?.name === "siswa") {
        return next("/dashboard/siswa");
      }
      return next("/login");
    }
  }

  next();
});

export default router;
