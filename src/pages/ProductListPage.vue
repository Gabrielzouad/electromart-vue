<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Sidebar Filters -->
      <aside class="lg:col-span-1 space-y-6">
        <!-- Categories -->
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold mb-3">Categories</h2>
          <ul class="space-y-2">
            <li>
              <button
                class="text-left w-full"
                :class="{ 'text-emerald-600 font-semibold': !selectedCategory }"
                @click="selectCategory(null)"
              >
                All Categories
              </button>
            </li>
            <li v-for="category in categories" :key="category.CategoryID">
              <button
                class="text-left w-full"
                :class="{ 'text-emerald-600 font-semibold': selectedCategory === category.CategoryID }"
                @click="selectCategory(category.CategoryID)"
              >
                {{ category.Name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Brands -->
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold mb-3">Brands</h2>
          <ul class="space-y-2">
            <li v-for="brand in brands" :key="brand.BrandID">
              <button
                class="text-left w-full"
                :class="{ 'text-emerald-600 font-semibold': selectedBrands.includes(String(brand.BrandID)) }"
                @click="toggleBrand(String(brand.BrandID))"
              >
                {{ brand.Name }}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Products Section -->
      <section class="lg:col-span-4">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Products</h1>
            <select v-model="selectedSort" @change="fetchProducts" class="border px-3 py-2 rounded-md">
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="product in products"
            :key="product.ProductID"
            :to="`/product/${product.ProductID}`"
            class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              :src="product.ImageURL || `/placeholder.svg?query=${product.Name}`"
              :alt="product.Name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="font-medium text-gray-900 mb-1">{{ product.Name }}</h3>
              <p class="text-emerald-600 font-bold">${{ Number(product.Price).toFixed(2) }}</p>
            </div>
          </router-link>
        </div>

        <div v-if="products.length === 0" class="text-center mt-10 text-gray-500">
          No products found.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProducts, getBrands, getCategories } from '@/lib/api';

const route = useRoute();

const products = ref([]);
const brands = ref([]);
const categories = ref([]);

const selectedCategory = ref(null);
const selectedBrands = ref([]);
const selectedSort = ref('');

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  fetchProducts();
};

const toggleBrand = (brandId) => {
  const index = selectedBrands.value.indexOf(brandId);
  if (index > -1) {
    selectedBrands.value.splice(index, 1);
  } else {
    selectedBrands.value.push(brandId);
  }
  fetchProducts();
};

const fetchProducts = async () => {
  try {
    const params = {
      ...(selectedCategory.value && { categoryId: selectedCategory.value }),
      ...(selectedBrands.value.length && { brandId: selectedBrands.value.join(',') }),
      ...(selectedSort.value && { sort: selectedSort.value }),
    };
    products.value = await getProducts(params);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
};

onMounted(async () => {
  brands.value = await getBrands();
  categories.value = await getCategories();

  if (route.params.id) {
    selectedCategory.value = route.params.id;
  }

  fetchProducts();
});
</script>
