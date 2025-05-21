import { fetchCart, addToCartBackend, removeFromCartItem } from './api';
import { ref, computed } from 'vue';

const cart = ref([]); // Always start as array!
const loading = ref(false);

function getUserId() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.UserID ?? null;
}

function getGuestCart() {
  const raw = localStorage.getItem('guest-cart');
  const data = raw ? JSON.parse(raw) : [];
  return Array.isArray(data) ? data : [];
}

function saveGuestCart(newCart) {
  localStorage.setItem('guest-cart', JSON.stringify(newCart));
}

async function loadCart() {
  const userId = getUserId();
  loading.value = true;
  if (userId) {
    try {
      const result = await fetchCart(userId);
      // Defensive: always assign array
      cart.value = Array.isArray(result) ? result : [];
    } catch (err) {
      console.error('Backend cart fetch failed:', err);
      cart.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    const guestCart = getGuestCart();
    cart.value = Array.isArray(guestCart) ? guestCart : [];
    loading.value = false;
  }
}

// SAFE computed for template
const safeCart = computed(() => (Array.isArray(cart.value) ? cart.value : []));

async function addItem(product, quantity = 1) {
  const userId = getUserId();
  if (userId) {
    try {
      await addToCartBackend(userId, product.ProductID, quantity);
      await loadCart();
    } catch (err) {
      console.error('Failed to add item (logged in):', err);
    }
  } else {
    const guest = getGuestCart();
    const existing = guest.find((item) => item.ProductID === product.ProductID);
    if (existing) {
      existing.Quantity += quantity;
    } else {
      guest.push({ ...product, Quantity: quantity });
    }
    saveGuestCart(guest);
    cart.value = guest;
  }
}

async function removeItem(cartItemId) {
  const userId = getUserId();
  if (userId) {
    try {
      await removeFromCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      console.error('Failed to remove item (logged in):', err);
    }
  } else {
    let guest = getGuestCart();
    guest = guest.filter((item) => item.ProductID !== cartItemId);
    saveGuestCart(guest);
    cart.value = guest;
  }
}

export function useCart() {
  return {
    cart,
    safeCart, // <-- always use safeCart in your template!
    loading,
    loadCart,
    addItem,
    removeItem,
  };
}
