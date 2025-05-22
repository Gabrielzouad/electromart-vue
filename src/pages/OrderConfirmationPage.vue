<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!order" class="bg-white rounded-lg shadow-md p-8 text-center">
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
      <h3 class="text-xl font-medium text-gray-700 mb-2">No order found</h3>
      <p class="text-gray-500 mb-6">We couldn't find any recent order information.</p>
      <router-link
        to="/"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Continue Shopping
      </router-link>
    </div>

    <div v-else>
      <!-- Order Confirmation Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div
              class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 md:mb-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-emerald-500"
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
          </div>

          <div class="text-center md:text-left md:ml-6 flex-1">
            <h1 class="text-2xl font-bold text-gray-800">Thank you for your order!</h1>
            <p class="text-gray-600">Your order has been received and is being processed.</p>
          </div>

          <div class="mt-4 md:mt-0">
            <button
              @click="printOrder"
              class="flex items-center text-emerald-600 hover:text-emerald-700"
            >
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Receipt
            </button>
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
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in order.items" :key="item.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img
                                :src="
                                  item.image ||
                                  `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(item.name)}`
                                "
                                :alt="item.name"
                                class="h-10 w-10 object-contain"
                              />
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">${{ item.price.toFixed(2) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ item.quantity }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            ${{ (item.price * item.quantity).toFixed(2) }}
                          </div>
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
                    <span>${{ order.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Shipping</span>
                    <span>{{ order.shipping > 0 ? '$' + order.shipping.toFixed(2) : 'Free' }}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Tax</span>
                    <span>${{ order.tax.toFixed(2) }}</span>
                  </div>
                  <div
                    class="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2"
                  >
                    <span>Total</span>
                    <span>${{ order.total.toFixed(2) }}</span>
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
              <div class="mb-6">
                <h3 class="font-semibold text-gray-800 mb-2">Customer Details</h3>
                <p class="text-gray-600">{{ order.userInfo?.name }}</p>
                <p class="text-gray-600">{{ order.userInfo?.email }}</p>
                <p class="text-gray-600">Username: {{ order.userInfo?.username }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">Address Information</h2>
            </div>

            <div class="p-6">
              <div class="mb-4">
                <h3 class="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                <p class="text-gray-600">{{ order.addressInfo?.street }}</p>
                <p class="text-gray-600">Postal Code: {{ order.addressInfo?.postCode }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold">Payment Information</h2>
            </div>

            <div class="p-6">
              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Payment Method</h3>
                <p class="text-gray-600">{{ order.paymentMethod }}</p>
                <p class="text-gray-600">Status: {{ order.paymentData?.Status || 'Pending' }}</p>
                <p class="text-gray-600">Date: {{ formatDate(order.paymentData?.PaymentDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4">What's Next?</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border border-gray-200 rounded-md p-4">
            <div class="flex items-center mb-3">
              <div
                class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800">Order Confirmation</h3>
            </div>
            <p class="text-gray-600 text-sm">
              You will receive an order confirmation email with details of your order.
            </p>
          </div>

          <div class="border border-gray-200 rounded-md p-4">
            <div class="flex items-center mb-3">
              <div
                class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800">Order Processing</h3>
            </div>
            <p class="text-gray-600 text-sm">
              Your order is being processed and will be shipped soon.
            </p>
          </div>

          <div class="border border-gray-200 rounded-md p-4">
            <div class="flex items-center mb-3">
              <div
                class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-800">Shipping</h3>
            </div>
            <p class="text-gray-600 text-sm">
              You will receive a shipping confirmation email with tracking information when your
              order ships.
            </p>
          </div>
        </div>
      </div>

      <!-- Continue Shopping -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
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

const printOrder = () => {
  window.print();
};

onMounted(async () => {
  const orderId = route.query.orderId;
  if (!orderId) return;

  try {
    const response = await fetch(`https://idatg2204backend-production.up.railway.app/api/orders/details/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    const data = await response.json();

    // Expected structure from backend
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
      items: data.Items || [] // [{ name, price, quantity, image }]
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

    button {
      display: none !important;
    }
  }
</style>
