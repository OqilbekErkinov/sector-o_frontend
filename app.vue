<template>
  <div class="app-wrapper">
    <!-- First Time Language Selection -->
    <LanguageSelector />

    <!-- Global Loading Overlay -->
    <Transition name="fade">
      <LoadingText v-if="fitness.loading.value && !fitness.error.value && !['/login', '/register'].includes(route.path)" />
    </Transition>

    <!-- Global Error Overlay -->
    <Transition name="fade">
      <div v-if="fitness.error.value && !['/login', '/register'].includes(route.path)" class="error-overlay">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h2>Xatolik yuz berdi</h2>
          <p>{{ fitness.error.value }}</p>
          <button class="btn-retry" @click="fitness.loadAllData()">
            Qayta urinish
          </button>
        </div>
      </div>
    </Transition>

    <NuxtLayout>
      <div class="page-content">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useFitness } from '~/composables/useFitness';
import { onMounted } from 'vue';

const fitness = useFitness();
const route = useRoute();

onMounted(() => {
  fitness.loadAllData();
});
</script>
<style>

.app-wrapper {
  margin: 0;
  padding: 0;
  background-color: #222222;
  min-height: 100vh;
  width: 100%;
}

/* Cinematic Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Error Overlay Styles */
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 400px;
  background: #2a2a2a;
  padding: 40px 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.error-icon {
  font-size: 50px;
  margin-bottom: 20px;
}

.error-content h2 {
  color: #fff;
  margin-bottom: 10px;
  font-family: 'Gropled', sans-serif;
}

.error-content p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
}

.btn-retry {
  background: #00CFFF;
  color: #000;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Futura PT', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-retry:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 207, 255, 0.4);
}

.btn-retry:active {
  transform: scale(0.95);
}
</style>