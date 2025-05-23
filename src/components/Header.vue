<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center">
            <span class="text-2xl font-bold text-emerald-600">ElectroMart</span>
          </router-link>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div :class="['md:flex md:items-center', mobileMenuOpen ? 'block' : 'hidden']">
          <nav class="flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 md:mx-1"
            >
              Home
            </router-link>
            <router-link
              to="/products"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 md:mx-1"
            >
              Products
            </router-link>
          </nav>

          <div class="flex items-center mt-4 md:mt-0 md:ml-6">
            <router-link to="/cart" class="ml-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-700 hover:text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                v-if="cartItemCount > 0"
                class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartItemCount }}
              </span>
            </router-link>
              <router-link to="/user" class="ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-gray-700 hover:text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A9 9 0 0112 15c2.133 0 4.098.747 5.879 1.996M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref } from 'vue';
  import { computed } from 'vue';

  const mobileMenuOpen = ref(false);
  const cart = ref([]);

  // Computed
  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });
</script>
