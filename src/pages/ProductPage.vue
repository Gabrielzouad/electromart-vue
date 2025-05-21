<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb Navigation -->
      <nav class="flex mb-6 text-sm" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="text-gray-600 hover:text-emerald-500">
              Home
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <router-link 
                :to="`/categories/${product.CategoryID}`" 
                class="ml-1 text-gray-600 hover:text-emerald-500 md:ml-2"
              >
                {{ categoryName }}
              </router-link>
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-gray-500 md:ml-2">{{ product.Name }}</span>
            </div>
          </li>
        </ol>
      </nav>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
  
      <!-- Product Content -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Product Images Section -->
        <div class="lg:w-1/2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative pb-[100%]">
              <img 
                :src="product.ImageURL || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.Name)}`" 
                :alt="product.Name"
                class="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
          </div>
          
          <!-- Thumbnail Gallery (if you have multiple images) -->
          <div v-if="productImages.length > 1" class="grid grid-cols-5 gap-2 mt-4">
            <button 
              v-for="(image, index) in productImages" 
              :key="index"
              class="bg-white rounded-md overflow-hidden border-2 transition-all"
              :class="selectedImageIndex === index ? 'border-emerald-500' : 'border-transparent'"
              @click="selectedImageIndex = index"
            >
              <div class="relative pb-[100%]">
                <img 
                  :src="image" 
                  :alt="`${product.Name} - Image ${index + 1}`"
                  class="absolute inset-0 w-full h-full object-contain p-1"
                />
              </div>
            </button>
          </div>
        </div>
        
        <!-- Product Details Section -->
        <div class="lg:w-1/2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Brand & Product Name -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <span class="text-sm text-emerald-600 font-medium">{{ brandName }}</span>
                <span v-if="product.IsNew" class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">New</span>
              </div>
              <h1 class="text-3xl font-bold text-gray-900">{{ product.Name }}</h1>
            </div>
            
            <!-- Rating -->
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= (product.Rating || 4) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-600">{{ product.ReviewCount || 42 }} reviews</span>
            </div>
            
            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-center">
                <span class="text-3xl font-bold text-gray-900">${{ product.Price.toFixed(2) }}</span>
                <span v-if="product.OldPrice" class="ml-3 text-lg text-gray-500 line-through">${{ product.OldPrice.toFixed(2) }}</span>
                <span v-if="product.OldPrice" class="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-sm font-medium rounded">
                  {{ Math.round((1 - product.Price / product.OldPrice) * 100) }}% OFF
                </span>
              </div>
              <p v-if="product.Price >= 50" class="text-sm text-emerald-600 mt-1">Free shipping</p>
            </div>
            
            <!-- Stock Status -->
            <div class="mb-6">
              <div v-if="product.Stock > 10" class="flex items-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>In Stock</span>
              </div>
              <div v-else-if="product.Stock > 0" class="flex items-center text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Low Stock - Only {{ product.Stock }} left</span>
              </div>
              <div v-else class="flex items-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Out of Stock</span>
              </div>
            </div>
            
            <!-- Description -->
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <div class="prose prose-emerald text-gray-700">
                <p>{{ product.Description }}</p>
              </div>
            </div>
            
            <!-- Key Features (if available) -->
            <div v-if="product.Features && product.Features.length" class="mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Key Features</h2>
              <ul class="list-disc pl-5 text-gray-700 space-y-1">
                <li v-for="(feature, index) in product.Features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <!-- Add to Cart Section -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center mb-4">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mr-4">Quantity</label>
                <div class="flex rounded-md">
                  <button 
                    @click="decrementQuantity" 
                    class="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                    :disabled="quantity <= 1 || product.Stock <= 0"
                    :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 || product.Stock <= 0 }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <input 
                    type="number" 
                    id="quantity" 
                    v-model="quantity" 
                    min="1" 
                    :max="product.Stock" 
                    class="w-16 border-y border-gray-300 text-center focus:ring-0 focus:outline-none"
                    :disabled="product.Stock <= 0"
                  />
                  <button 
                    @click="incrementQuantity" 
                    class="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                    :disabled="quantity >= product.Stock || product.Stock <= 0"
                    :class="{ 'opacity-50 cursor-not-allowed': quantity >= product.Stock || product.Stock <= 0 }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="addToCart" 
                  class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors"
                  :disabled="product.Stock <= 0"
                  :class="{ 'opacity-50 cursor-not-allowed': product.Stock <= 0 }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                
                <button 
                  @click="toggleWishlist" 
                  class="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 mr-2" 
                    :class="isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ isInWishlist ? 'Saved' : 'Save' }}
                </button>
              </div>
            </div>
            
            <!-- Additional Information -->
            <div class="mt-8">
              <div class="border-t border-gray-200 pt-4">
                <div class="flex items-center text-sm text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Fast delivery: 2-4 business days</span>
                </div>
                <div class="flex items-center text-sm text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure payment</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Product Tabs (Reviews, Specifications, etc.) -->
      <div class="mt-12">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'description'" 
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === 'description' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Description
            </button>
            <button 
              @click="activeTab = 'specifications'" 
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === 'specifications' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Specifications
            </button>
            <button 
              @click="activeTab = 'reviews'" 
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Reviews ({{ product.ReviewCount || 42 }})
            </button>
          </nav>
        </div>
        
        <div class="py-6">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose prose-emerald max-w-none">
            <p>{{ product.Description }}</p>
            
            <!-- Extended description would go here -->
            <p class="mt-4">
              Experience the perfect blend of style, functionality, and performance with the {{ product.Name }}. 
              Designed with the modern consumer in mind, this product offers exceptional value and quality that stands the test of time.
            </p>
            
            <p class="mt-4">
              Whether you're a professional looking for reliable equipment or a hobbyist seeking to enhance your experience, 
              the {{ product.Name }} delivers on all fronts with its innovative features and thoughtful design.
            </p>
          </div>
          
          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specifications'" class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900 w-1/3">Brand</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ brandName }}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Category</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ categoryName }}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Model Number</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ product.ModelNumber || 'EM-' + product.ProductID }}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Dimensions</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ product.Dimensions || '10 x 5 x 3 inches' }}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Weight</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ product.Weight || '1.2 lbs' }}</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Warranty</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ product.Warranty || '1 Year Limited Warranty' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center mb-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <div class="flex items-center mt-1">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= (product.Rating || 4) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <p class="ml-2 text-sm text-gray-700">Based on {{ product.ReviewCount || 42 }} reviews</p>
                  </div>
                </div>
                <div>
                  <button class="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>
              
              <!-- Rating Distribution -->
              <div class="mb-6">
                <div class="flex items-center mb-2">
                  <div class="w-24 text-sm text-gray-700">5 stars</div>
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: 70%"></div>
                  </div>
                  <div class="w-12 text-right text-sm text-gray-700">70%</div>
                </div>
                <div class="flex items-center mb-2">
                  <div class="w-24 text-sm text-gray-700">4 stars</div>
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: 20%"></div>
                  </div>
                  <div class="w-12 text-right text-sm text-gray-700">20%</div>
                </div>
                <div class="flex items-center mb-2">
                  <div class="w-24 text-sm text-gray-700">3 stars</div>
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: 5%"></div>
                  </div>
                  <div class="w-12 text-right text-sm text-gray-700">5%</div>
                </div>
                <div class="flex items-center mb-2">
                  <div class="w-24 text-sm text-gray-700">2 stars</div>
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: 3%"></div>
                  </div>
                  <div class="w-12 text-right text-sm text-gray-700">3%</div>
                </div>
                <div class="flex items-center">
                  <div class="w-24 text-sm text-gray-700">1 star</div>
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: 2%"></div>
                  </div>
                  <div class="w-12 text-right text-sm text-gray-700">2%</div>
                </div>
              </div>
              
              <!-- Sample Reviews -->
              <div class="space-y-4">
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= 5 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <h4 class="ml-2 text-sm font-medium text-gray-900">Excellent product, highly recommend!</h4>
                  </div>
                  <p class="text-sm text-gray-700 mb-1">The quality exceeded my expectations. It's well-made and performs exactly as described.</p>
                  <div class="flex items-center text-xs text-gray-500">
                    <span>John D.</span>
                    <span class="mx-1">•</span>
                    <span>Verified Purchase</span>
                    <span class="mx-1">•</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= 4 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <h4 class="ml-2 text-sm font-medium text-gray-900">Great value for the price</h4>
                  </div>
                  <p class="text-sm text-gray-700 mb-1">I've been using this for a month now and it's holding up well. Fast shipping too!</p>
                  <div class="flex items-center text-xs text-gray-500">
                    <span>Sarah M.</span>
                    <span class="mx-1">•</span>
                    <span>Verified Purchase</span>
                    <span class="mx-1">•</span>
                    <span>1 month ago</span>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= 5 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <h4 class="ml-2 text-sm font-medium text-gray-900">Perfect for my needs</h4>
                  </div>
                  <p class="text-sm text-gray-700 mb-1">This product has all the features I was looking for and the customer service was excellent when I had questions.</p>
                  <div class="flex items-center text-xs text-gray-500">
                    <span>Michael T.</span>
                    <span class="mx-1">•</span>
                    <span>Verified Purchase</span>
                    <span class="mx-1">•</span>
                    <span>3 months ago</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 text-center">
                <button class="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Products -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative pb-[100%]">
              <img 
                :src="`/placeholder.svg?height=300&width=300&query=Product ${i}`" 
                :alt="`Related Product ${i}`"
                class="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-1">Related Product {{ i }}</h3>
              <div class="flex items-center mb-1">
                <div class="flex items-center">
                  <svg v-for="j in 5" :key="j" class="w-3 h-3" :class="j <= 4 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="ml-1 text-xs text-gray-500">({{ 10 + i * 5 }})</span>
              </div>
              <p class="text-sm font-bold text-gray-900">${{ (19.99 + i * 10).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recently Viewed -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative pb-[100%]">
              <img 
                :src="`/placeholder.svg?height=300&width=300&query=Recent Product ${i}`" 
                :alt="`Recent Product ${i}`"
                class="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-1">Recent Product {{ i }}</h3>
              <div class="flex items-center mb-1">
                <div class="flex items-center">
                  <svg v-for="j in 5" :key="j" class="w-3 h-3" :class="j <= 4 ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="ml-1 text-xs text-gray-500">({{ 15 + i * 3 }})</span>
              </div>
              <p class="text-sm font-bold text-gray-900">${{ (24.99 + i * 15).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Added to Cart Modal -->
      <div v-if="showCartModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showCartModal = false"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Item Added to Cart
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ product.Name }} has been added to your cart.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                @click="goToCart"
              >
                View Cart
              </button>
              <button 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showCartModal = false"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  // State
  const loading = ref(true);
  const error = ref(null);
  const product = ref({});
  const quantity = ref(1);
  const activeTab = ref('description');
  const selectedImageIndex = ref(0);
  const showCartModal = ref(false);
  const isInWishlist = ref(false);
  
  const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    const productId = route.params.id;

    const res = await fetch(`http://localhost:3000/api/products/${productId}`); // adjust if different
    if (!res.ok) throw new Error('Product not found');

    const data = await res.json();

    product.value = {
      ...data,
      Price: parseFloat(data.Price),
      OldPrice: parseFloat(data.OldPrice || 0), // fallback
      Rating: data.Rating || 4.5,
      ReviewCount: data.ReviewCount || 128,
      Features: data.Features || [
        "High-end hardware",
        "Retina Display",
        "5G Compatible",
        "Excellent camera performance",
        "Face ID & Touch ID"
      ]
    };

  } catch (err) {
    console.error(err);
    error.value = 'Failed to load product. Please try again.';
  } finally {
    loading.value = false;
  }
};


  


  
  // Methods
  const incrementQuantity = () => {
    if (quantity.value < product.value.Stock) {
      quantity.value++;
    }
  };
  
  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };
  
  const addToCart = () => {
    // In a real app, this would add the product to the cart in your state management system
    console.log('Adding to cart:', {
      product: product.value,
      quantity: quantity.value
    });
    
    // Show the added to cart modal
    showCartModal.value = true;
    
    // You could also update a cart count in the header here
  };
  
  const goToCart = () => {
    // In a real app, this would navigate to the cart page
    showCartModal.value = false;
    router.push('/cart');
  };
  
  const toggleWishlist = () => {
    isInWishlist.value = !isInWishlist.value;
    
    // In a real app, this would add/remove the product from the wishlist in your state management system
    console.log(isInWishlist.value ? 'Added to wishlist:' : 'Removed from wishlist:', product.value);
  };
  
  // Lifecycle hooks
  onMounted(() => {
    fetchProduct();
  });
  </script>