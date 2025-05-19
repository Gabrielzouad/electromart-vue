<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>

    <!-- Empty Cart State -->
    <div v-if="cart.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
      <p class="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
      <router-link
        to="/products"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Start Shopping
      </router-link>
    </div>

    <!-- Cart with Items -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items -->
      <div class="lg:w-2/3">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Cart Items ({{ totalItems }})</h2>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="item in cart"
              :key="item.id"
              class="p-6 flex flex-col sm:flex-row items-center"
            >
              <!-- Product Image -->
              <div class="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                <img
                  :src="
                    item.image ||
                    `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(item.name)}`
                  "
                  :alt="item.name"
                  class="w-full h-full object-contain"
                />
              </div>

              <!-- Product Details -->
              <div class="sm:ml-6 flex-1">
                <div class="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-800">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">Product ID: {{ item.id }}</p>
                  </div>
                  <div class="mt-2 sm:mt-0 text-right">
                    <p class="text-lg font-bold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                    <p class="text-sm text-gray-500">${{ item.price.toFixed(2) }} each</p>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
                  <!-- Quantity Controls -->
                  <div class="flex items-center">
                    <button
                      @click="decrementQuantity(item)"
                      class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-l-md"
                      :disabled="item.quantity <= 1"
                      :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      v-model.number="item.quantity"
                      min="1"
                      @change="updateQuantity(item)"
                      class="w-12 text-center border-t border-b border-gray-300 py-1"
                    />
                    <button
                      @click="incrementQuantity(item)"
                      class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-r-md"
                    >
                      +
                    </button>
                  </div>

                  <!-- Remove Button -->
                  <button
                    @click="removeItem(item)"
                    class="mt-2 sm:mt-0 text-red-500 hover:text-red-700 flex items-center"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Continue Shopping Button -->
        <div class="mt-6">
          <router-link
            to="/products"
            class="inline-flex items-center text-emerald-600 hover:text-emerald-700"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Continue Shopping
          </router-link>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:w-1/3">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 class="text-xl font-semibold mb-6">Order Summary</h2>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">
                {{ shipping > 0 ? '$' + shipping.toFixed(2) : 'Free' }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Tax ({{ (taxRate * 100).toFixed() }}%)</span>
              <span class="font-medium">${{ tax.toFixed(2) }}</span>
            </div>

            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex justify-between">
                <span class="text-lg font-bold">Total</span>
                <span class="text-lg font-bold">${{ total.toFixed(2) }}</span>
              </div>
              <p class="text-gray-500 text-sm mt-1">Including VAT</p>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="mt-6">
            <label for="promo-code" class="block text-sm font-medium text-gray-700 mb-1">
              Promo Code
            </label>
            <div class="flex">
              <input
                type="text"
                id="promo-code"
                v-model="promoCode"
                class="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter code"
              />
              <button
                @click="applyPromoCode"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md"
              >
                Apply
              </button>
            </div>
            <p
              v-if="promoMessage"
              class="mt-2 text-sm"
              :class="promoValid ? 'text-green-600' : 'text-red-600'"
            >
              {{ promoMessage }}
            </p>
          </div>

          <!-- Checkout Button -->
          <div class="mt-6">
            <router-link
              to="/checkout"
              class="block w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center px-6 py-3 rounded-md font-medium transition-colors"
            >
              Proceed to Checkout
            </router-link>
          </div>

          <!-- Payment Methods -->
          <div class="mt-6 flex justify-center">
            <div class="flex space-x-4">
              <div class="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-auto"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                  />
                </svg>
              </div>
              <div class="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-auto"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V8h16v9c0 .55-.45 1-1 1z"
                  />
                </svg>
              </div>
              <div class="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-auto"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getCart, updateCartItem, removeFromCart, saveCart } from '../lib/api';

  // State
  const cart = ref([]);
  const promoCode = ref('');
  const promoMessage = ref('');
  const promoValid = ref(false);
  const promoDiscount = ref(0);
  const taxRate = 0.08; // 8% tax rate
  const shippingThreshold = 50; // Free shipping for orders over $50
  const shippingRate = 5.99; // Shipping cost if below threshold

  // Computed properties
  const subtotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  const shipping = computed(() => {
    return subtotal.value >= shippingThreshold ? 0 : shippingRate;
  });

  const tax = computed(() => {
    return (subtotal.value - promoDiscount.value) * taxRate;
  });

  const total = computed(() => {
    return subtotal.value - promoDiscount.value + shipping.value + tax.value;
  });

  const totalItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Methods
  const loadCart = () => {
    cart.value = getCart();
  };

  const updateQuantity = (item) => {
    // Ensure quantity is at least 1
    if (item.quantity < 1) {
      item.quantity = 1;
    }

    // Update cart in localStorage
    updateCartItem(item.id, item.quantity);
  };

  const incrementQuantity = (item) => {
    item.quantity++;
    updateQuantity(item);
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      item.quantity--;
      updateQuantity(item);
    }
  };

  const removeItem = (item) => {
    if (confirm(`Remove ${item.name} from your cart?`)) {
      cart.value = removeFromCart(item.id);
    }
  };

  const applyPromoCode = () => {
    // Reset previous promo
    promoDiscount.value = 0;
    promoValid.value = false;

    if (!promoCode.value) {
      promoMessage.value = '';
      return;
    }

    // Check for valid promo codes
    const validPromoCodes = {
      WELCOME10: 0.1, // 10% off
      SAVE20: 0.2, // 20% off
      FREESHIP: 0, // Free shipping (handled separately)
    };

    const code = promoCode.value.toUpperCase();

    if (validPromoCodes.hasOwnProperty(code)) {
      promoValid.value = true;

      if (code === 'FREESHIP') {
        // Special case for free shipping
        promoMessage.value = 'Free shipping applied!';
      } else {
        // Percentage discount
        const discountRate = validPromoCodes[code];
        promoDiscount.value = subtotal.value * discountRate;
        promoMessage.value = `${discountRate * 100}% discount applied!`;
      }
    } else {
      promoMessage.value = 'Invalid promo code';
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    loadCart();
  });
</script>
