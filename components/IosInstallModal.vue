<template>
  <transition name="fade-scale">
    <div v-if="visible" class="ios-install-overlay" @click.self="$emit('close')">
      <div class="ios-install-content">
        <h3 class="ios-install-title">{{ $t('profile.install_app_ios_title') }}</h3>

        <div class="ios-install-step">
          <span class="ios-install-step-num">1</span>
          <span class="ios-install-step-text">{{ $t('profile.install_app_ios_step1') }}</span>
          <svg class="ios-install-icon" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1V15M10 1L5 6M10 1L15 6" stroke="#00CFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 11V20C2 21.6569 3.34315 23 5 23H15C16.6569 23 18 21.6569 18 20V11" stroke="#00CFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="ios-install-step">
          <span class="ios-install-step-num">2</span>
          <span class="ios-install-step-text">{{ $t('profile.install_app_ios_step2') }}</span>
        </div>

        <div class="ios-install-step">
          <span class="ios-install-step-num">3</span>
          <span class="ios-install-step-text">{{ $t('profile.install_app_ios_step3') }}</span>
        </div>

        <button class="ios-install-close" @click="$emit('close')">
          {{ $t('profile.install_app_ios_close') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps(['visible'])
defineEmits(['close'])

watch(() => props.visible, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : 'auto'
})
</script>

<style scoped>
.ios-install-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 20px;
}

.ios-install-content {
  background: #222222;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.ios-install-title {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 20px;
}

.ios-install-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ios-install-step:last-of-type {
  border-bottom: none;
}

.ios-install-step-num {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 207, 255, 0.15);
  color: #00CFFF;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ios-install-step-text {
  flex: 1;
  color: #ccc;
  font-size: 14px;
  line-height: 1.4;
}

.ios-install-icon {
  flex-shrink: 0;
}

.ios-install-close {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #00CFFF;
  color: #111;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>
