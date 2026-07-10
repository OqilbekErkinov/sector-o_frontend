<template>
  <div class="error-page">
    <div class="error-card">
      <h1 class="error-brand">Sector-<span class="accent">O</span></h1>

      <div class="error-code">{{ statusCode }}</div>
      <h2 class="error-title">{{ title }}</h2>
      <p class="error-desc">{{ desc }}</p>

      <div class="error-actions">
        <button class="btn primary" @click="goHome">{{ $t('error.go_home') }}</button>
        <button class="btn secondary" @click="retry">{{ $t('error.retry') }}</button>
      </div>

      <pre v-if="isDev && error?.message" class="error-debug">{{ error.message }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const isDev = import.meta.dev

const statusCode = computed(() => props.error?.statusCode || 500)

const title = computed(() => {
  if (statusCode.value === 404) return t('error.not_found_title')
  if (statusCode.value >= 500) return t('error.server_title')
  return t('error.generic_title')
})

const desc = computed(() => {
  if (statusCode.value === 404) return t('error.not_found_desc')
  if (statusCode.value >= 500) return t('error.server_desc')
  return t('error.generic_desc')
})

function goHome() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #222222;
  padding: 20px;
}

.error-card {
  text-align: center;
  max-width: 420px;
  width: 100%;
  background: #2a2a2a;
  padding: 48px 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.error-brand {
  font-family: 'Gropled', sans-serif;
  color: #fff;
  font-size: 22px;
  margin-bottom: 24px;
}

.error-brand .accent {
  color: #00CFFF;
}

.error-code {
  font-family: 'Gropled', sans-serif;
  font-size: 72px;
  font-weight: bold;
  color: #00CFFF;
  line-height: 1;
  margin-bottom: 8px;
}

.error-title {
  color: #fff;
  font-size: 20px;
  margin-bottom: 10px;
}

.error-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  border: none;
  padding: 13px 30px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Futura PT', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn.primary {
  background: #00CFFF;
  color: #000;
}

.btn.primary:hover {
  transform: scale(1.03);
  box-shadow: 0 0 20px rgba(0, 207, 255, 0.4);
}

.btn.secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.secondary:hover {
  border-color: #00CFFF;
  color: #00CFFF;
}

.btn:active {
  transform: scale(0.97);
}

.error-debug {
  margin-top: 24px;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(255, 60, 60, 0.08);
  border: 1px solid rgba(255, 60, 60, 0.2);
  color: #ff8080;
  font-size: 12px;
  padding: 12px;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
}
</style>
