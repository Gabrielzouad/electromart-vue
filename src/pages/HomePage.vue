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
          <div class="md:w-1/2">
            <img
              src="/placeholder.svg?height=400&width=600&query=modern%20electronics%20store%20display"
              alt="Electronics showcase"
              class="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Shop by Category</h2>

        <div v-if="loadingCategories" class="flex justify-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div v-else class="grid mx-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <router-link
            v-for="category in categories"
            :key="category.CategoryID"
            :to="`/category/${category.CategoryID}`"
            class="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <div
              class="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-emerald-100 rounded-full"
            >
              <img :src="getCategoryIcon(category.Name)" alt="" class="w-8 h-8" />
            </div>
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
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div v-else-if="featuredProducts.length === 0" class="text-center py-8">
          <p class="text-gray-500">No featured products available at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/product/${product.ProductID}`">
              <img
                :src="
                  product.ImageURL ||
                  `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.Name)}`
                "
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
                <span class="font-bold text-lg">${{ product.Price }}</span>
                <button
                  @click.prevent="handleAddToCart(product)"
                  class="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full"
                >
                  <!-- Add to cart icon -->
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
            <div class="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600&query=smartphone%20deals%20discount"
                alt="Special deals"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Popular Brands</h2>

        <div v-if="loadingBrands" class="flex justify-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div
            v-for="brand in brands"
            :key="brand.BrandID"
            class="bg-white rounded-lg p-4 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <img :src="getBrandLogo(brand.Name)" :alt="brand.Name" class="max-h-12" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted, defineEmits } from 'vue';
  import { getProducts, getCategories, getBrands, addToCart } from '../lib/api';

  // State
  const categories = ref([]);
  const featuredProducts = ref([]);
  const brands = ref([]);

  const loadingCategories = ref(true);
  const loadingProducts = ref(true);
  const loadingBrands = ref(true);

  // Define emit
  const emit = defineEmits(['add-to-cart']);

  // Methods
  const fetchCategories = async () => {
    try {
      loadingCategories.value = true;
      categories.value = await getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      loadingCategories.value = false;
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      loadingProducts.value = true;
      // In a real app, you would have a parameter for featured products
      // For now, we'll just get the first 8 products
      featuredProducts.value = await getProducts({ limit: 8 });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      loadingProducts.value = false;
    }
  };

  const fetchBrands = async () => {
    try {
      loadingBrands.value = true;
      brands.value = await getBrands();
      console.log(JSON.parse(JSON.stringify(brands.value)));
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      loadingBrands.value = false;
    }
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      Smartphones: '/placeholder.svg?height=50&width=50&query=smartphone%20icon',
      Laptops: '/placeholder.svg?height=50&width=50&query=laptop%20icon',
      Tablets: '/placeholder.svg?height=50&width=50&query=tablet%20icon',
      Cameras: '/placeholder.svg?height=50&width=50&query=camera%20icon',
      Audio: '/placeholder.svg?height=50&width=50&query=headphones%20icon',
      Accessories: '/placeholder.svg?height=50&width=50&query=accessories%20icon',
      TVs: '/placeholder.svg?height=50&width=50&query=tv%20icon',
      Gaming: '/placeholder.svg?height=50&width=50&query=gaming%20icon',
    };

    return icons[categoryName] || '/placeholder.svg?height=50&width=50&query=electronics%20icon';
  };

  const getBrandLogo = (brandName) => {
    return `/placeholder.svg?height=50&width=100&query=${encodeURIComponent(brandName)}%20logo`;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    emit('add-to-cart', product, 1);

    // Show a toast or notification
    alert(`${product.name} added to cart!`);
  };

  // Lifecycle hooks
  onMounted(() => {
    fetchCategories();
    fetchFeaturedProducts();
    fetchBrands();
  });
</script>
