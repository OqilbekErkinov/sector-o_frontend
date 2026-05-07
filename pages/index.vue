<template>
  <div class="home-page">
    <!-- HERO SECTION -->
    <header class="hero-section">
      <!-- Animated Background grid -->
      <div class="cyber-grid"></div>
      
      <!-- The Giant "O" representing Sector-O -->
      <div class="sector-ring">
        <div class="ring-inner"></div>
      </div>
      
      <!-- Tech HUD details -->
      <div class="hud-top">
         <span class="hud-text">SYS_ONLINE // V 2.0</span>
         <span class="hud-text">SECURED</span>
      </div>

      <div class="hero-content">
        <div class="title-wrapper">
          <h1 class="hero-title">{{ $t('home.hero_title') }}</h1>
        </div>
        <p class="hero-subtitle">{{ $t('home.hero_subtitle') }}</p>
        
        <div class="cta-wrapper">
          <button class="cyber-btn" @click="navigateTo('/exercises-category')">
            <span class="btn-text">{{ $t('home.start_training') }}</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Floating badges -->
      <div class="floating-badge">
        <span class="badge-dot"></span> SECTOR-O
      </div>
    </header>

    <!-- PERSONAL DASHBOARD (Only for Logged in Users) -->
    <section v-if="isLoggedIn" class="dashboard-section reveal mb-4">
      <div class="dashboard-card">
        <div class="dash-header">
          <h3>{{ $t('home.welcome') }}, <span class="text-highlight">{{ user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || $t('home.warrior') }}</span>!</h3>
          <div class="level-badge">LVL {{ user?.level || 1 }}</div>
        </div>
        <div class="dash-stats">
          <div class="stat-box">
            <span class="stat-val">{{ user?.workouts_done || 0 }}</span>
            <span class="stat-lbl">{{ $t('home.workouts') }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ user?.active_days || 0 }}</span>
            <span class="stat-lbl">{{ $t('home.active_days') }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">{{ user?.xp || 0 }}</span>
            <span class="stat-lbl">XP</span>
          </div>
        </div>
        <div class="weekly-progress">
          <div class="progress-info">
            <span class="prog-text">{{ $t('home.weekly_goal') }}: {{ user?.current_week_workouts || 0 }}/{{ user?.weekly_goal || 4 }}</span>
            <span class="prog-perc">{{ Math.min(Math.round(((user?.current_week_workouts || 0) / (user?.weekly_goal || 4)) * 100), 100) }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: Math.min(Math.round(((user?.current_week_workouts || 0) / (user?.weekly_goal || 4)) * 100), 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROGRAM -->
    <section class="featured-section reveal">
      <div class="section-title">
        <h3>{{ $t('home.featured_program') }}</h3>
      </div>
      <div class="featured-program-card">
        <span class="program-tag">NEW</span>
        <div class="program-info">
          <h4>{{ $t('home.beginner_program') }}</h4>
          <p>{{ $t('home.beginner_desc') }}</p>
          <button class="btn-primary w-100" @click="navigateTo('/programs')">
            {{ $t('home.start_program') }}
          </button>
        </div>
      </div>
    </section>

    <!-- FITNESS GOALS (REPLACED QUICK START) -->
    <section class="reveal mt-4">
      <div class="section-title">
        <h3>{{ $t('home.fitness_goals') }}</h3>
      </div>
      <div class="goals-grid">
        <div class="goal-card" @click="navigateTo('/exercises-category')">
          <span class="goal-icon">🔥</span>
          <span class="goal-text">{{ $t('home.weight_loss') }}</span>
        </div>
        <div class="goal-card" @click="navigateTo('/exercises-category')">
          <span class="goal-icon">💪</span>
          <span class="goal-text">{{ $t('home.muscle_gain') }}</span>
        </div>
        <div class="goal-card" @click="navigateTo('/exercises-category')">
          <span class="goal-icon">⚡</span>
          <span class="goal-text">{{ $t('home.endurance') }}</span>
        </div>
      </div>
    </section>


    <!-- DAILY ACTIVITY -->
    <section class="reveal mt-4">
      <div class="section-title">
        <h3>{{ $t('home.daily_activity') || 'Daily Activity' }}</h3>
      </div>
      <div class="activity-cards">
        <div class="activity-card water">
          <div class="activity-icon">💧</div>
          <div class="activity-info">
            <span class="activity-label">{{ $t('home.water') || 'Water' }}</span>
            <span class="activity-value">1.2 / 2.5 L</span>
          </div>
          <div class="activity-add">+</div>
        </div>
        <div class="activity-card workout">
          <div class="activity-icon">🏁</div>
          <div class="activity-info">
            <span class="activity-label">{{ $t('home.workout') || 'Workout' }}</span>
            <span class="activity-value">45 min</span>
          </div>
        </div>
      </div>
    </section>


    <!-- POPULAR EXERCISES (REAL DATA) -->
    <section class="exercises-section reveal">
      <div class="section-title">
        <h3>{{ $t('home.popular_exercises') }}</h3>
        <span class="see-all" @click="navigateTo('/exercises-category')">{{ $t('home.see_all') }}</span>
      </div>
      <div class="exercise-grid">
        <template v-if="fitness.loading.value">
          <Skeleton v-for="i in 4" :key="i" height="150px" borderRadius="20px" />
        </template>
        <template v-else>
          <NuxtLink v-for="ex in popularExercises" :key="ex.id" :to="`/exercises-detail?id=${ex.id}`" class="exercise-item">
            <NuxtImg :src="getMediaUrl(ex.img)" class="ex-image" />
            <div class="ex-name">{{ t(ex, 'name') }}</div>
          </NuxtLink>
        </template>
      </div>
    </section>

    <!-- DAILY MOTIVATION -->
    <section class="motivation-section reveal" v-if="latestMotivation">
      <div class="quote-icon">❝</div>
      <h3 style="margin-bottom: 15px;">{{ $t('home.daily_motivation') }}</h3>
      <p class="quote-text">"{{ t(latestMotivation, 'quote') }}"</p>
      <!-- <p class="text-center" style="font-size: 14px; opacity: 0.7;" v-if="latestMotivation.author">- {{ latestMotivation.author }}</p> -->
    </section>

    <!-- FOOTER TAGLINE -->
    <div class="text-center reveal">
      <h2 style="font-size: 20px; color: #00CFFF;">Sector-O</h2>
      <!-- <p class="text-center mb-0" style="color: #666; font-size: 12px; margin-top: 5px;">Build Your Legacy</p> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFitness } from '~/composables/useFitness';
import { useLocalized } from '~/composables/useLocalized';
import { useApi } from '~/composables/useApi';
import { useAuth } from '~/composables/useAuth';
import { useHaptic } from '~/composables/useHaptic';

const router = useRouter();
const fitness = useFitness();
const { t } = useLocalized();
const { getMediaUrl } = useApi();
const { isLoggedIn, user, fetchUser } = useAuth();
const { hapticLight } = useHaptic();

// SEO Optimization
useSeoMeta({
  title: 'Sector-O - Your Personal AI Trainer',
  ogTitle: 'Sector-O - Transform Your Body',
  description: 'Personalized workouts and recovery plans tailored just for you.',
  ogDescription: 'Sector-O fuels your journey, turning sweat into strength.',
  ogImage: '/images/home-back.jpg',
  twitterCard: 'summary_large_image',
});

// Dynamic Data from Composable
const popularExercises = computed(() => fitness.popularExercises());
const latestMotivation = computed(() => fitness.latestMotivation());

const navigateTo = (path) => {
  hapticLight();
  router.push(path);
};

// Reveal Animation Logic
onMounted(async () => {
  if (isLoggedIn.value && !user.value) {
    await fetchUser();
  }

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
@import "~/assets/css/home.css";

/* Nuxt page transitions are handled in app.vue, 
   but local 'reveal' adds the extra aesthetic punch */
</style>