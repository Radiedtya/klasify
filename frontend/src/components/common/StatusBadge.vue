<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { getStatusColor, getStatusLabel } from "../../utils/statusColor";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  customLabel: {
    type: String,
    default: "",
  },
});

const label = computed(() => props.customLabel || getStatusLabel(props.status));
const color = computed(() => getStatusColor(props.status));

const badgeClass = computed(() => {
  const map = {
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return map[color.value] || map.gray;
});

const dotClass = computed(() => {
  const map = {
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    gray: "bg-gray-500",
  };
  return map[color.value] || map.gray;
});
</script>
