<template>
  <transition name="fade-scale">
    <div v-if="visible" class="language-overlay">
      <div class="language-content">
        <div class="language-header">
          <button @click="closeModal" class="language-close-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M13 1L1 13" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div class="language-main language-body">
          <div class="language-selection">
            <h2 class="language-title">{{ $t('languages.select_language') }}</h2>
            <label class="language-option">
              <input type="radio" value="uz" v-model="selectedLanguage" />
              O’zbekcha
            </label>
            <label class="language-option">
              <input type="radio" value="ru" v-model="selectedLanguage" />
              Русский
            </label>
            <label class="language-option">
              <input type="radio" value="en" v-model="selectedLanguage" />
              English
            </label>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['close'])
const { locale, setLocale } = useI18n()

const selectedLanguage = computed({
  get: () => locale.value,
  set: (val) => {
    setLocale(val)
  }
})

const closeModal = () => {
  emit('close')
}
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>