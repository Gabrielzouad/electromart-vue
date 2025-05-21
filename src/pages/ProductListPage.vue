<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar Filters -->
      <div class="md:w-1/4 lg:w-1/5 mb-6 md:mb-0 md:pr-6">
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 class="font-bold text-lg mb-3">Categories</h3>
          <div v-if="loadingCategories" class="flex justify-center py-4">
            <div
              class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"
            ></div>
          </div>
          <ul v-else class="space-y-2">
            <li v-for="category in categories" :key="category.id">
              <router-link
                :to="`/category/${category.id}`"
                class="block py-1 px-2 rounded hover:bg-gray-100"
                :class="{
                  'bg-emerald-100 text-emerald-700': category.id === parseInt($route.params.id),
                }"
              >
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 class="font-bold text-lg mb-3">Brands</h3>
          <div v-if="loadingBrands" class="flex justify-center py-4">
            <div
              class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"
            ></div>
          </div>
          <div v-else class="space-y-2">
            <label v-for="brand in brands" :key="brand.id" class="flex items-center">
              <input
                type="checkbox"
                :value="brand.id"
                v-model="selectedBrands"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded"
              />
              <span class="ml-2">{{ brand.name }}</span>
            </label>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 class="font-bold text-lg mb-3">Price Range</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                v-model="priceRange.min"
                min="0"
                class="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                v-model="priceRange.max"
                min="0"
                class="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            @click="applyFilters"
            class="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="md:w-3/4 lg:w-4/5">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            {{ currentCategory ? currentCategory.name : 'All Products' }}
            <span class="text-gray-500 text-lg ml-2">({{ totalProducts }} products)</span>
          </h1>

          <div class="flex items-center">
            <label class="mr-2 text-gray-700">Sort by:</label>
            <select
              v-model="sortOption"
              @change="applyFilters"
              class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div
          v-else-if="products.length === 0"
          class="bg-white rounded-lg shadow-md p-8 text-center"
        >
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
          <p class="text-gray-500">Try adjusting your filters or browse other categories.</p>
        </div>

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
                <span class="font-bold text-lg">${{ product.price }}</span>
                <button
                  @click.prevent="handleAddToCart(product)"
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

        <!-- Pagination -->
        <div v-if="products.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex space-x-1">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 border rounded-md"
              :class="
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Previous
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              class="px-4 py-2 border rounded-md"
              :class="
                page === currentPage
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              {{ page }}
            </button>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border rounded-md"
              :class="
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted, defineEmits } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProducts, getCategories, getBrands, getCategoryById, addToCart } from '../lib/api';

  const route = useRoute();

  // State
  const categories = ref([]);
  const brands = ref([]);
  const products = ref([]);
  const currentCategory = ref(null);
  const loading = ref(true);
  const loadingCategories = ref(true);
  const loadingBrands = ref(true);
  const selectedBrands = ref([]);
  const priceRange = ref({ min: '', max: '' });
  const sortOption = ref('price-asc');
  const currentPage = ref(1);
  const itemsPerPage = 12;
  const totalProducts = ref(0);

  const emit = defineEmits(['add-to-cart']);

  // Computed properties
  const totalPages = computed(() => {
    return Math.ceil(totalProducts.value / itemsPerPage);
  });

  // Methods
  const fetchCategories = async () => {
    try {
      loadingCategories.value = true;
      const rawCategories = await getCategories();
      categories.value = rawCategories.map((cat) => ({
        id: cat.CategoryID,
        name: cat.Name,
      }));

      if (route.params.id) {
        await fetchCurrentCategory();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      categories.value = [];
    } finally {
      loadingCategories.value = false;
    }
  };

  const fetchCurrentCategory = async () => {
    try {
      if (route.params.id) {
        const categoryId = parseInt(route.params.id);
        currentCategory.value = await getCategoryById(categoryId);
      } else {
        currentCategory.value = null;
      }
    } catch (error) {
      console.error('Error fetching current category:', error);
      // Try to find it in the already loaded categories
      if (categories.value.length > 0) {
        currentCategory.value =
          categories.value.find((cat) => cat.id === parseInt(route.params.id)) || null;
      }
    }
  };

  const fetchBrands = async () => {
    try {
      loadingBrands.value = true;
      const rawBrands = await getBrands();
      brands.value = rawBrands.map((brand) => ({
        id: brand.BrandID,
        name: brand.Name,
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      brands.value = [];
    } finally {
      loadingBrands.value = false;
    }
  };

  const fetchProducts = async () => {
    loading.value = true;

    try {
      const params = {};

      const data = await getProducts(params);

      // Map API fields to frontend expectations
      const mappedProducts = data.map((item) => ({
        id: item.ProductID,
        brand_id: item.BrandID,
        category_id: item.CategoryID,
        name: item.Name,
        description: item.Description,
        price: parseFloat(item.Price),
        stock: item.Stock,
        image_url: item.ImageURL,
        rating: item.Rating || 4, // default rating if not provided
        review_count: item.ReviewCount || Math.floor(Math.random() * 100) + 5,
      }));

      products.value = mappedProducts;
      totalProducts.value = mappedProducts.length;
    } catch (error) {
      console.error('Error fetching products:', error);
      products.value = [];
      totalProducts.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const applyFilters = () => {
    currentPage.value = 1;
    fetchProducts();
  };

  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchProducts();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    emit('add-to-cart', product, 1);

    // Show a toast or notification
    alert(`${product.name} added to cart!`);
  };

  // Watchers
  watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        await fetchCurrentCategory();
        selectedBrands.value = [];
        priceRange.value = { min: '', max: '' };
        currentPage.value = 1;
        fetchProducts();
      }
    }
  );

  // Lifecycle hooks
  onMounted(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  });
</script>
