<template>
  <div class="ex-wrapper">

    <!-- HEADER -->
    <div class="ex-header">
      <h1>{{ localizedCategoryName }}</h1>
      <span @click="goBack">✕</span>
    </div>

    <!-- LIST -->
    <div class="ex-grid">
      <NuxtLink v-for="(ex, i) in filteredExercises" :key="i" class="ex-card"
        :to="{ path: '/exercises-detail', query: { id: ex.id } }">
        <NuxtImg :src="getMediaUrl(ex.img)" />
        <p>{{ t(ex, 'name') }}</p>
      </NuxtLink>
    </div>

  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useFitness } from '~/composables/useFitness'
import { useLocalized } from '~/composables/useLocalized'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()
const fitness = useFitness()
const { t } = useLocalized()
const { getMediaUrl } = useApi()

const categorySlug = route.query.category || ""

const localizedCategoryName = computed(() => {
  const cat = fitness.getCategoryBySlug(categorySlug)
  return cat ? t(cat, 'name') : categorySlug
})

const goBack = () => {
  router.push('/exercises-category')
}

/* 🔥 FILTERED EXERCISES FROM COMPOSABLE */
const filteredExercises = computed(() => {
  return fitness.getExercisesByCategory(categorySlug)
})

// SEO Optimization
useSeoMeta({
  title: computed(() => `${localizedCategoryName.value} Exercises - Sector-O`),
  ogTitle: computed(() => `${localizedCategoryName.value} Exercises - Sector-O`),
  description: computed(() => `Explore the best ${localizedCategoryName.value} exercises to build muscle and stay fit.`),
  ogDescription: computed(() => `Explore the best ${localizedCategoryName.value} exercises to build muscle and stay fit.`),
});
</script>
