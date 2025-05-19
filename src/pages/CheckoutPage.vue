<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <!-- Empty Cart Redirect -->
    <div
      v-if="cart.length === 0 && !orderComplete"
      class="bg-white rounded-lg shadow-md p-8 text-center"
    >
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
      <p class="text-gray-500 mb-6">
        Add some products to your cart before proceeding to checkout.
      </p>
      <router-link
        to="/products"
        class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Browse Products
      </router-link>
    </div>

    <!-- Order Complete -->
    <div v-else-if="orderComplete" class="bg-white rounded-lg shadow-md p-8 text-center">
      <div
        class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
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
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
      <p class="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
      <p class="text-gray-600 mb-6">
        Your order number is:
        <span class="font-semibold">{{ orderNumber }}</span>
      </p>
      <p class="text-gray-600 mb-8">
        We've sent a confirmation email to
        <span class="font-semibold">{{ formData.Email }}</span>
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link
          to="/order-confirmation"
          class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          View Order Details
        </router-link>
        <router-link
          to="/"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
        >
          Continue Shopping
        </router-link>
      </div>
    </div>

    <!-- Checkout Process -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Checkout Form -->
      <div class="lg:w-2/3">
        <!-- Checkout Steps -->
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="p-4 border-b border-gray-200">
            <div class="flex justify-between">
              <div
                v-for="(step, index) in checkoutSteps"
                :key="index"
                class="flex flex-col items-center flex-1"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                  :class="[
                    currentStep > index
                      ? 'bg-emerald-500 text-white'
                      : currentStep === index
                        ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                        : 'bg-gray-200 text-gray-500',
                  ]"
                >
                  <span v-if="currentStep > index">✓</span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span
                  class="text-sm font-medium"
                  :class="currentStep === index ? 'text-emerald-600' : 'text-gray-500'"
                >
                  {{ step }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- User Information Step -->
        <div v-if="currentStep === 0" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold">User Information</h2>
          </div>

          <div class="p-6">
            <form @submit.prevent="goToNextStep">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="FirstName" class="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="FirstName"
                    v-model="formData.FirstName"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.FirstName" class="mt-1 text-sm text-red-600">
                    {{ errors.FirstName }}
                  </p>
                </div>

                <div>
                  <label for="LastName" class="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="LastName"
                    v-model="formData.LastName"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.LastName" class="mt-1 text-sm text-red-600">
                    {{ errors.LastName }}
                  </p>
                </div>

                <div>
                  <label for="Email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="Email"
                    v-model="formData.Email"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.Email" class="mt-1 text-sm text-red-600">{{ errors.Email }}</p>
                </div>

                <div>
                  <label for="Username" class="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="Username"
                    v-model="formData.Username"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.Username" class="mt-1 text-sm text-red-600">
                    {{ errors.Username }}
                  </p>
                </div>

                <div>
                  <label for="Password" class="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="Password"
                    v-model="formData.Password"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.Password" class="mt-1 text-sm text-red-600">
                    {{ errors.Password }}
                  </p>
                </div>

                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                    {{ errors.confirmPassword }}
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="formData.saveInfo"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">
                    Save this information for next time
                  </span>
                </label>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  type="submit"
                  class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Continue to Address
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Address Information Step -->
        <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Address Information</h2>
          </div>

          <div class="p-6">
            <form @submit.prevent="goToNextStep">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label for="Street" class="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="Street"
                    v-model="formData.Street"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.Street" class="mt-1 text-sm text-red-600">{{ errors.Street }}</p>
                </div>

                <div>
                  <label for="PostCode" class="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="PostCode"
                    v-model="formData.PostCode"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.PostCode" class="mt-1 text-sm text-red-600">
                    {{ errors.PostCode }}
                  </p>
                </div>
              </div>

              <div class="mt-6 flex justify-between">
                <button
                  @click="goToPreviousStep"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Payment Method Step -->
        <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Payment Method</h2>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label
                  class="flex items-center p-4 border border-gray-300 rounded-md"
                  :class="{
                    'border-emerald-500 bg-emerald-50': formData.PaymentMethod === 'Mastercard',
                  }"
                >
                  <input
                    type="radio"
                    name="PaymentMethod"
                    value="Mastercard"
                    v-model="formData.PaymentMethod"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="ml-2 flex items-center">
                    <span class="font-medium">Mastercard</span>
                    <span class="ml-auto flex space-x-2">
                      <svg class="h-8 w-auto text-gray-400" viewBox="0 0 36 24" fill="currentColor">
                        <path
                          d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          fill="#000"
                          opacity=".07"
                        />
                        <path
                          d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                          fill="#fff"
                        />
                        <path
                          d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                          fill="#142688"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <label
                  class="flex items-center p-4 border border-gray-300 rounded-md"
                  :class="{ 'border-emerald-500 bg-emerald-50': formData.PaymentMethod === 'Visa' }"
                >
                  <input
                    type="radio"
                    name="PaymentMethod"
                    value="Visa"
                    v-model="formData.PaymentMethod"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="ml-2 flex items-center">
                    <span class="font-medium">Visa</span>
                    <svg
                      class="ml-auto h-8 w-auto text-gray-400"
                      viewBox="0 0 36 24"
                      fill="currentColor"
                    >
                      <path
                        d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        fill="#000"
                        opacity=".07"
                      />
                      <path
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                        fill="#fff"
                      />
                      <path
                        d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                        fill="#142688"
                      />
                    </svg>
                  </span>
                </label>
              </div>

              <div>
                <label
                  class="flex items-center p-4 border border-gray-300 rounded-md"
                  :class="{
                    'border-emerald-500 bg-emerald-50': formData.PaymentMethod === 'PayPal',
                  }"
                >
                  <input
                    type="radio"
                    name="PaymentMethod"
                    value="PayPal"
                    v-model="formData.PaymentMethod"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="ml-2 flex items-center">
                    <span class="font-medium">PayPal</span>
                    <svg
                      class="ml-auto h-8 w-auto text-gray-400"
                      viewBox="0 0 36 24"
                      fill="currentColor"
                    >
                      <path
                        d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                        fill="#000"
                        opacity=".07"
                      />
                      <path
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                        fill="#fff"
                      />
                      <path
                        d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                        fill="#003087"
                      />
                      <path
                        d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                        fill="#3086C8"
                      />
                      <path
                        d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                        fill="#012169"
                      />
                    </svg>
                  </span>
                </label>
              </div>
            </div>

            <div
              v-if="formData.PaymentMethod === 'Mastercard' || formData.PaymentMethod === 'Visa'"
              class="mt-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    v-model="formData.cardNumber"
                    placeholder="1234 5678 9012 3456"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">
                    {{ errors.cardNumber }}
                  </p>
                </div>

                <div>
                  <label for="cardName" class="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    v-model="formData.cardName"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p v-if="errors.cardName" class="mt-1 text-sm text-red-600">
                    {{ errors.cardName }}
                  </p>
                </div>

                <div class="flex space-x-4">
                  <div class="w-1/2">
                    <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      v-model="formData.expiryDate"
                      placeholder="MM/YY"
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                    <p v-if="errors.expiryDate" class="mt-1 text-sm text-red-600">
                      {{ errors.expiryDate }}
                    </p>
                  </div>

                  <div class="w-1/2">
                    <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      v-model="formData.cvv"
                      placeholder="123"
                      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                    <p v-if="errors.cvv" class="mt-1 text-sm text-red-600">{{ errors.cvv }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-between">
              <button
                @click="goToPreviousStep"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Back
              </button>
              <button
                @click="goToNextStep"
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Review Order
              </button>
            </div>
          </div>
        </div>

        <!-- Order Review Step -->
        <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Review Your Order</h2>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <h3 class="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div class="divide-y divide-gray-200">
                <div v-for="item in cart" :key="item.id" class="py-4 flex items-center">
                  <div class="w-16 h-16 flex-shrink-0">
                    <img
                      :src="
                        item.image ||
                        `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`
                      "
                      :alt="item.name"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="ml-4 flex-1">
                    <h4 class="text-sm font-medium text-gray-800">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="font-semibold text-gray-800 mb-3">User Information</h3>
                <div class="bg-gray-50 p-4 rounded-md">
                  <p class="text-sm">{{ formData.FirstName }} {{ formData.LastName }}</p>
                  <p class="text-sm">{{ formData.Email }}</p>
                  <p class="text-sm">Username: {{ formData.Username }}</p>
                </div>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800 mb-3">Address Information</h3>
                <div class="bg-gray-50 p-4 rounded-md">
                  <p class="text-sm">{{ formData.Street }}</p>
                  <p class="text-sm">Postal Code: {{ formData.PostCode }}</p>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-semibold text-gray-800 mb-3">Payment Method</h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <p class="text-sm flex items-center">
                  <span>{{ formData.PaymentMethod }}</span>
                  <svg
                    v-if="formData.PaymentMethod === 'Mastercard'"
                    class="ml-2 h-6 w-auto text-gray-400"
                    viewBox="0 0 36 24"
                    fill="currentColor"
                  >
                    <path
                      d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      fill="#000"
                      opacity=".07"
                    />
                    <path
                      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                      fill="#fff"
                    />
                    <path
                      d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                      fill="#142688"
                    />
                  </svg>
                  <svg
                    v-if="formData.PaymentMethod === 'Visa'"
                    class="ml-2 h-6 w-auto text-gray-400"
                    viewBox="0 0 36 24"
                    fill="currentColor"
                  >
                    <path
                      d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      fill="#000"
                      opacity=".07"
                    />
                    <path
                      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                      fill="#fff"
                    />
                    <path
                      d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                      fill="#142688"
                    />
                  </svg>
                  <svg
                    v-if="formData.PaymentMethod === 'PayPal'"
                    class="ml-2 h-6 w-auto text-gray-400"
                    viewBox="0 0 36 24"
                    fill="currentColor"
                  >
                    <path
                      d="M33 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h30c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      fill="#000"
                      opacity=".07"
                    />
                    <path
                      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H1c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h34z"
                      fill="#fff"
                    />
                    <path
                      d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                      fill="#003087"
                    />
                    <path
                      d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                      fill="#3086C8"
                    />
                    <path
                      d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                      fill="#012169"
                    />
                  </svg>
                </p>
                <p
                  v-if="
                    formData.PaymentMethod === 'Mastercard' || formData.PaymentMethod === 'Visa'
                  "
                  class="text-sm mt-2"
                >
                  Card ending in {{ formData.cardNumber ? formData.cardNumber.slice(-4) : '****' }}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Shipping</span>
                <span>{{ shipping > 0 ? '$' + shipping.toFixed(2) : 'Free' }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Tax ({{ (taxRate * 100).toFixed() }}%)</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <div class="mt-6 flex justify-between">
              <button
                @click="goToPreviousStep"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Back
              </button>
              <button
                @click="placeOrder"
                :disabled="isProcessing"
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center"
                :class="{ 'opacity-75 cursor-not-allowed': isProcessing }"
              >
                <span v-if="isProcessing" class="mr-2">
                  <svg
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                {{ isProcessing ? 'Processing...' : 'Place Order' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:w-1/3">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 class="text-xl font-semibold mb-6">Order Summary</h2>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Items ({{ totalItems }})</span>
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
          </div>

          <div class="border-t border-gray-200 pt-4 mb-6">
            <div class="flex justify-between">
              <span class="text-lg font-bold">Total</span>
              <span class="text-lg font-bold">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(item, index) in cart" :key="index" class="flex">
              <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img
                  :src="
                    item.image ||
                    `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`
                  "
                  :alt="item.name"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="ml-4 flex-1">
                <h4 class="text-sm font-medium text-gray-800">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                <p class="text-sm font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
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
  import { useRouter } from 'vue-router';
  import { getCart, clearCart } from '../lib/api';

  const router = useRouter();

  // State
  const cart = ref([]);
  const currentStep = ref(0);
  const checkoutSteps = ['User Info', 'Address', 'Payment', 'Review'];
  const isProcessing = ref(false);
  const orderComplete = ref(false);
  const orderNumber = ref('');
  const errors = ref({});
  const confirmPassword = ref('');

  // Form data
  const formData = ref({
    // User info
    FirstName: '',
    LastName: '',
    Email: '',
    Username: '',
    Password: '',
    saveInfo: false,

    // Address info
    Street: '',
    PostCode: '',

    // Payment info
    PaymentMethod: 'Mastercard',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Constants
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
    return subtotal.value * taxRate;
  });

  const total = computed(() => {
    return subtotal.value + shipping.value + tax.value;
  });

  const totalItems = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Methods
  const loadCart = () => {
    cart.value = getCart();

    // Load saved user info from localStorage if available
    const savedInfo = localStorage.getItem('electromart-user-info');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        Object.assign(formData.value, parsedInfo);
      } catch (error) {
        console.error('Error loading saved user info:', error);
      }
    }
  };

  const validateUserInfo = () => {
    const errors = {};

    if (!formData.value.FirstName.trim()) {
      errors.FirstName = 'First name is required';
    }

    if (!formData.value.LastName.trim()) {
      errors.LastName = 'Last name is required';
    }

    if (!formData.value.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.value.Email)) {
      errors.Email = 'Please enter a valid email address';
    }

    if (!formData.value.Username.trim()) {
      errors.Username = 'Username is required';
    }

    if (!formData.value.Password.trim()) {
      errors.Password = 'Password is required';
    }

    if (formData.value.Password !== confirmPassword.value) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const validateAddressInfo = () => {
    const errors = {};

    if (!formData.value.Street.trim()) {
      errors.Street = 'Street address is required';
    }

    if (!formData.value.PostCode) {
      errors.PostCode = 'Postal code is required';
    }

    return errors;
  };

  const validatePaymentInfo = () => {
    const errors = {};

    if (!formData.value.PaymentMethod) {
      errors.PaymentMethod = 'Payment method is required';
    }

    if (
      (formData.value.PaymentMethod === 'Mastercard' || formData.value.PaymentMethod === 'Visa') &&
      !formData.value.cardNumber.trim()
    ) {
      errors.cardNumber = 'Card number is required';
    }

    return errors;
  };

  const goToNextStep = () => {
    if (currentStep.value === 0) {
      // Validate user info
      const validationErrors = validateUserInfo();

      if (Object.keys(validationErrors).length > 0) {
        errors.value = validationErrors;
        return;
      }

      // Save user info if requested
      if (formData.value.saveInfo) {
        const infoToSave = {
          FirstName: formData.value.FirstName,
          LastName: formData.value.LastName,
          Email: formData.value.Email,
          Username: formData.value.Username,
        };

        localStorage.setItem('electromart-user-info', JSON.stringify(infoToSave));
      }
    } else if (currentStep.value === 1) {
      // Validate address info
      const validationErrors = validateAddressInfo();

      if (Object.keys(validationErrors).length > 0) {
        errors.value = validationErrors;
        return;
      }
    } else if (currentStep.value === 2) {
      // Validate payment info
      const validationErrors = validatePaymentInfo();

      if (Object.keys(validationErrors).length > 0) {
        errors.value = validationErrors;
        return;
      }
    }

    // Clear any previous errors
    errors.value = {};

    // Move to next step
    if (currentStep.value < checkoutSteps.length - 1) {
      currentStep.value++;
    }
  };

  const goToPreviousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  const generateOrderNumber = () => {
    const timestamp = new Date().getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `EM-${timestamp}-${random}`;
  };

  const placeOrder = async () => {
    isProcessing.value = true;

    try {
      // In a real app, you would send the order to your backend here
      // For now, we'll simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order number
      orderNumber.value = generateOrderNumber();

      // Create order data based on database schema
      const orderData = {
        OrderID: Date.now(), // This would be generated by the database
        UserID: 1, // This would be the actual user ID after registration/login
        AddressID: 1, // This would be the address ID after creating the address
        OrderDate: new Date().toISOString(),
        Amount: total.value.toFixed(2),
        Status: 'Processing',
      };

      // Create order items data
      const orderItems = cart.value.map((item) => ({
        OrderItemID: Date.now() + Math.floor(Math.random() * 1000), // This would be generated by the database
        OrderID: orderData.OrderID,
        ProductID: item.id,
        Quantity: item.quantity,
      }));

      // Create payment data
      const paymentData = {
        PaymentID: Date.now() + Math.floor(Math.random() * 1000), // This would be generated by the database
        OrderID: orderData.OrderID,
        PaymentMethod: formData.value.PaymentMethod,
        PaymentDate: new Date().toISOString(),
        Status: 'Pending',
      };

      // Save order to localStorage for order confirmation page
      const order = {
        orderNumber: orderNumber.value,
        orderData: orderData,
        orderItems: orderItems,
        paymentData: paymentData,
        date: new Date().toISOString(),
        items: cart.value,
        subtotal: subtotal.value,
        shipping: shipping.value,
        tax: tax.value,
        total: total.value,
        userInfo: {
          name: `${formData.value.FirstName} ${formData.value.LastName}`,
          email: formData.value.Email,
          username: formData.value.Username,
        },
        addressInfo: {
          street: formData.value.Street,
          postCode: formData.value.PostCode,
        },
        paymentMethod: formData.value.PaymentMethod,
      };

      localStorage.setItem('electromart-last-order', JSON.stringify(order));

      // Clear the cart
      clearCart();

      // Show order complete screen
      orderComplete.value = true;

      // In a real app, you would redirect to an order confirmation page
      // router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      isProcessing.value = false;
    }
  };

  // Lifecycle hooks
  // It's important to call all hooks unconditionally.
  onMounted(() => {
    loadCart();
  });
</script>
