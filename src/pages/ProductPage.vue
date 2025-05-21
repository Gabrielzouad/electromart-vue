<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :product="product" />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-96">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Product Images Section -->
      <div class="lg:w-1/2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="relative pb-[100%]">
            <img
              :src="product.ImageURL"
              :alt="product.Name"
              class="absolute inset-0 w-full h-full object-contain p-4"
            />
          </div>
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="lg:w-1/2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Brand & Product Name -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <span class="text-sm text-emerald-600 font-medium">{{ brandName }}</span>
              <span
                v-if="product.IsNew"
                class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded"
              >
                New
              </span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">{{ product.Name }}</h1>
          </div>

          <!-- Rating -->
          <div class="flex items-center mb-4">
            <div class="flex items-center">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= (product.Rating || 4) ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
            </div>
            <span class="ml-2 text-sm text-gray-600">{{ product.ReviewCount || 42 }} reviews</span>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">${{ product.Price }}</span>
              <span v-if="product.OldPrice" class="ml-3 text-lg text-gray-500 line-through">
                ${{ product.OldPrice }}
              </span>
              <span
                v-if="product.OldPrice"
                class="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-sm font-medium rounded"
              >
                {{ Math.round((1 - product.Price / product.OldPrice) * 100) }}% OFF
              </span>
            </div>
            <p v-if="product.Price >= 50" class="text-sm text-emerald-600 mt-1">Free shipping</p>
          </div>

          <!-- Stock Status -->
          <div class="mb-6">
            <div v-if="product.Stock > 10" class="flex items-center text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>In Stock</span>
            </div>
            <div v-else-if="product.Stock > 0" class="flex items-center text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Low Stock - Only {{ product.Stock }} left</span>
            </div>
            <div v-else class="flex items-center text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Out of Stock</span>
            </div>
          </div>

          <!-- Add to Cart Section -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center mb-4">
              <label for="quantity" class="block text-sm font-medium text-gray-700 mr-4">
                Quantity
              </label>
              <div class="flex rounded-md">
                <button
                  @click="decrementQuantity"
                  class="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  :disabled="quantity <= 1 || product.Stock <= 0"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 || product.Stock <= 0 }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  id="quantity"
                  v-model="quantity"
                  min="1"
                  :max="product.Stock"
                  class="w-16 border-y border-gray-300 text-center focus:ring-0 focus:outline-none"
                  :disabled="product.Stock <= 0"
                />
                <button
                  @click="incrementQuantity"
                  class="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                  :disabled="quantity >= product.Stock || product.Stock <= 0"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      quantity >= product.Stock || product.Stock <= 0,
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="addToCart"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors"
                :disabled="product.Stock <= 0"
                :class="{ 'opacity-50 cursor-not-allowed': product.Stock <= 0 }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
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
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <div class="border-b border-gray-200">
        <!-- Reviews Tab -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div class="flex items-center mt-1">
                  <div class="flex items-center">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-5 h-5"
                      :class="i <= (product.Rating || 4) ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      ></path>
                    </svg>
                  </div>
                  <p class="ml-2 text-sm text-gray-700">
                    Based on {{ product.ReviewCount || 42 }} reviews
                  </p>
                </div>
              </div>
              <div>
                <button
                  class="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Added to Cart Modal -->
    <div
      v-if="showCartModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showCartModal = false"
        ></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Item Added to Cart
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ product.Name }} has been added to your cart.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              @click="goToCart"
            >
              View Cart
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showCartModal = false"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProductById } from '@/lib/api';
  import Breadcrumb from '@/components/Breadcrumb.vue';

  const route = useRoute();

  // State
  const loading = ref(true);
  const error = ref(null);
  const product = ref({});
  const quantity = ref(1);

  const fetchProduct = async () => {
    try {
      loading.value = true;
      error.value = null;

      const productId = route.params.id;
      product.value = await getProductById(productId);
    } catch (err) {
      console.error(err);
      error.value = 'Failed to load product. Please try again funker dette?.';
    } finally {
      loading.value = false;
    }
  };

  // Methods
  const incrementQuantity = () => {
    if (quantity.value < product.value.Stock) {
      quantity.value++;
    }
  };

  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    fetchProduct();
  });
</script>
