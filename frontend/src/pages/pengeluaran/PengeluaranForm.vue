<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <router-link
        to="/pengeluaran"
        class="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ArrowLeftIcon class="w-5 h-5 text-gray-500" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          {{ isEdit ? "Edit Pengeluaran" : "Ajukan Pengeluaran" }}
        </h1>
        <p class="text-sm text-gray-500">
          {{
            isEdit
              ? "Perbarui data pengeluaran"
              : "Ajukan pengeluaran kas kelas"
          }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Kelas -->
        <div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Kelas <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.kelas_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              :class="{ 'border-red-500 focus:ring-red-500': errors.kelas_id }"
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
            <p v-if="errors.kelas_id" class="mt-1 text-sm text-red-500">
              {{ errors.kelas_id }}
            </p>
          </div>
        </div>

        <!-- Judul -->
        <BaseInput
          v-model="form.judul"
          label="Judul"
          placeholder="Masukkan judul pengeluaran"
          required
          :error="errors.judul"
        />

        <!-- Deskripsi -->
        <BaseInput
          v-model="form.deskripsi"
          label="Deskripsi"
          placeholder="Deskripsi pengeluaran"
          :error="errors.deskripsi"
        />

        <!-- Jumlah -->
        <BaseInput
          v-model="form.jumlah"
          label="Jumlah"
          type="number"
          placeholder="Masukkan nominal"
          required
          :error="errors.jumlah"
        />

        <!-- Tanggal -->
        <BaseInput
          v-model="form.tanggal"
          label="Tanggal"
          type="date"
          required
          :error="errors.tanggal"
        />

        <!-- Kategori -->
        <div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              v-model="form.kategori"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="">Pilih Kategori</option>
              <option v-for="kat in kategoriList" :key="kat" :value="kat">
                {{ kat }}
              </option>
            </select>
          </div>
        </div>

        <!-- Bukti Foto -->
        <BaseInput
          v-model="form.bukti_foto"
          label="Bukti Foto"
          placeholder="Nama file bukti (opsional)"
          :error="errors.bukti_foto"
        />

        <!-- Submit -->
        <div class="flex gap-3 pt-4 border-t border-gray-100">
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
          >
            {{ isEdit ? "Update" : "Ajukan" }}
          </BaseButton>
          <router-link to="/pengeluaran">
            <BaseButton variant="secondary" size="lg">Batal</BaseButton>
          </router-link>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pengeluaranApi } from "../../api/pengeluaran";
import { kelasApi } from "../../api/kelas";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "../../components/common/BaseCard.vue";
import BaseInput from "../../components/common/BaseInput.vue";
import BaseButton from "../../components/common/BaseButton.vue";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const kelasList = ref([]);

const kategoriList = [
  "Alat Tulis",
  "Kegiatan",
  "Snack",
  "Dekorasi",
  "Transportasi",
  "Lainnya",
];

const form = reactive({
  kelas_id: "",
  judul: "",
  deskripsi: "",
  jumlah: "",
  tanggal: new Date().toISOString().split("T")[0],
  kategori: "",
  bukti_foto: "",
});

const errors = reactive({});

const fetchKelas = async () => {
  try {
    const res = await kelasApi.getAll();
    if (res.data.success) {
      kelasList.value = res.data.data;
    }
  } catch (error) {
    console.error("Gagal fetch kelas:", error);
  }
};

const fetchPengeluaran = async () => {
  try {
    const res = await pengeluaranApi.getById(route.params.id);
    if (res.data.success) {
      const data = res.data.data;
      form.kelas_id = data.kelas_id || "";
      form.judul = data.judul || "";
      form.deskripsi = data.deskripsi || "";
      form.jumlah = data.jumlah || "";
      form.tanggal = data.tanggal || "";
      form.kategori = data.kategori || "";
      form.bukti_foto = data.bukti_foto || "";
    }
  } catch (error) {
    toast.error("Gagal mengambil data pengeluaran");
    router.push("/pengeluaran");
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Validasi
  if (!form.kelas_id) errors.kelas_id = "Kelas wajib dipilih";
  if (!form.judul) errors.judul = "Judul wajib diisi";
  if (!form.jumlah) errors.jumlah = "Jumlah wajib diisi";
  if (!form.tanggal) errors.tanggal = "Tanggal wajib diisi";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const payload = { ...form };
    if (!isEdit.value) {
      const res = await pengeluaranApi.create(payload);
      if (res.data.success) {
        toast.success(
          res.data.message ||
            "Pengeluaran berhasil diajukan! Menunggu persetujuan guru.",
        );
        router.push("/pengeluaran");
      }
    } else {
      const res = await pengeluaranApi.update(route.params.id, payload);
      if (res.data.success) {
        toast.success("Pengeluaran berhasil diperbarui");
        router.push("/pengeluaran");
      }
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKelas();
  if (isEdit.value) {
    fetchPengeluaran();
  }
});
</script>
