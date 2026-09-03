<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size]]"
    @click="$emit('click')"
  >
    <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span v-if="!loading || !hideTextOnLoading"><slot /></span>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "outline",
      ].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideTextOnLoading: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["click"]);

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500",
  success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
  outline:
    "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};
</script>
