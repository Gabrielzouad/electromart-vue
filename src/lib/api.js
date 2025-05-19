// API service for ElectroMart
const API_BASE_URL = 'https://idatg2204backend-production.up.railway.app/api';

// Helper function for API requests
async function fetchFromAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Products API
export async function getProducts(params = {}) {
  let queryString = '';

  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();

    if (params.categoryId) queryParams.append('category_id', params.categoryId);
    if (params.brandId) queryParams.append('brand_id', params.brandId);
    if (params.search) queryParams.append('search', params.search);
    if (params.minPrice) queryParams.append('min_price', params.minPrice);
    if (params.maxPrice) queryParams.append('max_price', params.maxPrice);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    queryString = `?${queryParams.toString()}`;
  }

  return fetchFromAPI(`/products${queryString}`);
}

export async function getProductById(id) {
  return fetchFromAPI(`/products/${id}`);
}

// Categories API
export async function getCategories() {
  return fetchFromAPI('/categories');
}

export async function getCategoryById(id) {
  return fetchFromAPI(`/categories/${id}`);
}

// Brands API
export async function getBrands() {
  return fetchFromAPI('/brands');
}

// Cart API (simulated with localStorage)
export function getCart() {
  try {
    const cart = localStorage.getItem('electromart-cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem('electromart-cart', JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartItem(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem('electromart-cart');
  return [];
}
