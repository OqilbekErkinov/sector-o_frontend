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
            <div v-for="program in allPrograms" :key="program.id" class="program-card reveal" @click="selectProgram(program)">
                <NuxtImg v-if="program.img" :src="getMediaUrl(program.img)" loading="lazy" />
                <div v-else class="program-card-fallback">
                    <span>{{ (t(program, 'name') || '?').charAt(0).toUpperCase() }}</span>
                </div>
                <div v-if="program.isActive" class="badge active-badge">{{ $t('programs.active_badge') }}</div>
                <div v-else-if="program.isMine" class="badge mine">{{ $t('programs.mine_badge') }}</div>
                <div v-else-if="program.level" class="badge" :class="program.level.toLowerCase()">{{ program.level }}</div>
                <div class="overlay">
                    <h3>{{ t(program, 'name') }}</h3>
                    <p>
                        <template v-if="program.duration">{{ program.duration }} • </template>
                        {{ $t('programs.days', { count: program.days.length }) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- 📅 VIEW: PROGRAM DAYS -->
        <div v-else-if="view === 'days'" class="program-days reveal">
            <h1 class="title">{{ t(selectedProgram, 'name') }}</h1>
            <p v-if="t(selectedProgram, 'description')" class="subtitle mb-4">{{ t(selectedProgram, 'description') }}</p>

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
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFitness } from '~/composables/useFitness'
import { useLocalized } from '~/composables/useLocalized'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useUserProgram } from '~/composables/useUserProgram'

const router = useRouter()
const fitness = useFitness()
const { t } = useLocalized()
const { getMediaUrl } = useApi()
const { isLoggedIn } = useAuth()
const userProgram = useUserProgram()

/* DATA FROM COMPOSABLE */
const catalogPrograms = computed(() => fitness.programs.value)

// The user's own programs, built/copied in the tracking → "Dastur" tab.
// Fetched here so they show on this page alongside the admin catalog and can
// be run through the exact same days → exercises → session flow.
const myProgramsRaw = ref([])

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

/* USER PROGRAMS → CATALOG SHAPE
   A UserProgramExercise only stores a name + an optional catalog Exercise id.
   Resolve that id to the full Exercise so the session player (training.vue)
   gets the same media/description/difficulty an admin program provides;
   freeform entries fall back to a name-only stub the player tolerates. */
function resolveUserExercise(ue) {
  const full = ue.exercise ? fitness.exercises.value.find(e => e.id === ue.exercise) : null
  if (full) return full
  return {
    id: `up-ex-${ue.id}`,
    name: ue.name, name_uz: ue.name, name_ru: ue.name, name_en: ue.name,
    img: null, video: null, duration: '', difficulty: '',
    description_uz: '', description_ru: '', description_en: '',
  }
}

const myPrograms = computed(() =>
  myProgramsRaw.value
    .map(p => ({
      id: `user-${p.id}`,
      isMine: true,
      isActive: !!p.is_active,
      // `name` (plus the *_uz/_ru/_en aliases) so useLocalized's t() resolves
      // it the same way it does a catalog program's name_* fields.
      name: p.name, name_uz: p.name, name_ru: p.name, name_en: p.name,
      description_uz: '', description_ru: '', description_en: '',
      level: null,
      duration: '',
      img: p.img || null,
      days: p.days.map(d => ({
        id: d.id,
        name: d.name, name_uz: d.name, name_ru: d.name, name_en: d.name,
        exercises: d.exercises.map(resolveUserExercise),
      })),
    }))
    // The active program is always pinned to the top of the list.
    .sort((a, b) => Number(b.isActive) - Number(a.isActive))
)

// User's own programs first, then the admin catalog.
const allPrograms = computed(() => [...myPrograms.value, ...catalogPrograms.value])

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
function activateReveals() {
    if (!import.meta.client) return
    document.querySelectorAll('.reveal:not(.active)').forEach(el => el.classList.add('active'))
}

function triggerReveal() {
    nextTick(activateReveals)
}

// User programs arrive from the API *after* the initial reveal pass, so their
// freshly-rendered `.reveal` cards would otherwise stay stuck at opacity:0
// (the slot is laid out, the card is invisible). Re-run the reveal whenever
// the merged list changes.
watch(allPrograms, () => nextTick(activateReveals))

onMounted(async () => {
    if (isLoggedIn.value) {
        try {
            myProgramsRaw.value = await userProgram.fetchPrograms()
        } catch {
            myProgramsRaw.value = []
        }
    }

    await nextTick()
    activateReveals()
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

/* User programs have no cover image — a branded initial tile stands in so
   the card still reads at a glance in the same grid as catalog programs. */
.program-card-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(140deg, #1c2b30 0%, #0c1417 60%, #00323f 100%);
    border-radius: 20px;
}

.program-card-fallback span {
    font-family: 'Gropled', sans-serif;
    font-size: 72px;
    color: rgba(0, 207, 255, 0.55);
    text-shadow: 0 0 24px rgba(0, 207, 255, 0.35);
}

.badge.mine {
    background: rgba(0, 207, 255, 0.9);
    color: #04222c;
}

.badge.active-badge {
    background: linear-gradient(135deg, #00CFFF, #00e0b8);
    color: #04222c;
    box-shadow: 0 0 14px rgba(0, 207, 255, 0.45);
}
</style>
