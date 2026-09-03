<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead v-if="columns.length > 0">
        <tr class="border-b border-gray-200 bg-gray-50">
          <th
            v-for="(col, index) in columns"
            :key="index"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="col.align ? `text-${col.align}` : ''"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0" class="border-b border-gray-100">
          <td
            :colspan="columns.length"
            class="px-4 py-8 text-center text-gray-400 text-sm"
          >
            {{ emptyText }}
          </td>
        </tr>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="border-b border-gray-100 hover:bg-gray-50 transition"
        >
          <td
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            class="px-4 py-3 text-gray-700"
            :class="col.align ? `text-${col.align}` : ''"
          >
            <slot :name="`column-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: "Tidak ada data",
  },
});
</script>
