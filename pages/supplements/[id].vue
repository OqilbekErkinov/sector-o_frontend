<template>
  <div class="supplement-detail-page">
    <!-- Loading State -->
    <template v-if="pending">
      <Skeleton height="300px" borderRadius="20px" class="mb-4" />
      <Skeleton height="40px" borderRadius="10px" class="mb-3" />
      <Skeleton height="100px" borderRadius="15px" class="mb-3" />
      <Skeleton height="100px" borderRadius="15px" class="mb-3" />
    </template>

    <template v-else-if="supplement">
      <!-- Back Button -->
      <button class="back-button mb-3" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ $t('common.back', 'Orqaga') }}
      </button>

      <!-- Hero Image & Title -->
      <div class="hero-section text-center mb-4">
        <div class="img-wrapper">
          <NuxtImg v-if="supplement.img" :src="getMediaUrl(supplement.img)" class="supplement-img" alt="Supplement Image" />
          <div v-else class="img-placeholder">💊</div>
        </div>
        <h1 class="supplement-title mt-3">{{ t(supplement, 'name') }}</h1>
      </div>

      <!-- Details Content -->
      <div class="details-card mb-3">
        <h3>⚡ {{ $t('nutrition.main_functions', 'Asosiy vazifalari') }}</h3>
        <p class="detail-text">{{ t(supplement, 'benefits') }}</p>
      </div>

      <div class="details-card mb-3" v-if="t(supplement, 'origin')">
        <h3>🌱 {{ $t('nutrition.origin', 'Kelib chiqishi') }}</h3>
        <p class="detail-text">{{ t(supplement, 'origin') }}</p>
      </div>

      <div class="details-card mb-3" v-if="t(supplement, 'dosage')">
        <h3>⚖️ {{ $t('nutrition.dosage', 'Doza') }}</h3>
        <p class="detail-text">{{ t(supplement, 'dosage') }}</p>
      </div>

      <div class="details-card mb-3" v-if="t(supplement, 'timing')">
        <h3>⏳ {{ $t('nutrition.timing', 'Qabul qilish vaqti') }}</h3>
        <p class="detail-text">{{ t(supplement, 'timing') }}</p>
      </div>

      <div class="details-card mb-3" v-if="t(supplement, 'sources')">
        <h3>📚 {{ $t('nutrition.sources', 'Ilmiy manbalar') }}</h3>
        <p class="detail-text sources-text" v-for="(line, li) in sourceLines" :key="li">
          <template v-for="(part, pi) in line" :key="pi">
            <a v-if="part.link" :href="part.value" target="_blank" rel="noopener noreferrer">{{ part.value }}</a>
            <template v-else>{{ part.value }}</template>
          </template>
        </p>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-5">
        <h2>Not found</h2>
        <button class="btn-calc primary mt-3" @click="$router.push('/nutrition')">Return</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/composables/useApi';
import { useLocalized } from '~/composables/useLocalized';

const route = useRoute();
const config = useRuntimeConfig();
const { getMediaUrl } = useApi();
const { t } = useLocalized();

const supplementId = route.params.id;

// Fetch details
const { data: supplement, pending } = await useAsyncData(`supplement-${supplementId}`, () => {
  return $fetch(`${config.public.apiBase}/api/supplements/${supplementId}/`);
});

// Renders "sources" text safely without v-html — see utils/textFormat.ts.
const sourceLines = computed(() => parseSourceLines(t(supplement.value, 'sources')));
</script>

<style scoped>
.supplement-detail-page {
  animation: fadeIn 0.4s ease-out;
      background: #222222;
    padding: 14px;
    max-width: 450px;
    margin: 0 auto;
    overflow: visible;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.back-button:hover {
  opacity: 1;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 207, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.supplement-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.img-placeholder {
  font-size: 60px;
}

.supplement-title {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-top: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.details-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.details-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #00CFFF;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0;
}

.sources-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.sources-text :deep(a) {
  color: #00CFFF;
  text-decoration: underline;
  word-break: break-all;
}
</style>
