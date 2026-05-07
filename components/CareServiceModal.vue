<template>
    <transition name="fade-scale">
        <div v-if="visible" class="care-overlay">
            <div class="care-content">
                <div class="care-header">
                    <span class="care-title">{{ $t('profile.care_service') }}</span>
                    <button @click="closeModal" class="close-btn">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L13 13M13 1L1 13" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
                <div class="care-main">
                    <span class="care-text">{{ $t('profile.care_service_desc') }}</span>
                </div>
                <a href="https://t.me/oqilbek_erkinov" target="_blank" class="pereyti-btn" style="text-decoration: none;"
                    @click="closeModal">
                    {{ $t('profile.care_service_btn') }}
                </a>
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