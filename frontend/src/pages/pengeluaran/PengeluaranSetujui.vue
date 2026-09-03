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
        <h1 class="text-2xl font-bold text-gray-800">Setujui Pengeluaran</h1>
        <p class="text-sm text-gray-500">
          Setujui atau tolak pengeluaran yang diajukan
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Detail -->
    <template v-else-if="pengeluaran">
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <p class="text-sm text-gray-500">Judul</p>
            <p class="font-medium text-lg">{{ pengeluaran.judul }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Kelas</p>
            <p class="font-medium">{{ pengeluaran.kelas?.nama }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jumlah</p>
            <p class="font-medium text-lg text-blue-600">
              {{ formatRupiah(pengeluaran.jumlah) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Pengaju</p>
            <p class="font-medium">{{ pengeluaran.created_by?.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tanggal</p>
            <p class="font-medium">{{ formatTanggal(pengeluaran.tanggal) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Kategori</p>
            <p class="font-medium">{{ pengeluaran.kategori || "-" }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-500">Deskripsi</p>
            <p class="font-medium">{{ pengeluaran.deskripsi || "-" }}</p>
          </div>
          <div v-if="pengeluaran.bukti_foto" class="md:col-span-2">
            <p class="text-sm text-gray-500">Bukti Foto</p>
            <p class="font-medium">{{ pengeluaran.bukti_foto }}</p>
          </div>
        </div>
      </BaseCard>

      <!-- Form Setujui -->
      <BaseCard>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Keputusan <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="approved"
                  v-model="form.status"
                  class="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm text-green-600">Setujui</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="rejected"
                  v-model="form.status"
                  class="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span class="text-sm text-red-600">Tolak</span>
              </label>
            </div>
            <p v-if="errors.status" class="mt-1 text-sm text-red-500">
              {{ errors.status }}
            </p>
          </div>

          <BaseInput
            v-model="form.catatan"
            label="Catatan"
            placeholder="Tambahkan catatan (opsional)"
            :error="errors.catatan"
          />

          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <BaseButton
              type="submit"
              :variant="form.status === 'approved' ? 'success' : 'danger'"
              size="lg"
              :loading="loading"
            >
              {{ form.status === "approved" ? "Setujui" : "Tolak" }}
            </BaseButton>
            <router-link to="/pengeluaran">
              <BaseButton variant="secondary" size="lg">Batal</BaseButton>
            </router-link>
          </div>
        </form>
      </BaseCard>
    </template>

    <!-- Tidak ada -->
    <div v-else class="text-center py-12">
      <p class="text-gray-400">Tidak ada pengeluaran pending</p>
      <router-link to="/pengeluaran" class="text-blue-600 hover:underline"
        >Kembali ke daftar pengeluaran</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pengeluaranApi } from "@/api/pengeluaran";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import { formatRupiah } from "@/utils/formatRupiah";
import { formatTanggal } from "@/utils/formatTanggal";
import { toast } from "vue3-toastify";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const pengeluaran = ref(null);

const form = reactive({
  status: "approved",
  catatan: "",
});

const errors = reactive({});

const fetchData = async () => {
  loading.value = true;
  try {
    let id = route.query.id;

    if (!id) {
      const res = await pengeluaranApi.getPending();
      if (res.data.success && res.data.data.length > 0) {
        id = res.data.data[0].id;
      } else {
        loading.value = false;
        return;
      }
    }

    const res = await pengeluaranApi.getById(id);
    if (res.data.success) {
      pengeluaran.value = res.data.data;
    }
  } catch (error) {
    toast.error("Gagal mengambil data pengeluaran");
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!form.status) errors.status = "Keputusan wajib dipilih";

  if (Object.keys(errors).length > 0) return;

  loading.value = true;

  try {
    const res = await pengeluaranApi.setujui(pengeluaran.value.id, {
      status: form.status,
      catatan: form.catatan,
    });

    if (res.data.success) {
      toast.success(res.data.message || "Pengeluaran berhasil diproses");
      router.push("/pengeluaran");
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    } else {
      toast.error(
        error.response?.data?.message || "Gagal memproses pengeluaran",
      );
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
