<template>
  <transition name="fade-scale">
    <div v-if="visible" class="confirm-modal-overlay" @click.self="$emit('cancel')">
      <div class="confirm-modal-content">
        <p class="confirm-modal-message">{{ message }}</p>
        <div class="confirm-modal-actions">
          <button class="confirm-modal-btn cancel" @click="$emit('cancel')">{{ $t('common.no') }}</button>
          <button class="confirm-modal-btn danger" @click="$emit('confirm')">{{ $t('common.yes') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps(['visible', 'message'])
defineEmits(['confirm', 'cancel'])

watch(() => props.visible, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : 'auto'
})
</script>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 20px;
}

.confirm-modal-content {
  background: #222222;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.confirm-modal-message {
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
  margin: 0 0 20px;
}

.confirm-modal-actions {
  display: flex;
  gap: 10px;
}

.confirm-modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.confirm-modal-btn.cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #ccc;
}

.confirm-modal-btn.danger {
  background: #ff6b6b;
  color: #fff;
}
</style>
