<template>
  <header class="app-header">
    <div class="header-container">
      <NuxtLink to="/" class="logo-area">
        <NuxtImg src="/images/logo-sector-o.png" class="logo-img" alt="Sector-O Logo" />
        <span class="logo-text">Sector-O</span>
      </NuxtLink>
      
      <div class="header-actions">
        <button class="action-btn" @click="showLangModal = true" aria-label="Change Language">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12H22" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Language Modal Integration -->
    <LanguageModal :visible="showLangModal" @close="showLangModal = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue';

const showLangModal = ref(false);
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  font-family: 'Gropled', sans-serif;
  font-size: 24px;
  color: #00CFFF;
  font-weight: bold;
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background: transparent;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.action-btn:hover {
  opacity: 0.7;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}
</style>
