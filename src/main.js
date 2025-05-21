import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './assets/tailwind.css';

// Import pages
import HomePage from './pages/HomePage.vue';
import ProductListPage from './pages/ProductListPage.vue';

import CartPage from './pages/CartPage.vue';
import CheckoutPage from './pages/CheckoutPage.vue';
import OrderConfirmationPage from './pages/OrderConfirmationPage.vue';
import SearchResultsPage from './pages/SearchResultsPage.vue';
import ProductPage from './pages/ProductPage.vue';

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/products', component: ProductListPage },
    { path: '/category/:id', component: ProductListPage },
    { path: '/product/:id', component: ProductPage },
    { path: '/cart', component: CartPage },
    { path: '/checkout', component: CheckoutPage },
    { path: '/order-confirmation', component: OrderConfirmationPage },
    { path: '/search', component: SearchResultsPage },
  ],
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 };
  },
});

// Create app
const app = createApp(App);

// Use router
app.use(router);

// Mount app
app.mount('#app');
