<template>
  <!-- Breadcrumb Navigation -->
  <nav class="flex mb-6 text-sm" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link to="/" class="text-gray-600 hover:text-emerald-500">Home</router-link>
      </li>
      <li aria-current="page">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="ml-1 text-gray-500 md:ml-2">{{ product.Name }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>
<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
</script>
