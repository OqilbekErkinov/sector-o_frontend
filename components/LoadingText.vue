<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="pulse-logo">
        <span class="logo-text">Sector-O</span>
      </div>
      <div class="loading-bar">
        <div class="bar-progress"></div>
      </div>
      <p class="motivation-text">{{ quote }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { t } = useI18n();
const quote = ref(t('home.daily_quote') || 'Build Your Legacy');

// Optionally rotate quotes if the loading takes long
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-content {
  text-align: center;
  width: 80%;
  max-width: 300px;
}

.pulse-logo {
  font-family: 'Gropled', sans-serif;
  font-size: 32px;
  color: #00CFFF;
  font-weight: bold;
  margin-bottom: 20px;
  animation: pulse 1.5s infinite ease-in-out;
}

.logo-text {
  letter-spacing: 2px;
}

.loading-bar {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}

.bar-progress {
  width: 40%;
  height: 100%;
  background: #00CFFF;
  border-radius: 10px;
  animation: slide 1.5s infinite ease-in-out;
}

.motivation-text {
  font-family: 'Futura PT', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

@keyframes slide {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
</style>
