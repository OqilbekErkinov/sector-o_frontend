<template>
  <div class="training-page container">

    <!-- 🎉 COMPLETION SCREEN -->
    <div v-if="state === 'completed'" class="completion-screen container">
      <div class="confetti-placeholder">🏆</div>
      <h1>{{ $t('programs.congratulations') }}</h1>
      <p style="text-align: center;">{{ $t('programs.session_complete_desc') }}</p>
      
      <div v-if="earnedXP > 0" class="xp-earned-card mb-4 mt-2">
        <span class="xp-plus">+{{ earnedXP }} XP</span>
        <p style="font-size: 12px; color: #888; margin: 0; margin-top: 5px;">{{ $t('programs.xp_earned') }}</p>
      </div>

      <button class="btnn-main w-100" @click="goHome">
        {{ $t('programs.back_to_programs') }}
      </button>
    </div>

    <!-- 😴 REST OVERLAY -->
    <div v-if="state === 'resting'" class="rest-overlay">
      <h2 class="rest-title">{{ $t('programs.rest_time') }}</h2>
      <div class="timer-circle">{{ restTimer }}</div>
      <p class="rest-next">{{ $t('programs.up_next') }}: {{ t(nextEx, 'name') }}</p>
      <button class="btnn-main mt-4" @click="skipRest">
        {{ $t('programs.skip') }}
      </button>
    </div>

    <!-- 🏋️ ACTIVE TRAINING -->
    <div v-if="state === 'training'" class="training-wrapper h-100 d-flex flex-column">
      
      <!-- HEADER -->
      <div class="training-header">
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="step-info">
          <span>{{ t(currentEx, 'category_name') }}</span>
          <span>{{ currentIndex + 1 }} / {{ exercises.length }}</span>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="training-content">
        <div class="exercise-media">
          <iframe 
            v-if="currentEx?.video" 
            :src="currentEx.video.includes('youtube') ? currentEx.video + '?autoplay=1&mute=1&loop=1' : getMediaUrl(currentEx.video)"
            allow="autoplay; encrypted-media" 
            allowfullscreen>
          </iframe>
          <NuxtImg v-else-if="currentEx?.img" :src="getMediaUrl(currentEx.img)" />
        </div>
        
        <h1 class="exercise-title">{{ t(currentEx, 'name') }}</h1>
        <div class="exercise-meta">
          <span>{{ currentEx?.duration }}</span>
          <span>{{ currentEx?.difficulty }}</span>
        </div>
        
        <p style="color: #aaa; font-size: 14px; max-width: 400px;">
            {{ t(currentEx, 'description') || 'Focus on proper form and breathing during this exercise.' }}
        </p>
      </div>

      <!-- CONTROLS -->
      <div class="training-controls">
        <button class="btn-circle" @click="prevStep">←</button>
        <button class="btn-main" @click="completeStep">
            {{ isLastExercise ? $t('programs.finish_session') : $t('programs.complete') }}
        </button>
        <button class="btn-circle" @click="nextStep">→</button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalized } from '~/composables/useLocalized'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const config = useRuntimeConfig()
const { t } = useLocalized()
const { getMediaUrl } = useApi()
const { token, user } = useAuth()

/* STATE */
const state = ref('training') // 'training', 'resting', 'completed'
const exercises = ref([])
const currentIndex = ref(0)
const restTimer = ref(60)
const earnedXP = ref(0)
let timerInterval = null

/* COMPUTED */
const currentEx = computed(() => {
    if (exercises.value.length === 0) return null
    return exercises.value[currentIndex.value]
})

const nextEx = computed(() => {
    if (currentIndex.value + 1 < exercises.value.length) {
        return exercises.value[currentIndex.value + 1]
    }
    return null
})

const progressPercent = computed(() => {
    return ((currentIndex.value + (state.value === 'resting' ? 0.5 : 0)) / exercises.value.length) * 100
})

const isLastExercise = computed(() => {
    return currentIndex.value === exercises.value.length - 1
})

/* METHODS */
async function completeStep() {
    if (isLastExercise.value) {
        state.value = 'completed'
        localStorage.removeItem('active_session')

        // XP Hisoblash (Har bir mashq = 10 XP)
        earnedXP.value = exercises.value.length * 10
        
        if (token.value && user.value) {
           try {
               const res = await $fetch(`${config.public.apiBase}/api/auth/add-xp/`, {
                   method: 'POST',
                   headers: {
                       'Authorization': `Bearer ${token.value}`
                   },
                   body: { xp: earnedXP.value }
               })
               // Local state ni yangilash
               user.value.xp = res.xp
               user.value.level = res.level
               user.value.workouts_done = res.workouts_done
               user.value.active_days = res.active_days
               user.value.current_week_workouts = res.current_week_workouts
           } catch(e) {
               console.error("XP qo'shishda xatolik:", e)
           }
        }
    } else {
        startRest()
    }
}

function startRest() {
    state.value = 'resting'
    restTimer.value = 60
    timerInterval = setInterval(() => {
        restTimer.value--
        if (restTimer.value <= 0) {
            skipRest()
        }
    }, 1000)
}

function skipRest() {
    clearInterval(timerInterval)
    state.value = 'training'
    currentIndex.value++
}

function nextStep() {
    if (currentIndex.value < exercises.value.length - 1) {
        currentIndex.value++
    }
}

function prevStep() {
    if (currentIndex.value > 0) {
        currentIndex.value--
    }
}

function goHome() {
    router.push('/programs')
}

/* LIFECYCLE */
onMounted(() => {
    const saved = localStorage.getItem('active_session')
    if (saved) {
        const data = JSON.parse(saved)
        exercises.value = data.exercises || []
    } else {
        router.push('/programs')
    }
})

onUnmounted(() => {
    clearInterval(timerInterval)
})
</script>

<style scoped>
@import "~/assets/css/training.css";

.xp-earned-card {
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid rgba(0, 207, 255, 0.3);
  padding: 15px;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 207, 255, 0.2);
}

.xp-plus {
  font-family: 'Gropled', sans-serif;
  color: #00CFFF;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(0, 207, 255, 0.5);
}
</style>
