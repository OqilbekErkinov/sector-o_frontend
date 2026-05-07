<template>
    <transition name="fade-scale">
        <div v-if="visible" class="social-overlay">
            <div class="social-content">
                <div class="social-header">
                    <button @click="closeModal" class="social-close-btn">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
                <div class="social-body">
                    <a href="https://instagram.com/king_006x" target="_blank" class="social-item">
                        <img src="/images/icon-instagram.png" class="icon" />
                    </a>
                    <a href="https://t.me/king_006x" target="_blank" class="social-item">
                        <img src="/images/icon-telegram.png" class="icon" />
                    </a>
                    <a href="https://facebook.com/King_006x" target="_blank" class="social-item">
                        <img src="/images/icon-facebook.png" class="icon" />
                    </a>
                </div>
            </div>
        </div>
    </transition>
</template>
<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['close'])
const closeModal = () => {
    emit('close')
}
watch(() => props.visible, (newVisible) => {
    if (newVisible) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
})
</script>