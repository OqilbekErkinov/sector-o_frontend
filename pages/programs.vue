<template>
    <div class="programs-page container py-4 pb-5">
        
        <!-- 🔙 BACK NAVIGATION -->
        <div v-if="view !== 'list'" class="nav-back" @click="goBack">
            <span>←</span> {{ view === 'days' ? $t('programs.back_to_programs') : t(selectedProgram, 'name') }}
        </div>

        <!-- 🏢 HEADER (Only on list) -->
        <div v-if="view === 'list'" class="reveal">
            <h1 class="title">{{ $t('programs.title') }}</h1>
            <p class="subtitle">{{ $t('programs.subtitle') }}</p>
        </div>

        <!-- 🚀 VIEW: LIST OF PROGRAMS -->
        <div v-if="view === 'list'" class="program-grid">
            <div v-for="program in programs" :key="program.id" class="program-card reveal" @click="selectProgram(program)">
                <NuxtImg :src="getMediaUrl(program.img)" loading="lazy" />
                <div class="badge" :class="program.level.toLowerCase()">{{ program.level }}</div>
                <div class="overlay">
                    <h3>{{ t(program, 'name') }}</h3>
                    <p>{{ program.duration }} • {{ $t('programs.days', { count: program.days.length }) }}</p>
                </div>
            </div>
        </div>

        <!-- 📅 VIEW: PROGRAM DAYS -->
        <div v-else-if="view === 'days'" class="program-days reveal">
            <h1 class="title">{{ t(selectedProgram, 'name') }}</h1>
            <p class="subtitle mb-4">{{ t(selectedProgram, 'description') }}</p>

            <div class="day-list">
                <div v-for="day in selectedProgram.days" :key="day.id" class="day-card" 
                     :class="{ 'rest-day': day.exercises.length === 0 }"
                     @click="selectDay(day)">
                    <div class="day-info">
                        <h4>{{ t(day, 'name') }}</h4>
                        <p v-if="day.exercises.length > 0">⚡ {{ day.exercises.length }} Mashqlar</p>
                        <p v-else>🧘 Dam olish va tiklanish</p>
                    </div>
                    <div v-if="day.exercises.length > 0" class="arrow">→</div>
                    <div v-else class="rest-icon">✨</div>
                </div>
            </div>
        </div>

        <!-- 🏋️ VIEW: DAY EXERCISES -->
        <div v-else-if="view === 'exercises'" class="day-exercises reveal">
            <h1 class="title">{{ t(selectedDay, 'name') }}</h1>
            <p class="subtitle">{{ t(selectedProgram, 'name') }} • {{ selectedDay.exercises.length }} Exercises</p>

            <!-- START BUTTON -->
            <button v-if="selectedDay.exercises.length > 0" class="btn-primary w-100 py-3 mb-4 mt-2" @click="startTraining">
                🚀 {{ $t('programs.start_session') }}
            </button>

            <!-- EXERCISE LIST -->
            <div class="exercise-list-small">
                <div v-for="ex in selectedDay.exercises" :key="ex.id" class="ex-small-item">
                    <NuxtImg :src="getMediaUrl(ex.img)" />
                    <div class="ex-small-info">
                        <h5>{{ t(ex, 'name') }}</h5>
                        <p>{{ ex.difficulty }} • {{ ex.duration }}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFitness } from '~/composables/useFitness'
import { useLocalized } from '~/composables/useLocalized'
import { useApi } from '~/composables/useApi'

const router = useRouter()
const fitness = useFitness()
const { t } = useLocalized()
const { getMediaUrl } = useApi()

/* DATA FROM COMPOSABLE */
const programs = computed(() => fitness.programs.value)

// SEO Optimization
useSeoMeta({
  title: 'Training Programs - Sector-O',
  ogTitle: 'Training Programs - Sector-O',
  description: 'Choose a professional training program tailored to your fitness level at Sector-O.',
  ogDescription: 'Choose a professional training program tailored to your fitness level at Sector-O.',
});

/* NAVIGATION STATE */
const view = ref('list') // 'list', 'days', 'exercises'
const selectedProgram = ref(null)
const selectedDay = ref(null)

/* METHODS */
function selectProgram(program) {
    selectedProgram.value = program
    view.value = 'days'
    triggerReveal()
}

function selectDay(day) {
    if (day.exercises.length === 0) return // Rest day
    selectedDay.value = day
    view.value = 'exercises'
    triggerReveal()
}

function goBack() {
    if (view.value === 'exercises') view.value = 'days'
    else if (view.value === 'days') view.value = 'list'
    triggerReveal()
}

function startTraining() {
    // Save current session data to localStorage for the training page
    const sessionData = {
        programId: selectedProgram.value.id,
        programName: t(selectedProgram.value, 'name'),
        dayId: selectedDay.value.id,
        dayName: t(selectedDay.value, 'name'),
        exercises: selectedDay.value.exercises
    }
    localStorage.setItem('active_session', JSON.stringify(sessionData))
    router.push('/training')
}

/* ANIMATION */
function triggerReveal() {
    nextTick(() => {
        const reveals = document.querySelectorAll('.reveal')
        reveals.forEach(el => el.classList.add('active'))
    })
}

onMounted(() => {
    // Initial reveals
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active')
            }
        })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))
})
</script>

<style scoped>
@import "~/assets/css/programs.css";

/* Nuxt 3 doesn't auto-import CSS in script, but it is imported globally or we use this style tag */
.btn-primary {
    background: #00CFFF;
    border: none;
    color: black;
    font-weight: 800;
    text-transform: uppercase;
    border-radius: 16px;
    letter-spacing: 1px;
}
</style>