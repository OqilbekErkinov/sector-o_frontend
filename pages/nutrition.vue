<template>
  <div class="nutrition-page container py-4">
    <header class="reveal">
      <h1>{{ $t('nutrition.title') }}</h1>
      <p class="subtitle">{{ $t('nutrition.subtitle') }}</p>
    </header>

    <!-- 📊 CALORIE CALCULATOR -->
    <section class="section reveal">
      <h2>⚡ {{ $t('nutrition.calorie_calculator') }}</h2>
      <div class="glass-card">
        <div class="row g-3">
          <div class="col-6">
            <label class="input-label">{{ $t('nutrition.gender') }}</label>
            <select v-model="gender">
              <option value="male">{{ $t('nutrition.male') }}</option>
              <option value="female">{{ $t('nutrition.female') }}</option>
            </select>
          </div>
          <div class="col-6">
            <label class="input-label">{{ $t('nutrition.age') }}</label>
            <input v-model.number="age" type="number" placeholder="25" />
          </div>
          <div class="col-6">
            <label class="input-label">{{ $t('nutrition.weight') }}</label>
            <input v-model.number="weight" type="number" placeholder="70" />
          </div>
          <div class="col-6">
            <label class="input-label">{{ $t('nutrition.height') }}</label>
            <input v-model.number="height" type="number" placeholder="175" />
          </div>
          <div class="col-12">
            <label class="input-label">{{ $t('nutrition.activity') }}</label>
            <select v-model="activityLevel">
              <option value="1.2">{{ $t('nutrition.sedentary') }}</option>
              <option value="1.375">{{ $t('nutrition.lightly_active') }}</option>
              <option value="1.55">{{ $t('nutrition.moderately_active') }}</option>
              <option value="1.725">{{ $t('nutrition.very_active') }}</option>
              <option value="1.9">{{ $t('nutrition.extra_active') }}</option>
            </select>
          </div>
          <div class="col-12">
            <label class="input-label">{{ $t('nutrition.goal') }}</label>
            <select v-model="goal">
              <option value="maintain">{{ $t('nutrition.maintain') }}</option>
              <option value="lose">{{ $t('nutrition.lose') }}</option>
              <option value="gain">{{ $t('nutrition.gain') }}</option>
            </select>
          </div>
        </div>
        <button class="btn-calc primary mt-4" @click="calculateCalories">
          {{ $t('nutrition.calculate') }}
        </button>

        <div v-if="calories" class="result text-center mt-3">
          <span style="font-size: 24px;">{{ $t('nutrition.calories_result', { calories: calories }) }}</span>
        </div>
      </div>
    </section>

    <!-- ⚖️ BMI CALCULATOR -->
    <section class="section reveal">
      <h2>🚀 {{ $t('nutrition.bmi_calculator') }}</h2>
      <div class="glass-card">
        <button class="btn-calc secondary" @click="calculateBMI">
          {{ $t('nutrition.calculate_bmi') }}
        </button>

        <div v-if="bmi" class="bmi-meter-container text-center">
          <div style="font-size: 28px; font-weight: 800; color: #00CFFF;">{{ bmi }}</div>
          <div style="font-size: 16px; margin-bottom: 15px;">{{ $t(`nutrition.bmi_status.${bmiStatus}`) }}</div>
          <div class="bmi-bar">
            <div class="bmi-segment under"></div>
            <div class="bmi-segment normal"></div>
            <div class="bmi-segment over"></div>
            <div class="bmi-segment obese"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🍎 DAILY DIET -->
    <section class="section reveal">
      <h2>🥗 {{ $t('nutrition.daily_diet') }}</h2>
      <div class="diet-grid">
        <template v-if="fitness.loading.value">
          <Skeleton v-for="i in 4" :key="i" height="120px" borderRadius="15px" style="margin-bottom: 12px" />
        </template>
        <template v-else>
          <div v-for="(item, i) in diets" :key="i" class="diet-card reveal">
            <div class="diet-icon">{{ item.icon }}</div>
            <div class="diet-info">
              <h4>{{ t(item, 'title') }}</h4>
              <p>{{ t(item, 'description') }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- SUPPLEMENTS (DYNAMIC) -->
    <!-- <section class="supplements-section container">
      <div class="section-title">
        <h3>{{ $t('nutrition.supplements') }}</h3>
      </div>
      <div class="supplements-grid">
        <div v-for="(sup, i) in supplements" :key="i" class="supplement-card reveal">
          <div class="sup-img-wrapper">
            <NuxtImg v-if="sup.img" :src="getMediaUrl(sup.img)" class="sup-img" />
            <div v-else class="sup-placeholder">💊</div>
          </div>
          <h4>{{ t(sup, 'name') }}</h4>
          <p>{{ t(sup, 'benefits') }}</p>
        </div>
      </div>
    </section> -->

    <!-- 🎯 FITNESS GOALS -->
    <section class="section reveal">
      <h2>🏆 {{ $t('nutrition.choose_goal') }}</h2>
      <div class="goal-tabs">
        <div class="goal-tab" :class="{ active: selectedGoalKey === 'mass_gain' }" @click="selectedGoalKey = 'mass_gain'">
          {{ $t('nutrition.mass_gain.title') }}
        </div>
        <div class="goal-tab" :class="{ active: selectedGoalKey === 'fat_loss' }" @click="selectedGoalKey = 'fat_loss'">
          {{ $t('nutrition.fat_loss.title') }}
        </div>
        <div class="goal-tab" :class="{ active: selectedGoalKey === 'maintenance' }" @click="selectedGoalKey = 'maintenance'">
          {{ $t('nutrition.maintenance.title') }}
        </div>
      </div>
      <div class="glass-card p-3">
        <p class="mb-0" style="font-size: 14px; color: #ccc;">{{ $t(`nutrition.${selectedGoalKey}.desc`) }}</p>
      </div>
    </section>

    <!-- 💊 SUPPLEMENTS (DYNAMIC) -->
    <section class="section reveal" v-if="supplements.length > 0 || fitness.loading.value">
      <h2>💊 {{ $t('nutrition.supplements') }}</h2>
      <div class="row g-3">
        <template v-if="fitness.loading.value">
           <div class="col-12" v-for="i in 3" :key="'sup'+i">
             <Skeleton height="80px" borderRadius="12px" />
           </div>
        </template>
        <template v-else>
          <div class="col-12" v-for="s in supplements" :key="s.id">
            <div class="glass-card p-3 mb-0">
              <h3 style="font-size: 16px; color: #00CFFF;">{{ t(s, 'name') }}</h3>
              <p style="font-size: 13px; color: #999; margin: 0;">{{ t(s, 'benefits') }}</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- 🌟 PREMIUM PROMO -->
    <!-- <section class="reveal">
      <div class="premium-promo">
        <h3>{{ $t('nutrition.personal_plan') }}</h3>
        <p>{{ $t('nutrition.custom_meal_plans') }}</p>
        <button class="btn-calc primary w-100">{{ $t('nutrition.unlock_premium') }}</button>
      </div>
    </section> -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFitness } from '~/composables/useFitness';
import { useLocalized } from '~/composables/useLocalized';
import { useApi } from '~/composables/useApi';

const fitness = useFitness();
const { t } = useLocalized();
const { getMediaUrl } = useApi();

const diets = computed(() => fitness.diets.value);
const supplements = computed(() => fitness.supplements.value);

// SEO Optimization
useSeoMeta({
  title: 'Nutrition & Diet - Sector-O',
  ogTitle: 'Nutrition & Diet - Sector-O',
  description: 'Calculate your calories and get personalized diet recommendations from Sector-O.',
  ogDescription: 'Calculate your calories and get personalized diet recommendations from Sector-O.',
});

const gender = ref("male")
const weight = ref(70)
const height = ref(175)
const age = ref(25)
const activityLevel = ref("1.2")
const goal = ref("maintain")

const calories = ref(null)
const bmi = ref(null)
const bmiStatus = ref("")
const selectedGoalKey = ref("maintenance")

function calculateCalories() {
  if (!weight.value || !height.value || !age.value) return

  // Mifflin-St Jeor Formula
  let bmrValue = 10 * weight.value + 6.25 * height.value - 5 * age.value
  if (gender.value === "male") bmrValue += 5
  else bmrValue -= 161

  let totalCalories = bmrValue * parseFloat(activityLevel.value)

  if (goal.value === "gain") totalCalories += 300
  if (goal.value === "lose") totalCalories -= 400

  calories.value = Math.round(totalCalories)
}

function calculateBMI() {
  if (!weight.value || !height.value) return

  let h = height.value / 100
  let value = weight.value / (h * h)

  bmi.value = parseFloat(value.toFixed(1))

  if (value < 18.5) bmiStatus.value = "underweight"
  else if (value < 25) bmiStatus.value = "normal"
  else if (value < 30) bmiStatus.value = "overweight"
  else bmiStatus.value = "obese"
}

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

/* Extra layout fixes if needed */
.row {
  display: flex;
  flex-wrap: wrap;
}
</style>
