<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>

    <div v-if="loading.value" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
    </div>

    <div v-else-if="safeCart.length === 0" class="text-center py-8">
      <p class="text-gray-500">Your cart is empty. Start shopping now!</p>
      <router-link
        to="/products"
        class="inline-block mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium"
      >
        Browse Products
      </router-link>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          v-for="item in safeCart"
          :key="item.ProductID"
          class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="item.ImageURL"
              alt="Product"
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 class="font-semibold text-lg text-gray-800">{{ item.Name }}</h3>
              <p class="text-sm text-gray-600">Qty: {{ item.Quantity }}</p>
              <p class="text-sm font-medium text-gray-800">
                ${{ Number(item.Price).toFixed(2) }} each
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <button
              @click="removeItem(item.CartItemID || item.ProductID)"
              class="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="text-right">
        <h2 class="text-xl font-bold mb-4">Total: ${{ total.toFixed(2) }}</h2>
        <button
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCart } from '@/lib/cart';

const { safeCart, loading, loadCart, removeItem } = useCart();

const total = computed(() =>
  safeCart.value.reduce(
    (sum, item) =>
      sum + Number(item.Price) * (item.Quantity || 1),
    0
  )
);

onMounted(loadCart);
</script>
