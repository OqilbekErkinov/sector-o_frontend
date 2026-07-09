<template>
  <div class="nutrition-page container py-4">
    <header class="reveal">
      <h1>{{ $t('calculator.title') }}</h1>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// SEO Optimization
useSeoMeta({
  title: 'Calculator - Sector-O',
  ogTitle: 'Calculator - Sector-O',
  description: 'Calculate your daily calories and BMI with Sector-O.',
  ogDescription: 'Calculate your daily calories and BMI with Sector-O.',
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
