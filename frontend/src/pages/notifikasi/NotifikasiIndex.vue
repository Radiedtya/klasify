<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Notifikasi</h1>
        <p class="text-sm text-gray-500">Semua notifikasi Anda</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          <CheckCircleIcon class="w-5 h-5" />
          Tandai Semua Dibaca
        </button>
        <button
          v-if="hasReadNotifications"
          @click="deleteAllRead"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
        >
          <TrashIcon class="w-5 h-5" />
          Hapus Semua Dibaca
        </button>
        <button
          v-if="canSend"
          @click="showSendModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
          Kirim Notifikasi
        </button>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2">
      <button
        @click="filterType = 'all'"
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
        :class="
          filterType === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        "
      >
        Semua ({{ totalNotifikasi }})
      </button>
      <button
        @click="filterType = 'unread'"
        class="px-4 py-2 rounded-lg text-sm font-medium transition"
        :class="
          filterType === 'unread'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        "
      >
        Belum Dibaca ({{ unreadCount }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- List -->
    <div v-else class="space-y-2">
      <div
        v-for="item in filteredNotifikasi"
        :key="item.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer"
        :class="{ 'border-l-4 border-l-blue-500 bg-blue-50/30': !item.is_read }"
        @click="handleClick(item)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full shrink-0"
                :class="{
                  'bg-blue-500': item.tipe === 'info',
                  'bg-yellow-500': item.tipe === 'warning',
                  'bg-red-500': item.tipe === 'danger',
                  'bg-green-500': item.tipe === 'success',
                }"
              />
              <p
                class="font-medium text-gray-800"
                :class="{ 'text-gray-500': item.is_read }"
              >
                {{ item.judul }}
              </p>
              <span
                v-if="!item.is_read"
                class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                Baru
              </span>
            </div>
            <p
              class="text-sm text-gray-600 mt-1"
              :class="{ 'text-gray-400': item.is_read }"
            >
              {{ item.pesan }}
            </p>
            <p class="text-xs text-gray-400 mt-2">
              {{ formatTanggalWaktu(item.created_at) }}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="!item.is_read"
              @click.stop="markRead(item)"
              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Tandai sudah dibaca"
            >
              <CheckCircleIcon class="w-4 h-4" />
            </button>
            <button
              @click.stop="confirmDelete(item)"
              class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Hapus"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Kosong -->
      <div v-if="filteredNotifikasi.length === 0" class="text-center py-12">
        <p class="text-gray-400">Tidak ada notifikasi</p>
      </div>
    </div>

    <!-- Send Modal -->
    <div
      v-if="showSendModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showSendModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800">Kirim Notifikasi</h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSend" class="space-y-4">
            <!-- Tipe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipe <span class="text-red-500">*</span>
              </label>
              <select
                v-model="sendForm.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="manual">Manual (ke user tertentu)</option>
                <option value="kelas">Kelas (ke semua siswa di kelas)</option>
              </select>
            </div>

            <!-- User ID (manual) -->
            <div v-if="sendForm.type === 'manual'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pilih User <span class="text-red-500">*</span>
              </label>
              <select
                v-model="sendForm.user_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Pilih User</option>
                <optgroup label="Siswa">
                  <option
                    v-for="siswa in siswaList"
                    :key="siswa.id"
                    :value="siswa.user_id"
                  >
                    {{ siswa.user?.name }} ({{ siswa.nis }})
                  </option>
                </optgroup>
                <optgroup label="Guru">
                  <option
                    v-for="guru in guruList"
                    :key="guru.id"
                    :value="guru.id"
                  >
                    {{ guru.name }} (Guru)
                  </option>
                </optgroup>
              </select>
            </div>

            <!-- Kelas ID -->
            <div v-if="sendForm.type === 'kelas'">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pilih Kelas <span class="text-red-500">*</span>
              </label>
              <select
                v-model="sendForm.kelas_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Pilih Kelas</option>
                <option
                  v-for="kelas in kelasList"
                  :key="kelas.id"
                  :value="kelas.id"
                >
                  {{ kelas.nama }}
                </option>
              </select>
            </div>

            <!-- Judul -->
            <BaseInput
              v-model="sendForm.judul"
              label="Judul"
              placeholder="Masukkan judul notifikasi"
              required
              :error="errors.judul"
            />

            <!-- Pesan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pesan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="sendForm.pesan"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan isi pesan"
              />
              <p v-if="errors.pesan" class="mt-1 text-sm text-red-500">
                {{ errors.pesan }}
              </p>
            </div>

            <!-- Tipe Notifikasi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipe Notifikasi
              </label>
              <select
                v-model="sendForm.tipe"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="info">Info</option>
                <option value="warning">Peringatan</option>
                <option value="danger">Danger</option>
                <option value="success">Sukses</option>
              </select>
            </div>

            <!-- Link -->
            <BaseInput
              v-model="sendForm.link"
              label="Link (opsional)"
              placeholder="Contoh: /transaksi/saya"
            />

            <!-- Submit -->
            <div class="flex gap-3 pt-4 border-t border-gray-100">
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="loadingSend"
              >
                Kirim
              </BaseButton>
              <button
                type="button"
                @click="showSendModal = false"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { notifikasiApi } from "@/api/notifikasi";
import { siswaApi } from "@/api/siswa";
import { userApi } from "@/api/user";
import { kelasApi } from "@/api/kelas";
import {
  CheckCircleIcon,
  TrashIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import { formatTanggalWaktu } from "@/utils/formatTanggal";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const loadingSend = ref(false);
const notifikasiList = ref([]);
const siswaList = ref([]);
const guruList = ref([]);
const kelasList = ref([]);
const filterType = ref("all");
const showSendModal = ref(false);

const sendForm = reactive({
  type: "manual",
  user_id: "",
  kelas_id: "",
  judul: "",
  pesan: "",
  tipe: "info",
  link: "",
});

const errors = reactive({});

const totalNotifikasi = computed(() => notifikasiList.value.length);
const unreadCount = computed(
  () => notifikasiList.value.filter((n) => !n.is_read).length,
);
const hasReadNotifications = computed(() =>
  notifikasiList.value.some((n) => n.is_read),
);

const filteredNotifikasi = computed(() => {
  if (filterType.value === "unread") {
    return notifikasiList.value.filter((n) => !n.is_read);
  }
  return notifikasiList.value;
});

const canSend = computed(() =>
  ["guru", "bendahara"].includes(user?.role?.name),
);

const fetchData = async () => {
  loading.value = true;
  try {
    const [notifRes, siswaRes, guruRes, kelasRes] = await Promise.all([
      notifikasiApi.getAll(),
      siswaApi.getAll(),
      userApi.getByRole("guru"),
      kelasApi.getAll(),
    ]);

    if (notifRes.data.success) {
      notifikasiList.value = notifRes.data.data.notifikasi || [];
    }
    if (siswaRes.data.success) {
      siswaList.value = siswaRes.data.data;
    }
    if (guruRes.data.success) {
      guruList.value = guruRes.data.data;
    }
    if (kelasRes.data.success) {
      kelasList.value = kelasRes.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleClick = async (item) => {
  if (!item.is_read) {
    await markRead(item);
  }
  if (item.link) {
    // Navigate ke link
    window.location.href = item.link;
  }
};

const markRead = async (item) => {
  try {
    await notifikasiApi.markAsRead(item.id);
    item.is_read = true;
  } catch (error) {
    toast.error("Gagal menandai notifikasi");
  }
};

const markAllRead = async () => {
  try {
    await notifikasiApi.markAllAsRead();
    notifikasiList.value.forEach((n) => (n.is_read = true));
    toast.success("Semua notifikasi ditandai sudah dibaca");
  } catch (error) {
    toast.error("Gagal menandai semua notifikasi");
  }
};

const confirmDelete = async (item) => {
  const result = await Swal.fire({
    title: "Hapus Notifikasi?",
    text: `Apakah Anda yakin ingin menghapus notifikasi "${item.judul}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await notifikasiApi.delete(item.id);
      notifikasiList.value = notifikasiList.value.filter(
        (n) => n.id !== item.id,
      );
      toast.success("Notifikasi berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus notifikasi");
    }
  }
};

const deleteAllRead = async () => {
  const result = await Swal.fire({
    title: "Hapus Semua Notifikasi yang Sudah Dibaca?",
    text: "Tindakan ini tidak dapat dibatalkan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      await notifikasiApi.deleteAllRead();
      notifikasiList.value = notifikasiList.value.filter((n) => !n.is_read);
      toast.success("Notifikasi yang sudah dibaca berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus notifikasi");
    }
  }
};

const handleSend = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  if (sendForm.type === "manual" && !sendForm.user_id) {
    errors.user_id = "User wajib dipilih";
  }
  if (sendForm.type === "kelas" && !sendForm.kelas_id) {
    errors.kelas_id = "Kelas wajib dipilih";
  }
  if (!sendForm.judul) errors.judul = "Judul wajib diisi";
  if (!sendForm.pesan) errors.pesan = "Pesan wajib diisi";

  if (Object.keys(errors).length > 0) return;

  loadingSend.value = true;

  try {
    let res;
    if (sendForm.type === "kelas") {
      res = await notifikasiApi.sendToKelas({
        kelas_id: sendForm.kelas_id,
        judul: sendForm.judul,
        pesan: sendForm.pesan,
        tipe: sendForm.tipe,
        link: sendForm.link,
      });
    } else {
      res = await notifikasiApi.sendManual({
        user_id: sendForm.user_id,
        judul: sendForm.judul,
        pesan: sendForm.pesan,
        tipe: sendForm.tipe,
        link: sendForm.link,
      });
    }

    if (res.data.success) {
      toast.success(res.data.message || "Notifikasi berhasil dikirim");
      showSendModal.value = false;
      // Reset form
      sendForm.user_id = "";
      sendForm.kelas_id = "";
      sendForm.judul = "";
      sendForm.pesan = "";
      sendForm.tipe = "info";
      sendForm.link = "";
      await fetchData();
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(error.response?.data?.message || "Gagal mengirim notifikasi");
    }
  } finally {
    loadingSend.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
