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

export async function fetchCart(userId) {
  return fetchFromAPI(`/carts/${userId}`);
}

export async function addToCart(userId, productId, quantity = 1) {
  return fetchFromAPI(`/carts`, {
    method: 'POST',
    body: JSON.stringify({ userId, productId, quantity }),
  });
}

export async function removeFromCartItem(cartItemId) {
  return fetchFromAPI(`/carts/${cartItemId}`, {
    method: 'DELETE',
  });
}
export async function updateCartItem(cartItemId, quantity) {
  return fetchFromAPI(`/carts/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function loginUser(credentials) {
  return fetchFromAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function signupUser(userData) {
  return fetchFromAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}