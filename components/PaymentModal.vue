<template>
  <transition name="fade-scale">
    <div v-if="visible" class="payment-overlay">
      <div class="payment-content">
        <div class="payment-header">
          <span class="payment-title">{{ $t('payment.title') }}</span>
          <button @click="closeModal" class="payment-close-btn">&times;</button>
        </div>
        <div class="payment-methods">
          <button v-for="method in methods" :key="method.name" @click="pay(method)" class="payment-button">
            <img :src="method.icon" :alt="method.name" class="payment-icon" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['close'])
const methods = [
  { name: 'Click', icon: '/images/pay-click.png', link: '/premium' },
  { name: 'Payme', icon: '/images/pay-payme.png', link: 'https://payme.uz/pay' },
  { name: 'Visa', icon: '/images/pay-visa.png', link: '/premium-done' },
  { name: 'YooKassa', icon: '/images/pay-yookassa.png', link: '/gallery-pro' },
]
const closeModal = () => {
  emit('close')
}
const pay = (method) => {
  window.location.href = method.link
}
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
})
</script>