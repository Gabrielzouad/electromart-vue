<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"
      ></div>
    </div>

    <div v-else-if="safeCart && safeCart.length === 0" class="text-center py-8">
      <p class="text-gray-500">Your cart is empty.</p>
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
          :key="item.CartItemID || item.ProductID"
          class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
        >
          <div class="flex items-center space-x-4">
            <img :src="item.ImageURL" alt="Product" class="w-20 h-20 object-cover rounded" />
            <div>
              <h3 class="font-semibold text-lg text-gray-800">{{ item.Name }}</h3>
              <p class="text-sm text-gray-600">Qty: {{ item.Quantity }}</p>
              <p class="text-sm font-medium text-gray-800">
                ${{ Number(item.Price).toFixed(2) }} each
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium text-gray-700">Shipping Address ID</label>
        <input
          type="number"
          v-model="addressId"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter Address ID"
        />
      </div>

      <div class="text-right">
        <h2 class="text-xl font-bold mb-4">Total: ${{ total.toFixed(2) }}</h2>
        <button
          @click="submitOrder"
          :disabled="orderLoading"
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium"
        >
          <span v-if="orderLoading">Placing Order...</span>
          <span v-else>Confirm Order</span>
        </button>
      </div>

      <p v-if="orderError" class="text-red-500 mt-4">{{ orderError }}</p>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue';
  import { useCart } from '@/lib/cart';
  import { useRouter } from 'vue-router';

  const { safeCart, loading, loadCart } = useCart();
  const router = useRouter();

  const total = computed(() =>
    safeCart.value.reduce((sum, item) => sum + Number(item.Price) * (item.Quantity || 1), 0)
  );

  const addressId = ref(1);
  const orderLoading = ref(false);
  const orderError = ref(null);

  function getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.UserID ?? null;
  }

  async function submitOrder() {
    const userId = getUserId();
    if (!userId || !addressId.value) {
      orderError.value = 'Missing user or address info';
      return;
    }

    orderLoading.value = true;
    orderError.value = null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          addressId: addressId.value,
        }),
      });

      if (!res.ok) throw new Error('Order submission failed');

      const data = await res.json();
      router.push(`/thank-you?orderId=${data.orderId}`);
    } catch (err) {
      orderError.value = err.message || 'Unknown error';
    } finally {
      orderLoading.value = false;
    }
  }

  onMounted(loadCart);
</script>
