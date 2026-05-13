<template>
  <div class="detail-wrapper" v-if="exercise">
    <!-- HEADER -->
    <div class="detail-header">
      <div @click="goBack" class="back-btn">←</div>
      <h1>{{ t(exercise, 'name') }}</h1>
      <div class="fav-btn" :class="{ active: isFavorite }" @click="toggleFavorite">
        {{ isFavorite ? '❤️' : '🤍' }}
      </div>
    </div>

    <!-- METADATA BAR -->
    <div class="meta-bar">
      <div class="meta-item">
        <span class="meta-label">{{ $t('exercises.detail.difficulty') }}</span>
        <span class="meta-value">{{ exercise.difficulty }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ $t('exercises.detail.equipment') }}</span>
        <span class="meta-value">{{ exercise.equipment && exercise.equipment[0] }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ $t('exercises.detail.duration') }}</span>
        <span class="meta-value">{{ exercise.duration }}</span>
      </div>
    </div>

    <!-- VIDEO -->
    <div class="video-box" v-if="exercise.video">
      <iframe :src="getYouTubeEmbedUrl(exercise.video)" frameborder="0" allowfullscreen>
      </iframe>
    </div>

    <!-- INFO -->
    <div class="section">
      <h2>📖 {{ $t('exercises.detail.how_to') }}</h2>
      <p>{{ t(exercise, 'description') }}</p>
    </div>

    <!-- INSTRUCTIONS -->
    <div class="section">
      <h2>📝 {{ $t('exercises.detail.instructions') }}</h2>
      <div class="instruction-list">
        <div v-for="(step, i) in getLocalizedList(exercise, 'instructions')" :key="i" class="instruction-step">
          <span class="step-text">{{ step }}</span>
        </div>
      </div>
    </div>

    <!-- MUSCLES -->
    <div class="section">
      <h2>💪 {{ $t('exercises.detail.muscles') }}</h2>
      <div class="tags">
        <span v-for="(m, i) in getLocalizedList(exercise, 'muscles')" :key="i">{{ m }}</span>
      </div>
    </div>

    <!-- SETS (Mocked or from API if added) -->
    <div class="section">
      <h2>🔢 {{ $t('exercises.detail.sets') }}</h2>
      <p>{{ exercise.recommended_sets || '3-4 sets, 8-12 reps' }}</p>
    </div>

    <!-- MISTAKES -->
    <div class="section">
      <h2>❌ {{ $t('exercises.detail.mistakes') }}</h2>
      <div class="mistake-list">
        <div v-for="(m, i) in getLocalizedList(exercise, 'mistakes')" :key="i" class="mistake-item">
          {{ m }}
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="action-buttons">
      <button v-if="nextExercise" class="next-btn" @click="goNext">
        <span class="next-label">{{ $t('exercises.detail.next') }}:</span>
        <span class="next-name">{{ t(nextExercise, 'name') }}</span>
        <span class="next-arrow">→</span>
      </button>
    </div>
  </div>
  <div v-else class="detail-wrapper">
    <p>{{ $t('exercises.detail.not_found') }}</p>
    <button class="next-btn" @click="goBack">{{ $t('exercises.detail.go_back') }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFitness } from "~/composables/useFitness";
import { useLocalized } from "~/composables/useLocalized";
import { useApi } from "~/composables/useApi";

const router = useRouter();
const route = useRoute();
const fitness = useFitness();
const { t } = useLocalized();
const { locale } = useI18n();
const { getMediaUrl, getYouTubeEmbedUrl } = useApi();

const exerciseId = computed(() => route.query.id);
const exercise = computed(() => fitness.getExerciseById(exerciseId.value));

// SEO Optimization (Dynamic)
watch(() => exercise.value, (newEx) => {
  if (newEx) {
    useSeoMeta({
      title: `${t(newEx, 'name')} - Sector-O`,
      ogTitle: `${t(newEx, 'name')} - Sector-O`,
      description: t(newEx, 'description') || 'Learn how to perform this exercise correctly with Sector-O.',
      ogDescription: t(newEx, 'description') || 'Learn how to perform this exercise correctly with Sector-O.',
    });
  }
}, { immediate: true });

const goBack = () => router.back();

// Helper to get localized list (instructions, muscles, mistakes)
const getLocalizedList = (obj, fieldBase) => {
  if (!obj) return [];
  const localizedField = `${fieldBase}_${locale.value}`;
  return obj[localizedField] || obj[`${fieldBase}_en`] || [];
};

/* 🔥 FAVORITES LOGIC */
const isFavorite = ref(false);

function checkFavorite() {
  if (!exercise.value) return;
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  isFavorite.value = favs.includes(exercise.value.id);
}

function toggleFavorite() {
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (isFavorite.value) {
    favs = favs.filter(id => id !== exercise.value.id);
  } else {
    favs.push(exercise.value.id);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  isFavorite.value = !isFavorite.value;
}

onMounted(() => {
  checkFavorite();
  // Increment views
  if (exerciseId.value) {
    const config = useRuntimeConfig();
    $fetch(`${config.public.apiBase}/api/exercises/${exerciseId.value}/increment_views/`, {
      method: 'POST'
    }).catch(err => console.error('Failed to increment views:', err));
  }
});

/* 🔥 NEXT EXERCISE LOGIC */
const nextExercise = computed(() => {
  if (!exercise.value) return null;
  const exList = fitness.exercises.value;
  const currentIndex = exList.findIndex(ex => ex.id === exercise.value.id);
  // Find next in SAME category
  return exList.slice(currentIndex + 1).find(ex => ex.category_slug === exercise.value.category_slug);
});

const nextExerciseId = computed(() => nextExercise.value?.id || null);

function goNext() {
  if (nextExerciseId.value) {
    router.push({ path: '/exercises-detail', query: { id: nextExerciseId.value } });
    setTimeout(checkFavorite, 100);
  }
}
</script>

<style scoped>
@import "~/assets/css/exercises-detail.css";
</style>
