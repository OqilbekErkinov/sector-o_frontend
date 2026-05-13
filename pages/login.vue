<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Sector-<span style="color: #00CFFF;">O</span></h1>
        <p class="auth-subtitle">{{ isVerifyStep ? $t('register.verify_title') : $t('login.subtitle') }}</p>
      </div>

      <form v-if="!isVerifyStep" @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>{{ $t('register.email') }}</label>
          <input v-model="email" type="email" :placeholder="$t('login.email_placeholder')" required />
        </div>
        <div class="input-group">
          <label>{{ $t('register.password') }}</label>
          <div class="password-wrapper">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" :placeholder="$t('login.password_placeholder')" required />
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
          <NuxtLink to="/forgot-password" class="forgot-link">{{ $t('common.forgot_password') }}</NuxtLink>
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.verifying') : $t('login.btn') }}
        </button>
      </form>

      <form v-else @submit.prevent="handleVerify" class="auth-form">
        <p class="verify-info"><b>{{ email }}</b> {{ $t('register.verify_desc') }}</p>
        <div class="input-group">
          <label>{{ $t('register.code') }}</label>
          <input v-model="code" type="text" maxlength="6" placeholder="123456" required />
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.verifying') : $t('register.verify_btn') }}
        </button>
        <button type="button" @click="isVerifyStep = false" class="auth-btn secondary mt-2">
          {{ $t('common.back') }}
        </button>
      </form>

      <div class="auth-bottom" v-if="!isVerifyStep">
        <div class="lang-switcher">
          <button
            v-for="l in [{ code: 'uz', label: 'O\'z' }, { code: 'ru', label: 'Рус' }, { code: 'en', label: 'Eng' }]"
            :key="l.code"
            @click="setLocale(l.code)"
            class="lang-pill"
            :class="{ active: locale === l.code }"
          >{{ l.label }}</button>
        </div>
        <p class="auth-footer-text">
          {{ $t('login.no_account') }} <NuxtLink to="/register">{{ $t('login.register_link') }}</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({
  layout: false
})

const { locale, setLocale } = useI18n()
const { login, verifyEmail } = useAuth()
const router = useRouter()
import { useHaptic } from '~/composables/useHaptic'
const { hapticLight, hapticSuccess, hapticError } = useHaptic()

useHead({
  bodyAttrs: {
    class: 'auth-body'
  }
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const code = ref('')
const error = ref('')
const loading = ref(false)
const isVerifyStep = ref(false)

async function handleLogin() {
  hapticLight()
  error.value = ''
  loading.value = true
  const res = await login(email.value, password.value)
  loading.value = false
  
  if (res.success) {
    hapticSuccess()
    router.push('/')
  } else if (res.needs_verification) {
    isVerifyStep.value = true
    error.value = res.error
    hapticError()
  } else {
    error.value = res.error
    hapticError()
  }
}

async function handleVerify() {
  error.value = ''
  loading.value = true
  const res = await verifyEmail(email.value, code.value)
  loading.value = false
  
  if (res.success) {
    router.push('/')
  } else {
    error.value = res.error
  }
}
</script>

<style scoped>
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
  backdrop-filter: blur(15px);
  padding: 40px;
  padding-top: 20px;
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-header {
  text-align: center;
  margin-bottom: 15px;
}

.auth-title {
  font-size: 38px;
  font-weight: 900;
  margin-bottom: 12px;
  color: #fff;
}

.auth-subtitle {
  color: #00CFFF;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
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
  margin: 0
}

.input-group label {
  font-size: 15px;
  color: #ffffff;
  font-weight: 600;
  margin-left: 2px;
}

.input-group input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 20px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input-group input:focus {
  outline: none;
  border-color: #00CFFF;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 25px rgba(0, 207, 255, 0.3);
}

.auth-btn {
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
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
  transform: none !important;
}

.error-msg {
  color: #ff4d4d;
  font-size: 14px;
  text-align: center;
  background: rgba(255, 77, 77, 0.1);
  padding: 10px;
  border-radius: 8px;
}

.auth-bottom {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.lang-switcher {
  display: flex;
  gap: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 30px;
  padding: 4px;
  flex-shrink: 0;
}

.lang-pill {
  padding: 8px 20px;
  min-width: 52px;
  border-radius: 24px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
}

.lang-pill.active {
  background: #00CFFF;
  color: #000;
  font-weight: 700;
}

.lang-pill:hover:not(.active) {
  color: rgba(255,255,255,0.8);
}

.auth-footer-text {
  font-size: 14px;
  color: #888;
  text-align: center;
  margin: 0;
}

.auth-footer-text a {
  color: #00CFFF;
  text-decoration: none;
  font-weight: 600;
}

.forgot-link {
  display: block;
  text-align: right;
  color: rgba(255,255,255,0.45);
  font-size: 13px;
  text-decoration: none;
  margin-top: -4px;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #00CFFF;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
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
</style>
