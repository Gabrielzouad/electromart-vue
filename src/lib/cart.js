import { fetchCart, addToCart, removeFromCartItem } from './api';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const cart = ref([]);
const loading = ref(false);
const router = useRouter();

function getUserId() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.UserID ?? null;
}

async function loadCart() {
  const userId = getUserId();
  loading.value = true;

  if (!userId) {
    router.push('/login?redirectTo=/cart');
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

async function addItem(product, quantity = 1) {
  const userId = getUserId();
  if (!userId) {
    router.push('/login?redirectTo=/products');
    return;
  }

  try {
    await addToCart(userId, product.ProductID, quantity);
    await loadCart();
  } catch (err) {
    console.error('Failed to add item:', err);
  }
}

async function removeItem(cartItemId) {
  const userId = getUserId();
  if (!userId) {
    router.push('/login?redirectTo=/cart');
    return;
  }

  try {
    await removeFromCartItem(cartItemId);
    await loadCart();
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
