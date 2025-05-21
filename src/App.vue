<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view @add-to-cart="handleAddToCart" />
    </main>

    <Footer />
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';

  import Footer from './components/Footer.vue';
  import Header from './components/Header.vue';

  const handleAddToCart = (product, quantity) => {
    // Find if product already exists in cart
    const existingItem = cart.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity,
      });
    }

    // Save to localStorage
    localStorage.setItem('electromart-cart', JSON.stringify(cart.value));
  };

  // Lifecycle hooks
  onMounted(() => {
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem('electromart-cart');
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Optionally, clear the invalid cart data from localStorage
      localStorage.removeItem('electromart-cart');
    }
  });
</script>
