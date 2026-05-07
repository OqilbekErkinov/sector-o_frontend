<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Sector-<span style="color: #00CFFF;">O</span></h1>
        <p class="auth-subtitle">{{ isVerifyStep ? $t('register.verify_title') : $t('register.subtitle') }}</p>
      </div>

      <form v-if="!isVerifyStep" @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label>{{ $t('register.full_name') }}</label>
          <input v-model="form.full_name" type="text" :placeholder="$t('register.full_name')" required />
        </div>
        <div class="input-group">
          <label>{{ $t('register.phone') }}</label>
          <input v-model="form.phone" type="tel" placeholder="998901234567" required />
        </div>
        <div class="input-group">
          <label>{{ $t('register.email') }}</label>
          <input v-model="form.email" type="email" placeholder="example@mail.com" required />
        </div>
        <div class="input-group">
          <label>{{ $t('register.password') }}</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="message" class="success-msg">{{ message }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.sending') : $t('register.btn') }}
        </button>
      </form>

      <form v-else @submit.prevent="handleVerify" class="auth-form">
        <p class="verify-info"><b>{{ form.email }}</b> {{ $t('register.verify_desc') }}</p>
        <div class="input-group">
          <label>{{ $t('register.code') }}</label>
          <input v-model="code" type="text" maxlength="6" placeholder="123456" required />
        </div>
        
        <div v-if="error" class="error-msg">{{ error }}</div>
        
        <button type="submit" class="auth-btn primary" :disabled="loading">
          {{ loading ? $t('register.verifying') : $t('register.verify_btn') }}
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
          {{ $t('register.have_account') }} <NuxtLink to="/login">{{ $t('register.login_link') }}</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { locale, setLocale } = useI18n()
const { register, verifyEmail } = useAuth()
const router = useRouter()

useHead({
  bodyAttrs: {
    class: 'auth-body'
  }
})

const form = ref({
  full_name: '',
  phone: '',
  email: '',
  password: ''
})

const code = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)
const isVerifyStep = ref(false)

async function handleRegister() {
  error.value = ''
  message.value = ''
  loading.value = true
  
  const res = await register(form.value)
  loading.value = false
  
  if (res.success) {
    message.value = res.message
    isVerifyStep.value = true
  } else {
    error.value = res.error
  }
}

async function handleVerify() {
  error.value = ''
  loading.value = true
  const res = await verifyEmail(form.value.email, code.value)
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
  /* background: #111111; */
  /* background-image: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%); */
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  /* background: rgba(40, 40, 40, 0.8); */
  /* backdrop-filter: blur(15px); */
  /* border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px; */
  padding: 40px;
  padding-top: 20px;
  /* box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8); */
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
  margin-top: 0px;
  color: #fff;
}

.auth-subtitle {
  color: #00CFFF;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
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

.success-msg {
  color: #00ff88;
  font-size: 14px;
  text-align: center;
  background: rgba(0, 255, 136, 0.1);
  padding: 10px;
  border-radius: 8px;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #888;
}

.auth-footer a {
  color: #00CFFF;
  text-decoration: none;
  font-weight: 600;
}

.verify-info {
  text-align: center;
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
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
}

.lang-pill {
  padding: 6px 16px;
  border-radius: 24px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.45);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
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
</style>
