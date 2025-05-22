import { fetchCart, addToCart, removeFromCartItem } from './api';
import { ref, computed } from 'vue';

const cart = ref([]);
const loading = ref(false);

function getUserId() {
  const user = JSON.parse(sessionStorage.getItem('electromart-user'));
  return user?.id ?? null;
}

async function loadCart(router) {
  const userId = getUserId();
  loading.value = true;

  if (!userId) {
    if (router) router.push('/login?redirectTo=/cart');
    return;
  }

  try {
    const result = await fetchCart(userId);
    cart.value = Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Backend cart fetch failed:', err);
    cart.value = [];
  } finally {
    loading.value = false;
  }
}

const safeCart = computed(() => (Array.isArray(cart.value) ? cart.value : []));

async function addItem(product, quantity = 1, router) {
  const userId = getUserId();
  if (!userId) {
    if (router) router.push('/login?redirectTo=/products');
    return;
  }

  try {
    await addToCart(userId, product.ProductID, quantity);
    await loadCart(router);
  } catch (err) {
    console.error('Failed to add item:', err);
  }
}

async function removeItem(cartItemId, router) {
  const userId = getUserId();
  if (!userId) {
    if (router) router.push('/login?redirectTo=/cart');
    return;
  }

  try {
    await removeFromCartItem(cartItemId);
    await loadCart(router);
  } catch (err) {
    console.error('Failed to remove item:', err);
  }
}

export function useCart() {
  return {
    cart,
    safeCart,
    loading,
    loadCart,
    addItem,
    removeItem,
  };
}