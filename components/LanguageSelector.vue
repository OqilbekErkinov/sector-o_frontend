<template>
  <Transition name="fade">
    <div v-if="visible" class="lang-selector-overlay">
      <div class="lang-selector-content">
        <div class="brand-logo">
          Sector-<span style="color: #00CFFF;">O</span>
        </div>
        <h2 class="lang-title">{{ titles[currentLangIdx] }}</h2>
        <p class="lang-subtitle">{{ subtitles[currentLangIdx] }}</p>
        
        <div class="lang-buttons">
          <button 
            v-for="loc in locales" 
            :key="loc.code" 
            class="lang-btn"
            @click="selectLanguage(loc.code)"
          >
            <span class="lang-name">{{ loc.name }}</span>
            <span class="lang-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const { locale, setLocale } = useI18n();
const router = useRouter();

const visible = ref(false);
const locales = [
  { code: 'uz', name: "O'zbekcha" },
  { code: 'ru', name: "Русский" },
  { code: 'en', name: "English" }
];

const titles = ["Tilni tanlang", "Выберите язык", "Select Language"];
const subtitles = [
  "Dasturdan foydalanish uchun qulay tilni tanlang",
  "Выберите предпочтительный язык для продолжения",
  "Choose your preferred language to continue"
];

const currentLangIdx = ref(0);

onMounted(() => {
  const langSelected = localStorage.getItem('lang_selected');
  if (!langSelected) {
    visible.value = true;
    // Rotate titles for fun
    let i = 0;
    setInterval(() => {
      i = (i + 1) % 3;
      currentLangIdx.value = i;
    }, 3000);
  }
});

const selectLanguage = (code) => {
  setLocale(code);
  localStorage.setItem('lang_selected', 'true');
  visible.value = false;
  router.push('/login');
};
</script>

<style scoped>
.lang-selector-overlay {
  position: fixed;
  inset: 0;
  z-index: 20000;
  background-color: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.lang-selector-content {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.brand-logo {
  font-family: 'Gropled', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 40px;
}

.lang-title {
  color: #fff;
  font-family: 'Gropled', sans-serif;
  font-size: 24px;
  margin-bottom: 10px;
  transition: all 0.5s ease;
}

.lang-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 40px;
  min-height: 40px;
}

.lang-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lang-btn {
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px 25px;
  border-radius: 15px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 16px;
}

.lang-btn:hover {
  background: #333;
  border-color: #00CFFF;
  transform: translateY(-2px);
}

.lang-arrow {
  color: #00CFFF;
  font-size: 20px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.lang-btn:hover .lang-arrow {
  opacity: 1;
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
