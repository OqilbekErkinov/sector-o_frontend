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
          <div class="password-wrapper">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 10s3-3 10-3 10 3 10 3"/>
                <path d="m5 11-1.5 1.5"/>
                <path d="m9 8-1.5-2"/>
                <path d="m14 8 1.5-2"/>
                <path d="m19 11 1.5 1.5"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="message" class="success-msg">{{ message }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.verifying') : $t('reset_password.btn_confirm') }}
        </button>

        <button type="button" @click="router.push('/login')" class="auth-btn secondary mt-2">
          {{ $t('common.back') }}
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
const showPassword = ref(false)

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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
  width: 100%;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 50px !important;
}

.eye-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.eye-btn:hover {
  transform: scale(1.1);
  opacity: 1;
  color: #00CFFF;
}

.auth-btn {
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-btn.primary {
  background: #00CFFF;
  color: #000;
}

.auth-btn.primary:hover {
  background: #00aacc;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 207, 255, 0.3);
}

.auth-btn.secondary {
  background: transparent;
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.mt-2 {
  margin-top: 8px;
}
</style>
