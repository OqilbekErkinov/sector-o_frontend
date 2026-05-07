<template>
    <div class="style-wrapper">
        <h1 class="style-heading">
            <span class="highlight">{{ $t('exercises.choose_section_highlight') }}</span><br>
            <span style="font-family: Futura PT, sans-serif">{{ $t('exercises.choose_section_text') }}</span>
        </h1>
    <div class="style-grid">
      <NuxtLink :to="{ path: '/exercises-type', query: { category: cat.slug } }" class="style-card"
        v-for="(cat, i) in categories" :key="i" :style="{ backgroundImage: `url(${getMediaUrl(cat.img)})` }"
        style="text-decoration: none;">
        <div>
          <p class="style-title">{{ t(cat, 'name') }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup>
import { useFitness } from '~/composables/useFitness';
import { useLocalized } from '~/composables/useLocalized';
import { useApi } from '~/composables/useApi';

const fitness = useFitness();
const { t } = useLocalized();
const { getMediaUrl } = useApi();

const categories = computed(() => fitness.categories.value);

// SEO Optimization
useSeoMeta({
  title: 'Training Categories - Sector-O',
  ogTitle: 'Training Categories - Sector-O',
  description: 'Choose your muscle group and start training with Sector-O AI.',
  ogDescription: 'Choose your muscle group and start training with Sector-O AI.',
});
</script>