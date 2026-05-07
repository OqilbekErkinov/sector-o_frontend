<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Sector-<span style="color: #00CFFF;">O</span></h1>
        <p class="auth-subtitle">{{ $t('reset_password.request_title') }}</p>
      </div>

      <form @submit.prevent="handleRequest" class="auth-form">
        <p class="info-text">{{ $t('reset_password.request_subtitle') }}</p>
        <div class="input-group">
          <label>{{ $t('register.email') }}</label>
          <input v-model="email" type="email" placeholder="example@mail.com" required />
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="message" class="success-msg">{{ message }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.sending') : $t('reset_password.btn_request') }}
        </button>
        
        <button type="button" @click="router.back()" class="auth-btn secondary mt-2">
          {{ $t('common.back') || 'Orqaga' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({
  layout: false
})

const { locale } = useI18n()
const config = useRuntimeConfig()
const router = useRouter()
const email = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)

async function handleRequest() {
  error.value = ''
  message.value = ''
  loading.value = true
  
  try {
    const res = await $fetch(`${config.public.apiBase}/api/auth/password-reset/`, {
      method: 'POST',
      body: { email: email.value, lang: locale.value }
    })
    message.value = res.message
    setTimeout(() => {
      router.push({ path: '/reset-password', query: { email: email.value } })
    }, 2000)
  } catch (err) {
    error.value = err.data?.error || 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Reuse login styles */
@import "~/assets/css/index.css";

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  animation: fadeIn 0.8s ease-out forwards;
}

.auth-title {
  font-size: 38px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
}

.auth-subtitle {
  color: #00CFFF;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 1px;
}

.info-text {
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group label {
  color: #fff;
  font-weight: 600;
}

.input-group input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 20px;
  color: #fff;
}

.auth-btn {
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.auth-btn.primary {
  background: #00CFFF;
}

.auth-btn.secondary {
  background: transparent;
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-msg {
  color: #ff4d4d;
  background: rgba(255, 77, 77, 0.1);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

.success-msg {
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
</style>
