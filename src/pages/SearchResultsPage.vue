<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Search Results</h1>
    <p class="text-gray-600 mb-6">Showing results for "{{ searchQuery }}"</p>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <h3 class="text-xl font-medium text-gray-700 mb-2">No products found</h3>
      <p class="text-gray-500 mb-4">We couldn't find any products matching your search.</p>
      <router-link
        to="/"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Back to Home
      </router-link>
    </div>

    <!-- Product list -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <router-link :to="`/product/${product.id}`">
          <img
            :src="
              product.image_url ||
              `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`
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
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';

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
      if (!searchQuery.value) {
        products.value = [];
        loading.value = false;
        return;
      }

      // Simulate API call with sample data
      setTimeout(() => {
        products.value = [
          {
            id: 1,
            name: 'Smartphone X',
            price: 799.99,
            rating: 4.5,
            review_count: 120,
            image_url: '/placeholder.svg?height=200&width=300&query=smartphone',
          },
          {
            id: 2,
            name: 'Laptop Pro',
            price: 1299.99,
            rating: 4.8,
            review_count: 85,
            image_url: '/placeholder.svg?height=200&width=300&query=laptop',
          },
          {
            id: 3,
            name: 'Wireless Headphones',
            price: 199.99,
            rating: 4.2,
            review_count: 230,
            image_url: '/placeholder.svg?height=200&width=300&query=headphones',
          },
          {
            id: 4,
            name: '4K Smart TV',
            price: 899.99,
            rating: 4.6,
            review_count: 75,
            image_url: '/placeholder.svg?height=200&width=300&query=smart%20tv',
          },
        ];
        loading.value = false;
      }, 1000);
    } catch (error) {
      console.error('Error fetching search results:', error);
      products.value = [];
      loading.value = false;
    }
  };

  const addToCart = (product) => {
    emit('add-to-cart', product, 1);
    alert(`${product.name} added to cart!`);
  };

  // Lifecycle hooks
  onMounted(() => {
    searchQuery.value = route.query.q || '';
    fetchSearchResults();
  });

  watch(
    () => route.query.q,
    (newQuery) => {
      searchQuery.value = newQuery || '';
      fetchSearchResults();
    }
  );
</script>
