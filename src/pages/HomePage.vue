<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to ElectroMart</h1>
            <p class="text-xl mb-6">
              Your one-stop destination for premium electronics and gadgets.
            </p>
            <div class="flex space-x-4">
              <router-link
                to="/products"
                class="bg-white text-emerald-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </router-link>
              <a
                href="#featured"
                class="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-emerald-600 transition-colors"
              >
                View Deals
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Shop by Category</h2>

        <div v-if="loadingCategories" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>

        <div v-else class="grid mx-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <router-link
            v-for="category in categories"
            :key="category.CategoryID"
            :to="`/category/${category.CategoryID}`"
            class="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <h3 class="font-medium text-gray-800">{{ category.Name }}</h3>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section id="featured" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Featured Products</h2>

        <div v-if="loadingProducts" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>

        <div v-else-if="featuredProducts.length === 0" class="text-center py-8">
          <p class="text-gray-500">No featured products available at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.ProductID"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/product/${product.ProductID}`">
              <img
                :src="product.ImageURL || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.Name)}`"
                :alt="product.Name"
                class="w-full h-48 object-cover"
              />
            </router-link>
            <div class="p-4">
              <router-link :to="`/product/${product.ProductID}`" class="block">
                <h3 class="font-medium text-lg mb-2 text-gray-800 hover:text-emerald-600">
                  {{ product.Name }}
                </h3>
              </router-link>
              <div class="flex justify-between items-center">
                <span class="font-bold text-lg">${{ formatPrice(product.Price) }}</span>
                <button
                  @click.prevent="handleAddToCart(product)"
                  class="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
          <router-link
            to="/products"
            class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- Deals Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="bg-gray-800 rounded-xl overflow-hidden">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Special Deals</h2>
              <p class="text-gray-300 mb-6">
                Get up to 40% off on selected smartphones and accessories. Limited time offer!
              </p>
              <router-link
                to="/products"
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors self-start"
              >
                Shop Deals
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCategories, getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart';

const categories = ref([]);
const featuredProducts = ref([]);

const loadingCategories = ref(true);
const loadingProducts = ref(true);

const { addItem, loadCart } = useCart();

// Load data
const fetchCategories = async () => {
  try {
    loadingCategories.value = true;
    categories.value = await getCategories();
  } catch (e) {
    console.error('Categories fetch failed:', e);
  } finally {
    loadingCategories.value = false;
  }
};

const fetchFeaturedProducts = async () => {
  try {
    loadingProducts.value = true;
    featuredProducts.value = await getProducts({ limit: 8 });
  } catch (e) {
    console.error('Products fetch failed:', e);
  } finally {
    loadingProducts.value = false;
  }
};

const handleAddToCart = (product) => {
  addItem(product);
  alert(`${product.Name} added to cart!`);
};

onMounted(() => {
  fetchCategories();
  fetchFeaturedProducts();
  loadCart();
});
</script>

