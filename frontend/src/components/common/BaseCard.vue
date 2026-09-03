<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div
      v-if="title || subtitle || $slots.header"
      class="px-6 py-4 border-b border-gray-100"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-semibold text-gray-800">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
        </div>
        <slot name="header-action" />
      </div>
      <slot name="header" />
    </div>
    <div class="px-6 py-4" :class="paddingClass">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="px-6 py-3 border-t border-gray-100 bg-gray-50"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  padding: {
    type: String,
    default: "normal",
    validator: (value) => ["none", "normal", "large"].includes(value),
  },
});

const paddingClass = {
  none: "p-0",
  normal: "p-6",
  large: "p-8",
};
</script>
