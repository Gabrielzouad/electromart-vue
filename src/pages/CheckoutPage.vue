<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Checkout</h1>

    <!-- Saved Addresses -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Select a saved address</h2>
      <div v-if="savedAddresses.length === 0" class="text-gray-500 mb-4">
        No saved addresses found.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          v-for="address in savedAddresses"
          :key="address.AddressID"
          @click="selectedAddressId = address.AddressID"
          class="cursor-pointer border px-4 py-3 rounded-md shadow-sm transition-all"
          :class="{ 'border-emerald-500 ring-2 ring-emerald-300': selectedAddressId === address.AddressID }"
        >
          <input
            type="radio"
            :value="address.AddressID"
            v-model="selectedAddressId"
            class="sr-only"
          />
          <div class="font-medium">{{ address.Street }}</div>
          <div class="text-sm text-gray-600">
            {{ address.PostCode }}, {{ address.City }}
          </div>
        </div>
      </div>
    </div>

    <!-- New Address Form -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Or add a new address</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          v-model="newAddress.street"
          type="text"
          placeholder="Street"
          class="border px-4 py-2 rounded w-full"
        />
        <input
          v-model="newAddress.postCode"
          type="text"
          placeholder="Postcode"
          class="border px-4 py-2 rounded w-full"
          @blur="lookupCity"
        />
        <input
          v-model="newAddress.city"
          type="text"
          placeholder="City (auto-filled)"
          class="border px-4 py-2 rounded bg-gray-100 w-full"
          readonly
        />
      </div>
      <button
        @click="saveNewAddress"
        class="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Address
      </button>
      <p v-if="formError" class="text-red-600 mt-2">{{ formError }}</p>
    </div>

    <!-- Payment Method -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Select Payment Method</h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="option in ['Mastercard', 'Visa', 'PayPal']"
          :key="option"
          @click="paymentMethod = option"
          class="cursor-pointer border px-4 py-2 rounded-md text-center shadow-sm transition-all w-40"
          :class="{ 'border-emerald-500 ring-2 ring-emerald-300': paymentMethod === option }"
        >
          <input
            type="radio"
            :value="option"
            v-model="paymentMethod"
            class="sr-only"
          />
          <span class="font-medium text-gray-800">{{ option }}</span>
        </div>
      </div>
    </div>

    <!-- Confirm -->
    <div class="mt-8 text-right">
      <button
        @click="submitOrder"
        class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded font-medium"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Placing Order..." : "Confirm Order" }}
      </button>
      <p v-if="orderError" class="text-red-500 mt-2">{{ orderError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  lookupCityByPostcode,
  saveNewAddress as apiSaveNewAddress,
} from "../lib/api";

const router = useRouter();

const user = JSON.parse(sessionStorage.getItem("electromart-user"));
const userId = user?.id ?? null;

const savedAddresses = ref([]);
const selectedAddressId = ref(null);

const newAddress = ref({
  street: "",
  postCode: "",
  city: "",
});
const formError = ref("");
const orderError = ref("");
const isSubmitting = ref(false);
const paymentMethod = ref("Mastercard");

// Fetch saved addresses
async function fetchAddresses() {
  if (!userId) return;
  try {
    const res = await fetch(
      `https://idatg2204backend-production.up.railway.app/api/addresses/${userId}`
    );
    if (res.ok) {
      savedAddresses.value = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch addresses:", err);
  }
}

// Lookup city from postcode
async function lookupCity() {
  const postcode = newAddress.value.postCode;
  if (!postcode || !/^\d{4}$/.test(postcode)) {
    formError.value = "Postcode must be 4 digits";
    newAddress.value.city = "";
    return;
  }

  try {
    const data = await lookupCityByPostcode(postcode);
    newAddress.value.city = data.City || data.city || "";
    formError.value = "";
  } catch (err) {
    console.error("Postcode lookup failed:", err);
    newAddress.value.city = "";
    formError.value = "Invalid postcode";
  }
}

// Save new address
async function saveNewAddress() {
  const { street, postCode } = newAddress.value;
  if (!street || !postCode) {
    formError.value = "Please fill in all address fields.";
    return;
  }

  try {
    await apiSaveNewAddress(userId, street, postCode);
    formError.value = "";
    await fetchAddresses();
    newAddress.value = { street: "", postCode: "", city: "" };
  } catch (err) {
    console.error("Save address error:", err);
    formError.value = "Failed to save address.";
  }
}

async function submitOrder() {
  const addressId = selectedAddressId.value;
  if (!addressId) {
    orderError.value = "Please select an address.";
    return;
  }
  if (!paymentMethod.value) {
    orderError.value = "Please select a payment method.";
    return;
  }

  try {
    isSubmitting.value = true;

    const res = await fetch("https://idatg2204backend-production.up.railway.app/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        addressId,
        paymentMethod: paymentMethod.value,
      }),
    });

    if (!res.ok) throw new Error("Order submission failed");
    const data = await res.json();

  
    router.push(`/order-confirmation?orderId=${data.orderId}`);
  } catch (err) {
    console.error(err);
    orderError.value = "Failed to place order";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(fetchAddresses);
</script>
