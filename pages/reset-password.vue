<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Sector-<span style="color: #00CFFF;">O</span></h1>
        <p class="auth-subtitle">{{ $t('reset_password.confirm_title') }}</p>
      </div>

      <form @submit.prevent="handleReset" class="auth-form">
        <p class="info-text">{{ $t('reset_password.confirm_subtitle') }}</p>
        
        <div class="input-group">
          <label>{{ $t('register.code') }}</label>
          <input v-model="form.code" type="text" maxlength="6" placeholder="123456" required />
        </div>

        <div class="input-group">
          <label>{{ $t('register.password') }}</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="message" class="success-msg">{{ message }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.verifying') : $t('reset_password.btn_confirm') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const form = reactive({
  email: route.query.email || '',
  code: '',
  password: ''
})

const error = ref('')
const message = ref('')
const loading = ref(false)

async function handleReset() {
  error.value = ''
  message.value = ''
  loading.value = true
  
  try {
    const res = await $fetch(`${config.public.apiBase}/api/auth/password-reset-confirm/`, {
      method: 'POST',
      body: form
    })
    message.value = res.message
    setTimeout(() => {
      router.push('/login')
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
