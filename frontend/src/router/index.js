import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const routes = [
  // Home
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },

  // Auth
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

  // Protected Routes
  {
    path: "/dashboard",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: () => {
          const user = JSON.parse(localStorage.getItem("user") || "null");
          if (user?.role?.name === "guru") return "/dashboard/guru";
          if (user?.role?.name === "bendahara") return "/dashboard/bendahara";
          if (user?.role?.name === "siswa") return "/dashboard/siswa";
          return "/login";
        },
      },
      {
        path: "guru",
        name: "DashboardGuru",
        component: () => import("../pages/dashboard/DashboardGuru.vue"),
        meta: { roles: ["guru"] },
      },
      {
        path: "bendahara",
        name: "DashboardBendahara",
        component: () => import("../pages/dashboard/DashboardBendahara.vue"),
        meta: { roles: ["bendahara"] },
      },
      {
        path: "siswa",
        name: "DashboardSiswa",
        component: () => import("../pages/dashboard/DashboardSiswa.vue"),
        meta: { roles: ["siswa"] },
      },
    ],
  },

  // Siswa
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

  // Kelas
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

  // Iuran
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

  // Transaksi
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

  // Pengeluaran
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

  // Keterlambatan
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

  // Notifikasi
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

  // Laporan
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

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/error/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const authStore = useAuthStore();

  if (token && user) {
    authStore.setAuth(user, token);
  }

  if (to.meta?.requiresGuest && token) {
    if (user?.role?.name === "guru") return "/dashboard/guru";
    if (user?.role?.name === "bendahara") return "/dashboard/bendahara";
    if (user?.role?.name === "siswa") return "/dashboard/siswa";
    return "/dashboard";
  }

  if (to.meta?.requiresAuth && !token) {
    return "/login";
  }

  if (to.meta?.requiresAuth && to.meta?.roles) {
    if (!user) return "/login";
    if (!to.meta.roles.includes(user.role?.name)) {
      if (user?.role?.name === "guru") return "/dashboard/guru";
      if (user?.role?.name === "bendahara") return "/dashboard/bendahara";
      if (user?.role?.name === "siswa") return "/dashboard/siswa";
      return "/login";
    }
  }

  return true;
});

export default router;
