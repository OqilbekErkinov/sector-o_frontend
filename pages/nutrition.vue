<template>
  <div class="nutrition-page container py-4">
    <header class="reveal">
      <h1>{{ $t('nutrition.title') }}</h1>
    </header>

    <!-- 💊 SUPPLEMENTS (DYNAMIC) -->
    <section class="section reveal" v-if="supplements.length > 0 || fitness.loading.value">
      <h2>💊 {{ $t('nutrition.supplements') }}</h2>
      <template v-if="fitness.loading.value">
        <Skeleton v-for="i in 3" :key="'sup'+i" height="56px" borderRadius="16px" style="margin-bottom: 10px" />
      </template>
      <template v-else>
        <div class="supplement-accordion">
          <NuxtLink
            v-for="s in supplements"
            :key="s.id"
            :to="`/supplements/${s.id}`"
            class="supplement-item"
          >
            <span class="supplement-name">{{ t(s, 'name') }}</span>
            <svg class="supplement-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useFitness } from '~/composables/useFitness';
import { useLocalized } from '~/composables/useLocalized';

const fitness = useFitness();
const { t } = useLocalized();

const supplements = computed(() => fitness.supplements.value);

// SEO Optimization
useSeoMeta({
  title: 'Supplements - Sector-O',
  ogTitle: 'Supplements - Sector-O',
  description: 'Sports supplements guide from Sector-O.',
  ogDescription: 'Sports supplements guide from Sector-O.',
});

// Reveal Animation
onMounted(() => {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
});
</script>

<style scoped>
@import "~/assets/css/nutrition.css";
</style>
