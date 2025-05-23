<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!order" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No order found</h3>
      <p class="text-gray-500 mb-6">We couldn't find any recent order information.</p>
      <router-link to="/" class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors">
        Continue Shopping
      </router-link>
    </div>

    <div v-else>
      <!-- Order Confirmation Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
          <div class="text-center md:text-left md:ml-6 flex-1">
            <h1 class="text-2xl font-bold text-gray-800">Thank you for your order!</h1>
            <p class="text-gray-600">Your order has been received and is being processed.</p>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Order Summary -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">Order Summary</h2>
            </div>

            <div class="p-6">
              <div class="flex justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-gray-800">Order Number</h3>
                  <p class="text-gray-600">{{ order.orderNumber }}</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Order Date</h3>
                  <p class="text-gray-600">{{ formatDate(order.date) }}</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Status</h3>
                  <p class="text-gray-600">{{ order.orderData?.Status || 'Processing' }}</p>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="font-semibold text-gray-800 mb-3">Items</h3>
                <div class="border rounded-md overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in order.items" :key="item.name">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img :src="item.image || `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(item.name)}`" :alt="item.name" class="h-10 w-10 object-contain"/>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">${{ Number(item.price).toFixed(2) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ item.quantity }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <div class="w-full md:w-1/3">
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Subtotal</span>
                    <span>${{ Number(order.subtotal).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Shipping</span>
                    <span>{{ order.shipping > 0 ? '$' + order.shipping.toFixed(2) : 'Free' }}</span>
                  </div>
                  <!-- Tax removed -->
                  <div class="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>${{ Number(order.total).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User and Address Information -->
        <div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">User Information</h2>
            </div>
            <div class="p-6">
              <h3 class="font-semibold text-gray-800 mb-2">Customer Details</h3>
              <p class="text-gray-600">{{ order.userInfo?.name }}</p>
              <p class="text-gray-600">{{ order.userInfo?.email }}</p>
              <p class="text-gray-600">Username: {{ order.userInfo?.username }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">Address Information</h2>
            </div>
            <div class="p-6">
              <h3 class="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p class="text-gray-600">{{ order.addressInfo?.street }}</p>
              <p class="text-gray-600">Postal Code: {{ order.addressInfo?.postCode }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">Payment Information</h2>
            </div>
            <div class="p-6">
              <h3 class="font-semibold text-gray-800 mb-2">Payment Method</h3>
              <p class="text-gray-600">{{ order.paymentMethod }}</p>
              <p class="text-gray-600">Status: {{ order.paymentData?.Status || 'Pending' }}</p>
              <p class="text-gray-600">Date: {{ formatDate(order.paymentData?.PaymentDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Shopping -->
      <div class="mt-6 text-center">
        <router-link to="/" class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(async () => {
  const orderId = route.query.orderId;
  if (!orderId) return;

  try {
    const response = await fetch(`https://idatg2204backend-production.up.railway.app/api/orders/details/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    const data = await response.json();

    order.value = {
      orderNumber: orderId,
      date: data.OrderDate,
      subtotal: data.Amount,
      shipping: 0,
      tax: 0,
      total: data.Amount,
      orderData: {
        Status: data.Status
      },
      addressInfo: {
        street: data.Street || 'N/A',
        postCode: data.PostCode || 'N/A',
      },
      userInfo: {
        name: `${data.FirstName ?? ''} ${data.LastName ?? ''}`.trim(),
        email: data.Email || 'unknown@example.com',
        username: data.Username || '',
      },
      paymentData: {
        PaymentDate: data.PaymentDate,
        Status: data.PaymentStatus,
      },
      paymentMethod: data.PaymentMethod || '',
      items: data.Items || []
    };
  } catch (err) {
    console.error('Error loading order:', err);
  }
});
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }

  .container,
  .container * {
    visibility: visible;
  }

  .container {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
