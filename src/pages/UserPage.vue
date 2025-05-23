<template>
  <div class="container mx-auto px-4 py-10">
    <div class="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Your Profile</h1>

      <div class="mb-6 space-y-1">
        <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
      </div>

      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
      >
        Logout
      </button>

        <div v-if="orders.length" class="mt-10">
        <h2 class="text-xl font-semibold mb-4">Your Orders</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
            v-for="order in orders"
            :key="order.OrderID"
            class="border rounded-md p-4 bg-gray-50"
            >
            <div class="flex justify-between">
                <div>
                <p><strong>Date:</strong> {{ formatDate(order.OrderDate) }}</p>
                <p><strong>Status:</strong> {{ order.Status }}</p>
                </div>
                <div class="text-right">
                <p class="font-bold text-emerald-600">
                    ${{ parseFloat(order.Amount).toFixed(2) }}
                </p>
                <router-link
                    :to="`/order-confirmation?orderId=${order.OrderID}`"
                    class="text-sm text-blue-500 hover:underline"
                >
                    View Details
                </router-link>
                </div>
            </div>
            </div>
        </div>
        </div>



      <div v-else class="mt-6 text-gray-500 text-center">
        No orders found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getOrders } from '@/lib/api';

const router = useRouter();
const user = ref({});
const orders = ref([]);

const logout = () => {
  sessionStorage.removeItem('electromart-user');
  router.push('/login');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const fetchOrders = async () => {
  try {
    orders.value = await getOrders(user.value.id); // use the correct field
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    orders.value = [];
  }
};

onMounted(() => {
  const stored = sessionStorage.getItem('electromart-user');
  if (stored) {
    user.value = JSON.parse(stored);
    fetchOrders();
  } else {
    router.push('/login');
  }
});
</script>
