<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2">Search Results</h1>
    <p class="text-gray-600 mb-8">Showing results for "{{ searchQuery }}"</p>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No products found</h3>
      <p class="text-gray-500 mb-4">We couldn't find any products matching your search.</p>
      <router-link
        to="/"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Back to Home
      </router-link>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <router-link :to="`/product/${product.id}`">
            <img
              :src="
                product.image_url ||
                '/placeholder.svg?height=200&width=300&query=electronic%20product'
              "
              :alt="product.name"
              class="w-full h-48 object-cover"
            />
          </router-link>
          <div class="p-4">
            <router-link :to="`/product/${product.id}`" class="block">
              <h3 class="font-medium text-lg mb-2 text-gray-800 hover:text-emerald-600">
                {{ product.name }}
              </h3>
            </router-link>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in Math.floor(product.rating || 4)"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <svg
                  v-for="i in 5 - Math.floor(product.rating || 4)"
                  :key="i + 5"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <span class="text-gray-500 text-sm ml-1">
                ({{ product.review_count || Math.floor(Math.random() * 100) + 5 }})
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">${{ product.price.toFixed(2) }}</span>
              <button
                @click.prevent="addToCart(product)"
                class="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import { useRoute } from 'vue-router';

  const API_BASE_URL = 'http://idatg2204backend-production.up.railway.app/api';
  const route = useRoute();
  const emit = defineEmits(['add-to-cart']);

  // State
  const searchQuery = ref('');
  const products = ref([]);
  const loading = ref(true);

  // Methods
  const fetchSearchResults = async () => {
    loading.value = true;

    try {
      searchQuery.value = route.query.q || '';

      if (!searchQuery.value) {
        products.value = [];
        loading.value = false;
        return;
      }

      // In a real app, you would send the search query to the backend
      // For now, we'll just fetch some products and filter them client-side
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      // Filter products by search query
      products.value = data.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      );
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = (product) => {
    emit('add-to-cart', product, 1);
  };

  // Lifecycle hooks
  onMounted(() => {
    searchQuery.value = route.query.q || '';
    fetchSearchResults();
  });
</script>
