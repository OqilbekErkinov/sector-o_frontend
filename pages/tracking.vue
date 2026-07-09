<template>
  <div class="tracking-page container">
    <header class="tracking-header">
      <button class="back-button" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1>{{ $t('tracking.title') }}</h1>
    </header>

    <div class="goal-tabs">
      <div class="goal-tab" :class="{ active: activeTab === 'workout' }" @click="activeTab = 'workout'">
        {{ $t('tracking.tab_workout') }}
      </div>
      <div class="goal-tab" :class="{ active: activeTab === 'nutrition' }" @click="activeTab = 'nutrition'">
        {{ $t('tracking.tab_nutrition') }}
      </div>
      <div class="goal-tab" :class="{ active: activeTab === 'program' }" @click="activeTab = 'program'">
        {{ $t('tracking.tab_program') }}
      </div>
    </div>

    <!-- ═══════════ WORKOUT TAB ═══════════ -->
    <section v-if="activeTab === 'workout'">
      <div class="glass-card">
        <div class="day-picker-row">
          <input type="date" v-model="formDate" :max="today" class="date-input" @change="loadLogForDate(formDate)" />
          <span v-if="editingLogId && isEditingForm" class="editing-tag">{{ $t('tracking.editing_tag') }}</span>
        </div>

        <div v-if="showProgramDayPrompt" class="muscle-picker">
          <p class="muscle-picker-title">{{ $t('tracking.program_which_day_today') }}</p>
          <div class="muscle-chips">
            <button
              v-for="d in activeProgram.days"
              :key="d.id"
              class="muscle-chip"
              :disabled="daysCompletedThisWeek.has(d.id)"
              @click="applyProgramDay(d)"
            >
              {{ d.name }}<template v-if="daysCompletedThisWeek.has(d.id)"> ✓</template>
            </button>
          </div>
          <p v-if="daysCompletedThisWeek.size > 0" class="comparison-range">{{ $t('tracking.program_day_done_hint') }}</p>
          <button class="btn-cancel-pending" @click="programPromptDismissed = true">{{ $t('tracking.program_pick_manually') }}</button>
        </div>

        <!-- VIEW MODE: today's log is already saved — show a compact,
             read-only summary instead of the full editable form. -->
        <template v-if="editingLogId && !isEditingForm">
          <div class="view-mode-header">
            <span class="saved-badge">✓ {{ $t('tracking.workout_saved') }}</span>
            <button class="icon-btn" @click="isEditingForm = true" :aria-label="$t('tracking.edit')">✎ {{ $t('tracking.edit') }}</button>
          </div>
          <div v-for="(exercise, exIdx) in exercises" :key="exIdx" class="history-exercise">
            <div class="history-exercise-title">
              <strong>{{ exercise.name }}</strong>
              <span class="muscle-badge">{{ muscleLabel(exercise.muscle_group) }}</span>
            </div>
            <div class="history-sets">
              <span v-for="(set, setIdx) in exercise.sets" :key="setIdx" class="history-set-chip">{{ set.weight_kg }}kg × {{ set.reps }}</span>
            </div>
          </div>
        </template>

        <!-- EDIT MODE: full editable form — for a blank new day, or when
             "✎ Tahrirlash" was pressed on the view above. -->
        <template v-else>
          <div v-if="exercises.length === 0" class="empty-hint">
            {{ $t('tracking.workout_no_exercises') }}
          </div>

          <div v-for="(exercise, exIdx) in exercises" :key="exIdx" class="exercise-card">
            <div class="exercise-card-header">
              <span class="exercise-name">
                {{ exercise.name }}
                <button
                  class="muscle-badge"
                  :class="{ unset: !isValidMuscle(exercise.muscle_group) }"
                  @click="editingMuscleForIdx = editingMuscleForIdx === exIdx ? null : exIdx"
                >
                  {{ isValidMuscle(exercise.muscle_group) ? muscleLabel(exercise.muscle_group) : $t('tracking.workout_pick_muscle') }}
                </button>
              </span>
              <button class="icon-btn danger" @click="removeExercise(exIdx)" :aria-label="$t('tracking.workout_remove_exercise')">✕</button>
            </div>

            <div v-if="editingMuscleForIdx === exIdx" class="muscle-chips inline">
              <button v-for="mg in MUSCLE_GROUPS" :key="mg" class="muscle-chip" @click="setExerciseMuscle(exIdx, mg)">
                {{ muscleLabel(mg) }}
              </button>
            </div>

            <div v-if="exercise.sets.length" class="set-row set-row-header">
              <span class="set-index"></span>
              <span class="set-col-label">{{ $t('tracking.workout_weight_kg') }}</span>
              <span class="set-col-label">{{ $t('tracking.workout_reps') }}</span>
              <span class="set-index"></span>
            </div>
            <div v-for="(set, setIdx) in exercise.sets" :key="setIdx" class="set-row">
              <span class="set-index">{{ $t('tracking.workout_set') }} {{ setIdx + 1 }}</span>
              <input type="number" min="0" step="0.5" v-model.number="set.weight_kg" :placeholder="$t('tracking.workout_weight_kg')" />
              <input type="number" min="0" step="1" v-model.number="set.reps" :placeholder="$t('tracking.workout_reps')" />
              <button class="icon-btn" @click="removeSet(exIdx, setIdx)" aria-label="remove set">✕</button>
            </div>
            <button class="btn-add-set" @click="addSet(exIdx)">{{ $t('tracking.workout_add_set') }}</button>
          </div>

          <p v-if="missingMuscleCount > 0" class="muscle-warning">
            {{ $t('tracking.workout_missing_muscle', { count: missingMuscleCount }) }}
          </p>
          <p v-else-if="invalidSetsCount > 0" class="muscle-warning">
            {{ $t('tracking.workout_invalid_sets', { count: invalidSetsCount }) }}
          </p>

          <!-- Exercise picker -->
          <div class="exercise-picker" v-if="!pendingExercise">
            <input
              v-model="exerciseSearch"
              type="text"
              :placeholder="$t('tracking.workout_search_placeholder')"
              @focus="showResults = true"
            />
            <div v-if="showResults && exerciseSearch.trim()" class="picker-results">
              <div
                v-for="ex in matchingExercises"
                :key="ex.id"
                class="picker-result"
                @click="pendingExercise = { exercise: ex.id, name: t(ex, 'name') }"
              >
                {{ t(ex, 'name') }}
              </div>
              <div v-if="matchingExercises.length === 0" class="picker-result custom" @click="pendingExercise = { exercise: null, name: exerciseSearch.trim() }">
                {{ $t('tracking.workout_add_custom', { name: exerciseSearch.trim() }) }}
              </div>
            </div>
          </div>

          <!-- Muscle group picker (step 2 — always required) -->
          <div v-else class="muscle-picker">
            <p class="muscle-picker-title">{{ pendingExercise.name }} — {{ $t('tracking.workout_pick_muscle') }}</p>
            <div class="muscle-chips">
              <button v-for="mg in MUSCLE_GROUPS" :key="mg" class="muscle-chip" @click="confirmAddExercise(mg)">
                {{ muscleLabel(mg) }}
              </button>
            </div>
            <button class="btn-cancel-pending" @click="cancelPendingExercise">{{ $t('tracking.workout_cancel') }}</button>
          </div>

          <button
            class="btn-calc primary mt-3"
            :disabled="saving || exercises.length === 0 || invalidSetsCount > 0"
            @click="saveWorkoutDay"
          >
            {{ saving ? '...' : $t('tracking.workout_save_day') }}
          </button>
        </template>
        <p v-if="savedMessage" class="saved-msg">{{ savedMessage }}</p>
      </div>

      <div class="period-toggle">
        <button :class="{ active: workoutPeriod === 'week' }" @click="workoutPeriod = 'week'">{{ $t('tracking.period_week') }}</button>
        <button :class="{ active: workoutPeriod === 'month' }" @click="workoutPeriod = 'month'">{{ $t('tracking.period_month') }}</button>
      </div>

      <div class="week-nav" v-if="workoutPeriod === 'week'">
        <button class="week-nav-btn" @click="goToPreviousWeek" aria-label="previous week">◀</button>
        <span class="week-nav-label">{{ weekAnchorMonday }} → {{ weekAnchorSunday }}</span>
        <button class="week-nav-btn" :disabled="isCurrentWeek" @click="goToNextWeek" aria-label="next week">▶</button>
      </div>

      <div class="stats-row" v-if="workoutSummary">
        <div class="stat-card">
          <span class="stat-value">{{ workoutSummary.total_workout_days }}</span>
          <span class="stat-label">{{ $t('tracking.workout_stats_days') }}</span>
        </div>
        <div class="stat-card" v-if="workoutSummary.program_adherence">
          <span class="stat-value">{{ workoutSummary.program_adherence.completed_days }}/{{ workoutSummary.program_adherence.target_days }}</span>
          <span class="stat-label">{{ workoutSummary.program_adherence.program_name }}</span>
        </div>
      </div>

      <div class="glass-card chart-card" v-if="workoutSummary">
        <h3 class="chart-title">{{ $t('tracking.workout_chart_title') }}</h3>
        <ClientOnly>
          <Bar :data="muscleChartData" :options="muscleChartOptions" />
        </ClientOnly>
        <ul class="chart-data-list">
          <li v-for="mg in MUSCLE_GROUPS" :key="mg">
            <span>{{ muscleLabel(mg) }}</span>
            <strong>{{ workoutSummary.sets_by_muscle[mg] || 0 }}</strong>
          </li>
        </ul>
      </div>

      <div class="glass-card" v-if="comparison">
        <h3 class="chart-title">{{ $t('tracking.comparison_title') }}</h3>
        <p class="comparison-range">{{ comparison.this_week_start }} → {{ comparison.this_week_end }} vs {{ comparison.last_week_start }} → {{ comparison.last_week_end }}</p>

        <div v-if="comparison.exercises.length === 0" class="empty-hint">
          {{ $t('tracking.comparison_empty') }}
        </div>

        <div v-for="group in groupedComparison" :key="group.dayName || 'manual'" class="comparison-day-group">
          <h4 v-if="group.dayName" class="comparison-day-title">{{ group.dayName }}</h4>
          <div v-for="ex in group.exercises" :key="ex.name" class="comparison-exercise">
            <div class="comparison-exercise-header">
              <strong>{{ ex.name }}</strong>
              <span class="muscle-badge">{{ muscleLabel(ex.muscle_group) }}</span>
            </div>
            <div v-for="s in ex.sets" :key="s.set_number" class="comparison-set-row">
              <div class="comparison-set-main">
                <span class="comparison-set-label">{{ $t('tracking.workout_set') }} {{ s.set_number }}</span>
                <span class="comparison-values">
                  <template v-if="s.previous_weight_kg !== null">{{ s.previous_weight_kg }}kg×{{ s.previous_reps }} → </template>
                  <strong>{{ s.current_weight_kg }}kg</strong> × {{ s.current_reps }}
                </span>
                <span v-if="s.change_pct !== null" class="comparison-delta" :class="deltaClass(s.change_pct)">
                  {{ arrowFor(s.change_pct) }} {{ Math.abs(s.change_pct) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <h3 class="chart-title">{{ $t('tracking.export_title') }}</h3>
        <div class="export-buttons">
          <button class="export-btn" :disabled="exporting" @click="handleExport('day')">{{ $t('tracking.export_day') }}</button>
          <button class="export-btn" :disabled="exporting" @click="handleExport('week')">{{ $t('tracking.export_week') }}</button>
          <button class="export-btn" :disabled="exporting" @click="handleExport('month')">{{ $t('tracking.export_month') }}</button>
          <button class="export-btn" :disabled="exporting" @click="handleExport('all')">{{ $t('tracking.export_all') }}</button>
        </div>
      </div>

      <div class="history-section" v-if="pastWorkoutLogs.length">
        <h3 class="section-subtitle">{{ $t('tracking.history') }}</h3>
        <div v-for="log in pastWorkoutLogs" :key="log.id" class="history-day-card">
          <div class="history-day-header-row">
            <button class="history-day-header" @click="toggleHistoryWorkoutDay(log.id)">
              <span>{{ log.date }}</span>
              <span class="history-day-meta">{{ log.exercises.length }} {{ $t('tracking.exercises_count') }}</span>
            </button>
            <button class="icon-btn" @click="editHistoryWorkoutDay(log)" :aria-label="$t('tracking.edit')">✎</button>
            <button class="icon-btn danger" @click="deleteHistoryWorkoutDay(log)" :aria-label="$t('tracking.delete')">🗑</button>
          </div>
          <div v-if="expandedWorkoutDay === log.id" class="history-day-body">
            <div v-for="ex in log.exercises" :key="ex.id" class="history-exercise">
              <div class="history-exercise-title">
                <strong>{{ ex.name }}</strong>
                <span class="muscle-badge">{{ muscleLabel(ex.muscle_group) }}</span>
              </div>
              <div class="history-sets">
                <span v-for="s in ex.sets" :key="s.id" class="history-set-chip">{{ s.weight_kg }}kg × {{ s.reps }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ NUTRITION TAB ═══════════ -->
    <section v-else-if="activeTab === 'nutrition'">
      <div class="glass-card">
        <div class="nutrition-header-row">
          <h3 class="day-label">{{ $t('tracking.today') }} — {{ today }}</h3>
          <button class="goal-edit-link" @click="openGoalEditor">🎯 {{ $t('tracking.nutrition_goal_edit_btn') }}</button>
        </div>

        <div v-if="goalEditorOpen" class="goal-editor">
          <div class="food-form-row">
            <input v-model.number="goalForm.calories" type="number" min="0" :placeholder="$t('tracking.nutrition_goal_calories_label')" />
            <input v-model.number="goalForm.protein_g" type="number" min="0" :placeholder="$t('tracking.nutrition_goal_protein_label')" />
          </div>
          <div class="food-form-row">
            <input v-model.number="goalForm.carbs_g" type="number" min="0" :placeholder="$t('tracking.nutrition_goal_carbs_label')" />
            <input v-model.number="goalForm.fat_g" type="number" min="0" :placeholder="$t('tracking.nutrition_goal_fat_label')" />
          </div>
          <div class="goal-editor-actions">
            <button class="btn-calc secondary" @click="goalEditorOpen = false">{{ $t('tracking.nutrition_goal_cancel') }}</button>
            <button class="btn-calc primary" :disabled="savingGoal" @click="saveGoal">{{ savingGoal ? '...' : $t('tracking.nutrition_goal_save') }}</button>
          </div>
        </div>

        <div class="macro-summary-bar" v-if="todayNutrition.length">
          <div class="macro-chip">
            <span class="macro-chip-value">{{ todayTotals.fat_g }}</span>
            <span class="macro-chip-label">{{ $t('tracking.nutrition_fat') }}</span>
          </div>
          <div class="macro-chip">
            <span class="macro-chip-value">{{ todayTotals.carbs_g }}</span>
            <span class="macro-chip-label">{{ $t('tracking.nutrition_carbs') }}</span>
          </div>
          <div class="macro-chip">
            <span class="macro-chip-value">{{ todayTotals.protein_g }}</span>
            <span class="macro-chip-label">{{ $t('tracking.nutrition_protein') }}</span>
          </div>
          <div class="macro-chip" v-if="hasCalorieGoal">
            <span class="macro-chip-value">{{ calGoalPct(todayTotals.calories) }}%</span>
            <span class="macro-chip-label">{{ $t('tracking.nutrition_goal_pct_label') }}</span>
          </div>
          <div class="macro-chip highlight">
            <span class="macro-chip-value">{{ todayTotals.calories }}<template v-if="hasCalorieGoal">/{{ auth.user.value.goal_calories }}</template></span>
            <span class="macro-chip-label">{{ $t('tracking.nutrition_calories_short') }}</span>
          </div>
        </div>

        <div v-if="todayNutrition.length === 0" class="empty-hint">
          {{ $t('tracking.nutrition_no_entries') }}
        </div>

        <div v-for="group in todayMealGroups" :key="group.type" class="meal-group">
          <div class="meal-group-header">
            <span class="meal-group-icon">{{ mealIcon(group.type) }}</span>
            <span class="meal-group-name">{{ mealLabel(group.type) }}</span>
            <span class="meal-group-total">
              {{ group.totalCalories }} {{ $t('tracking.nutrition_calories_short') }}
              <template v-if="hasCalorieGoal"> · {{ calGoalPct(group.totalCalories) }}%</template>
            </span>
          </div>
          <div v-for="entry in group.entries" :key="entry.id" class="food-row">
            <div class="food-info">
              <span class="food-name">{{ entry.name }}</span>
              <span class="food-macros">
                {{ entry.fat_g }}F · {{ entry.carbs_g }}C · {{ entry.protein_g }}P
                <template v-if="hasCalorieGoal"> · {{ calGoalPct(entry.calories) }}%</template>
              </span>
            </div>
            <span class="food-calories">{{ entry.calories }}</span>
            <button class="icon-btn" @click="startEditFood(entry)" aria-label="edit food">✎</button>
            <button class="icon-btn danger" @click="removeFood(entry.id)" aria-label="remove food">✕</button>
          </div>
        </div>

        <div class="food-form">
          <span v-if="editingFoodId" class="editing-tag">{{ $t('tracking.editing_tag') }}</span>
          <input v-model="foodForm.name" type="text" :placeholder="$t('tracking.nutrition_food_name')" />

          <div class="custom-select" :class="{ open: mealDropdownOpen }">
            <button
              type="button" class="custom-select-trigger"
              :aria-label="$t('tracking.nutrition_meal_type_label')"
              @click="mealDropdownOpen = !mealDropdownOpen"
            >
              <span>{{ mealIcon(foodForm.meal_type) }} {{ mealLabel(foodForm.meal_type) }}</span>
              <span class="custom-select-chevron" :class="{ open: mealDropdownOpen }">⌄</span>
            </button>
            <div v-if="mealDropdownOpen" class="custom-select-backdrop" @click="mealDropdownOpen = false"></div>
            <div v-if="mealDropdownOpen" class="custom-select-menu">
              <button
                v-for="mt in MEAL_TYPES" :key="mt" type="button"
                class="custom-select-option" :class="{ selected: mt === foodForm.meal_type }"
                @click="foodForm.meal_type = mt; mealDropdownOpen = false"
              >
                <span class="custom-select-option-icon">{{ mealIcon(mt) }}</span>
                {{ mealLabel(mt) }}
              </button>
            </div>
          </div>

          <div class="food-form-row">
            <input v-model.number="foodForm.calories" type="number" min="0" :placeholder="$t('tracking.nutrition_calories')" />
            <input v-model.number="foodForm.protein_g" type="number" min="0" :placeholder="$t('tracking.nutrition_protein')" />
          </div>
          <div class="food-form-row">
            <input v-model.number="foodForm.carbs_g" type="number" min="0" :placeholder="$t('tracking.nutrition_carbs')" />
            <input v-model.number="foodForm.fat_g" type="number" min="0" :placeholder="$t('tracking.nutrition_fat')" />
          </div>
          <div v-if="editingFoodId" class="goal-editor-actions">
            <button class="btn-calc secondary" @click="cancelEditFood">{{ $t('common.cancel') }}</button>
            <button class="btn-calc primary" :disabled="addingFood || !foodForm.name || !foodForm.calories" @click="addFood">
              {{ addingFood ? '...' : $t('common.save') }}
            </button>
          </div>
          <button v-else class="btn-calc primary mt-2" :disabled="addingFood || !foodForm.name || !foodForm.calories" @click="addFood">
            {{ addingFood ? '...' : $t('tracking.nutrition_add_btn') }}
          </button>
        </div>
      </div>

      <div class="period-toggle">
        <button :class="{ active: nutritionPeriod === 'week' }" @click="nutritionPeriod = 'week'">{{ $t('tracking.period_week') }}</button>
        <button :class="{ active: nutritionPeriod === 'month' }" @click="nutritionPeriod = 'month'">{{ $t('tracking.period_month') }}</button>
      </div>

      <div class="stats-row" v-if="nutritionSummary">
        <div class="stat-card">
          <span class="stat-value">{{ nutritionSummary.total_calories }}</span>
          <span class="stat-label">{{ $t('tracking.nutrition_stats_calories') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ nutritionSummary.avg_calories_per_logged_day }}</span>
          <span class="stat-label">{{ $t('tracking.nutrition_stats_avg') }}</span>
        </div>
      </div>

      <div class="glass-card chart-card" v-if="nutritionSummary">
        <h3 class="chart-title">{{ $t('tracking.nutrition_chart_calories') }}</h3>
        <ClientOnly>
          <Bar :data="caloriesChartData" :options="chartOptions" />
        </ClientOnly>
      </div>

      <div class="glass-card chart-card" v-if="nutritionSummary && hasMacroData">
        <h3 class="chart-title">{{ $t('tracking.nutrition_chart_macros') }}</h3>
        <ClientOnly>
          <Doughnut :data="macroChartData" :options="doughnutOptions" />
        </ClientOnly>
      </div>

      <div class="glass-card">
        <h3 class="chart-title">{{ $t('tracking.export_title') }}</h3>
        <div class="export-buttons">
          <button class="export-btn" :disabled="exportingNutrition" @click="handleNutritionExport('day')">{{ $t('tracking.export_day') }}</button>
          <button class="export-btn" :disabled="exportingNutrition" @click="handleNutritionExport('week')">{{ $t('tracking.export_week') }}</button>
          <button class="export-btn" :disabled="exportingNutrition" @click="handleNutritionExport('month')">{{ $t('tracking.export_month') }}</button>
          <button class="export-btn" :disabled="exportingNutrition" @click="handleNutritionExport('all')">{{ $t('tracking.export_all') }}</button>
        </div>
      </div>

      <div class="history-section" v-if="nutritionHistoryByDay.length">
        <h3 class="section-subtitle">{{ $t('tracking.history') }}</h3>
        <div v-for="day in nutritionHistoryByDay" :key="day.date" class="history-day-card">
          <button class="history-day-header" @click="toggleHistoryNutritionDay(day.date)">
            <span>{{ day.date }}</span>
            <span class="history-day-meta">{{ day.totalCalories }} {{ $t('tracking.nutrition_calories_short') }}</span>
          </button>
          <div v-if="expandedNutritionDay === day.date" class="history-day-body">
            <div v-for="group in day.mealGroups" :key="group.type" class="meal-group">
              <div class="meal-group-header">
                <span class="meal-group-icon">{{ mealIcon(group.type) }}</span>
                <span class="meal-group-name">{{ mealLabel(group.type) }}</span>
                <span class="meal-group-total">{{ group.totalCalories }} {{ $t('tracking.nutrition_calories_short') }}</span>
              </div>
              <div v-for="entry in group.entries" :key="entry.id" class="food-row">
                <div class="food-info">
                  <span class="food-name">{{ entry.name }}</span>
                  <span class="food-macros">{{ entry.fat_g }}F · {{ entry.carbs_g }}C · {{ entry.protein_g }}P</span>
                </div>
                <span class="food-calories">{{ entry.calories }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ PROGRAM TAB ═══════════ -->
    <section v-else>
      <div class="glass-card" v-if="!builderMode">
        <h3 class="chart-title">{{ $t('tracking.program_my_programs') }}</h3>

        <div v-if="myPrograms.length === 0" class="empty-hint">
          {{ $t('tracking.program_none_yet') }}
        </div>

        <div v-for="p in myPrograms" :key="p.id" class="program-card" :class="{ active: p.is_active }">
          <div class="program-card-header">
            <span class="program-name">{{ p.name }}</span>
            <span v-if="p.is_active" class="program-active-badge">{{ $t('tracking.program_active_badge') }}</span>
          </div>
          <div class="program-days-preview">{{ p.days.length }} {{ $t('tracking.program_days_count') }}: {{ p.days.map(d => d.name).join(', ') }}</div>
          <div class="program-actions">
            <button v-if="!p.is_active" class="program-btn activate" @click="handleActivateProgram(p.id)">{{ $t('tracking.program_activate') }}</button>
            <div class="program-actions-row">
              <button class="program-btn edit" @click="openBuilderForEdit(p)">{{ $t('tracking.edit') }}</button>
              <button class="program-btn delete" @click="handleDeleteProgram(p.id)">{{ $t('tracking.delete') }}</button>
            </div>
          </div>
        </div>

        <button class="btn-calc primary mt-3" @click="openBuilderForNew">{{ $t('tracking.program_new') }}</button>
        <button class="btn-calc secondary mt-2" @click="showCatalogPicker = !showCatalogPicker">{{ $t('tracking.program_copy_from_catalog') }}</button>

        <div v-if="showCatalogPicker" class="picker-results mt-2">
          <div v-for="cp in fitness.programs.value" :key="cp.id" class="picker-result" @click="handleCopyFromCatalog(cp.id)">
            {{ t(cp, 'name') }}
          </div>
          <div v-if="fitness.programs.value.length === 0" class="picker-result">{{ $t('tracking.program_catalog_empty') }}</div>
        </div>
      </div>

      <!-- Builder -->
      <div class="glass-card" v-else>
        <h3 class="chart-title">{{ editingProgramId ? $t('tracking.program_edit_title') : $t('tracking.program_new_title') }}</h3>
        <input v-model="builderName" type="text" :placeholder="$t('tracking.program_name_placeholder')" class="mb-2" />

        <div v-for="(day, dayIdx) in builderDays" :key="dayIdx" class="exercise-card">
          <div class="exercise-card-header">
            <input v-model="day.name" type="text" :placeholder="$t('tracking.program_day_name_placeholder')" class="program-day-name-input" />
            <button class="icon-btn danger" @click="removeBuilderDay(dayIdx)" aria-label="remove day">✕</button>
          </div>

          <div v-for="(ex, exIdx) in day.exercises" :key="exIdx" class="program-exercise-row">
            <span>{{ ex.name }}</span>
            <button
              class="muscle-badge"
              :class="{ unset: !isValidMuscle(ex.muscle_group) }"
              @click="toggleBuilderMuscleEditor(dayIdx, exIdx)"
            >
              {{ isValidMuscle(ex.muscle_group) ? muscleLabel(ex.muscle_group) : $t('tracking.workout_pick_muscle') }}
            </button>
            <button class="icon-btn" @click="removeBuilderExercise(dayIdx, exIdx)" aria-label="remove exercise">✕</button>
          </div>
          <div
            v-if="editingBuilderMuscle && editingBuilderMuscle.dayIdx === dayIdx"
            class="muscle-chips inline"
          >
            <button v-for="mg in MUSCLE_GROUPS" :key="mg" class="muscle-chip" @click="setBuilderExerciseMuscle(mg)">
              {{ muscleLabel(mg) }}
            </button>
          </div>

          <div v-if="builderPicker.dayIdx === dayIdx">
            <div v-if="!builderPicker.pending" class="exercise-picker">
              <input v-model="builderPicker.search" type="text" :placeholder="$t('tracking.workout_search_placeholder')" />
              <div v-if="builderPicker.search.trim()" class="picker-results">
                <div
                  v-for="ex2 in builderMatchingExercises"
                  :key="ex2.id"
                  class="picker-result"
                  @click="selectBuilderPending(ex2.id, t(ex2, 'name'))"
                >
                  {{ t(ex2, 'name') }}
                </div>
                <div
                  v-if="builderMatchingExercises.length === 0"
                  class="picker-result custom"
                  @click="selectBuilderPending(null, builderPicker.search.trim())"
                >
                  {{ $t('tracking.workout_add_custom', { name: builderPicker.search.trim() }) }}
                </div>
              </div>
            </div>
            <div v-else class="muscle-picker">
              <p class="muscle-picker-title">{{ builderPicker.pending.name }} — {{ $t('tracking.workout_pick_muscle') }}</p>
              <div class="muscle-chips">
                <button v-for="mg in MUSCLE_GROUPS" :key="mg" class="muscle-chip" @click="confirmBuilderExercise(mg)">
                  {{ muscleLabel(mg) }}
                </button>
              </div>
              <button class="btn-cancel-pending" @click="builderPicker.pending = null">{{ $t('tracking.workout_cancel') }}</button>
            </div>
          </div>
          <button v-else class="btn-add-set" @click="openBuilderPicker(dayIdx)">{{ $t('tracking.program_add_exercise') }}</button>
        </div>

        <button class="btn-add-set" @click="addBuilderDay">{{ $t('tracking.program_add_day') }}</button>

        <button
          class="btn-calc primary mt-3"
          :disabled="!builderName.trim() || builderDays.length === 0"
          @click="saveBuilderProgram"
        >
          {{ $t('tracking.program_save') }}
        </button>
        <button class="btn-calc secondary mt-2" @click="closeBuilder">{{ $t('tracking.workout_cancel') }}</button>
      </div>
    </section>

    <ConfirmModal :visible="confirmModal.visible" :message="confirmModal.message" @confirm="handleConfirmYes" @cancel="handleConfirmNo" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useFitness } from '~/composables/useFitness'
import { useLocalized } from '~/composables/useLocalized'
import { useTracking } from '~/composables/useTracking'
import { useUserProgram } from '~/composables/useUserProgram'
import { useAuth } from '~/composables/useAuth'
import { MUSCLE_GROUPS, MEAL_TYPES } from '~/types/tracking'
import { useI18n } from 'vue-i18n'

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const fitness = useFitness()
const { t } = useLocalized()
const { t: $t } = useI18n()
const tracking = useTracking()
const userProgram = useUserProgram()
const auth = useAuth()

const activeTab = ref('workout')
const today = ref(todayISO())

/* ── CONFIRM MODAL ── a promise-based replacement for window.confirm() so
   every delete action (day, set, exercise, program, history entry) gets the
   same styled Ha/Yo'q dialog instead of the browser's native prompt. */
const confirmModal = reactive({ visible: false, message: '' })
let confirmModalResolve = null

function askConfirm(message) {
  confirmModal.message = message
  confirmModal.visible = true
  return new Promise(resolve => { confirmModalResolve = resolve })
}

function handleConfirmYes() {
  confirmModal.visible = false
  confirmModalResolve?.(true)
}

function handleConfirmNo() {
  confirmModal.visible = false
  confirmModalResolve?.(false)
}

function isValidMuscle(mg) {
  return MUSCLE_GROUPS.includes(mg)
}

function muscleLabel(mg) {
  return isValidMuscle(mg) ? $t(`tracking.muscle.${mg}`) : ''
}

function handleVisibilityChange() {
  if (!document.hidden) checkForDayRollover()
}

/* ── WORKOUT STATE ──
   The top card always edits ONE WorkoutLog at a time, chosen via formDate.
   Picking a date that already has a log loads it for editing; saving a
   date with no existing log creates a new one. After a successful save the
   form resets to a fresh blank entry (dated today) and the just-saved log
   simply appears in the history list below — nothing is pinned at the top
   forever. */
const formDate = ref(today.value)
const editingLogId = ref(null)
// false = compact read-only summary of an already-saved day; true = the
// full editable form. A blank/new day always starts in edit mode (there's
// nothing to summarize yet); an existing day defaults to the summary.
const isEditingForm = ref(true)
const exercises = ref([])
const exerciseSearch = ref('')
const showResults = ref(false)
const pendingExercise = ref(null)
const editingMuscleForIdx = ref(null)
const saving = ref(false)
const savedMessage = ref('')
const workoutPeriod = ref('week')
// Which calendar week (Monday) the muscle-group chart shows — lets the user
// page through past weeks without affecting "today" anywhere else (program
// adherence, the day picker, etc. all stay pinned to the real current week).
const weekAnchorMonday = ref(mondayOfWeek(today.value))
const workoutSummary = ref(null)
const workoutHistory = ref([])
const expandedWorkoutDay = ref(null)
const comparison = ref(null)
const exporting = ref(false)

/* ── PROGRAM STATE ── */
const activeProgram = ref(null)
const selectedProgramDayId = ref(null)
const programPromptDismissed = ref(false)
const myPrograms = ref([])
const showCatalogPicker = ref(false)
const builderMode = ref(false)
const editingProgramId = ref(null)
const builderName = ref('')
const builderDays = ref([])
const builderPicker = reactive({ dayIdx: null, search: '', pending: null })
const editingBuilderMuscle = ref(null)

const showProgramDayPrompt = computed(() =>
  !editingLogId.value && exercises.value.length === 0 && !programPromptDismissed.value &&
  activeProgram.value && activeProgram.value.days.length > 0
)

// A program day already logged this calendar week is disabled in the
// prompt — a split is meant to be cycled through (Day 1, then Day 2, ...),
// not repeated, until the week turns over.
const daysCompletedThisWeek = computed(() => {
  const ids = new Set()
  if (!activeProgram.value) return ids
  const monday = mondayOfWeek(formDate.value)
  const sunday = addDaysISO(monday, 6)
  for (const log of workoutHistory.value) {
    if (log.program_day && log.date >= monday && log.date <= sunday) {
      ids.add(log.program_day)
    }
  }
  return ids
})

const builderMatchingExercises = computed(() => {
  const q = builderPicker.search.trim().toLowerCase()
  if (!q) return []
  return fitness.exercises.value
    .filter(ex => t(ex, 'name').toLowerCase().includes(q))
    .slice(0, 8)
})

function applyProgramDay(day) {
  selectedProgramDayId.value = day.id
  isEditingForm.value = true
  exercises.value = day.exercises.map((ex, idx) => ({
    exercise: ex.exercise,
    name: ex.name,
    muscle_group: ex.muscle_group || '',
    order: idx,
    sets: [{ set_number: 1, weight_kg: 0, reps: 0 }],
  }))
  programPromptDismissed.value = true
}

async function loadMyPrograms() {
  myPrograms.value = await userProgram.fetchPrograms()
}

async function loadActiveProgram() {
  activeProgram.value = await userProgram.fetchActiveProgram()
}

async function handleActivateProgram(id) {
  await userProgram.activateProgram(id)
  await Promise.all([loadMyPrograms(), loadActiveProgram()])
}

async function handleDeleteProgram(id) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  await userProgram.deleteProgram(id)
  await Promise.all([loadMyPrograms(), loadActiveProgram()])
}

async function handleCopyFromCatalog(programId) {
  await userProgram.copyFromCatalog(programId)
  showCatalogPicker.value = false
  await loadMyPrograms()
}

function openBuilderForNew() {
  editingProgramId.value = null
  builderName.value = ''
  builderDays.value = []
  builderMode.value = true
}

function openBuilderForEdit(program) {
  editingProgramId.value = program.id
  builderName.value = program.name
  // Ids are carried through so saving updates these exact rows in place
  // instead of deleting and recreating them — that's what keeps any
  // WorkoutLog already tied to a day linked after an edit (see
  // UserProgramSerializer._sync_days on the backend).
  builderDays.value = program.days.map(d => ({
    id: d.id,
    name: d.name,
    exercises: d.exercises.map(e => ({ id: e.id, exercise: e.exercise, name: e.name, muscle_group: e.muscle_group || '' })),
  }))
  builderMode.value = true
}

function closeBuilder() {
  builderMode.value = false
  editingProgramId.value = null
  builderPicker.dayIdx = null
  builderPicker.pending = null
  editingBuilderMuscle.value = null
}

function addBuilderDay() {
  builderDays.value.push({ name: `${builderDays.value.length + 1}-kun`, exercises: [] })
}

async function removeBuilderDay(idx) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  builderDays.value.splice(idx, 1)
}

async function removeBuilderExercise(dayIdx, exIdx) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  builderDays.value[dayIdx].exercises.splice(exIdx, 1)
}

function openBuilderPicker(dayIdx) {
  builderPicker.dayIdx = dayIdx
  builderPicker.search = ''
  builderPicker.pending = null
}

function selectBuilderPending(exerciseId, name) {
  builderPicker.pending = { exercise: exerciseId, name }
}

function confirmBuilderExercise(muscleGroup) {
  const day = builderDays.value[builderPicker.dayIdx]
  day.exercises.push({
    exercise: builderPicker.pending.exercise,
    name: builderPicker.pending.name,
    muscle_group: muscleGroup,
  })
  builderPicker.dayIdx = null
  builderPicker.search = ''
  builderPicker.pending = null
}

function toggleBuilderMuscleEditor(dayIdx, exIdx) {
  const same = editingBuilderMuscle.value &&
    editingBuilderMuscle.value.dayIdx === dayIdx && editingBuilderMuscle.value.exIdx === exIdx
  editingBuilderMuscle.value = same ? null : { dayIdx, exIdx }
}

function setBuilderExerciseMuscle(muscleGroup) {
  const { dayIdx, exIdx } = editingBuilderMuscle.value
  builderDays.value[dayIdx].exercises[exIdx].muscle_group = muscleGroup
  editingBuilderMuscle.value = null
}

async function saveBuilderProgram() {
  const payload = {
    name: builderName.value.trim(),
    days: builderDays.value.map((d, idx) => ({
      id: d.id,
      name: d.name,
      order: idx,
      exercises: d.exercises.map((e, exIdx) => ({
        id: e.id, exercise: e.exercise, name: e.name, muscle_group: e.muscle_group, order: exIdx,
      })),
    })),
  }
  if (editingProgramId.value) {
    await userProgram.updateProgram(editingProgramId.value, payload)
  } else {
    await userProgram.createProgram(payload)
  }
  await Promise.all([loadMyPrograms(), loadActiveProgram()])
  closeBuilder()
}

function deltaClass(pct) {
  if (pct > 0) return 'up'
  if (pct < 0) return 'down'
  return 'flat'
}

function arrowFor(pct) {
  if (pct > 0) return '▲'
  if (pct < 0) return '▼'
  return '—'
}

async function loadComparison() {
  comparison.value = await tracking.fetchWorkoutComparison()
}

// Groups exercises under their program day (e.g. "1-kun (Ko'krak)") so it's
// obvious at a glance which split-day's trend you're looking at; exercises
// with no program day (manual entries) are grouped last, unlabeled.
const groupedComparison = computed(() => {
  if (!comparison.value) return []
  const groups = new Map()
  for (const ex of comparison.value.exercises) {
    const key = ex.program_day_name || null
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(ex)
  }
  const entries = Array.from(groups.entries())
  entries.sort((a, b) => (a[0] === null ? 1 : b[0] === null ? -1 : 0))
  return entries.map(([dayName, exercises]) => ({ dayName, exercises }))
})

async function handleExport(scope) {
  exporting.value = true
  try {
    await tracking.exportWorkouts(scope)
  } catch (e) {
    console.error('Eksport qilishda xatolik:', e)
  } finally {
    exporting.value = false
  }
}

const matchingExercises = computed(() => {
  const q = exerciseSearch.value.trim().toLowerCase()
  if (!q) return []
  return fitness.exercises.value
    .filter(ex => t(ex, 'name').toLowerCase().includes(q))
    .slice(0, 8)
})

// Whichever log is open in the top card is hidden from the archive list —
// it reappears there the moment it's no longer the one being edited.
const pastWorkoutLogs = computed(() => workoutHistory.value.filter(log => log.id !== editingLogId.value))

// Detects the day rolling over under a long-lived open tab (e.g. left open
// overnight). Only resets the form if it was sitting on the default blank
// "today" slate — an in-progress edit of a specific past day is left alone.
function checkForDayRollover() {
  const current = todayISO()
  if (current === today.value) return
  // "Anchored to today" means the date field was left on the old today —
  // whether or not that day's log has since been saved (it usually has,
  // since saving now keeps the form in "editing today" mode rather than
  // clearing it). A manually-picked past date for editing is left alone.
  const wasAnchoredToToday = formDate.value === today.value
  const wasOnCurrentWeek = isCurrentWeek.value
  today.value = current
  if (wasAnchoredToToday) {
    formDate.value = current
    loadLogForDate(current)
  }
  if (wasOnCurrentWeek) {
    weekAnchorMonday.value = mondayOfWeek(current)
    loadWorkoutSummary()
  }
  loadTodayNutrition()
}

function loadLogForDate(date) {
  pendingExercise.value = null
  editingMuscleForIdx.value = null
  const existing = workoutHistory.value.find(log => log.date === date)
  if (existing) {
    editingLogId.value = existing.id
    selectedProgramDayId.value = existing.program_day || null
    programPromptDismissed.value = true // editing an already-populated day — no prompt needed
    isEditingForm.value = false // show the compact saved summary, not the form
    exercises.value = existing.exercises.map(ex => ({
      exercise: ex.exercise,
      name: ex.name,
      muscle_group: ex.muscle_group,
      order: ex.order,
      sets: ex.sets.map(s => ({ set_number: s.set_number, weight_kg: s.weight_kg, reps: s.reps })),
    }))
  } else {
    editingLogId.value = null
    selectedProgramDayId.value = null
    programPromptDismissed.value = false
    isEditingForm.value = true // nothing saved yet for this date — go straight to the form
    exercises.value = []
  }
}

function editHistoryWorkoutDay(log) {
  formDate.value = log.date
  loadLogForDate(log.date)
  isEditingForm.value = true // explicit "edit" click — skip the read-only summary
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteHistoryWorkoutDay(log) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  await tracking.deleteWorkoutLog(log.id)
  if (editingLogId.value === log.id) {
    editingLogId.value = null
    exercises.value = []
  }
  await Promise.all([loadWorkoutHistory(), loadWorkoutSummary(), loadComparison()])
}

// Guards against legacy/incomplete rows (e.g. logged before muscle tagging
// existed) reaching the server, where muscle_group is a required field.
const missingMuscleCount = computed(() => exercises.value.filter(ex => !isValidMuscle(ex.muscle_group)).length)

// A set left at its default 0kg/0 reps is an unfilled placeholder, not a
// real result — saving it would silently corrupt stats (1RM, volume) with
// zeros. Blocks the save until every set has a real weight and rep count.
const invalidSetsCount = computed(() =>
  exercises.value.reduce((count, ex) => count + ex.sets.filter(s => !s.weight_kg || !s.reps).length, 0)
)

function setExerciseMuscle(exIdx, muscleGroup) {
  exercises.value[exIdx].muscle_group = muscleGroup
  editingMuscleForIdx.value = null
}

function confirmAddExercise(muscleGroup) {
  exercises.value.push({
    exercise: pendingExercise.value.exercise,
    name: pendingExercise.value.name,
    muscle_group: muscleGroup,
    order: exercises.value.length,
    sets: [{ set_number: 1, weight_kg: 0, reps: 0 }],
  })
  pendingExercise.value = null
  exerciseSearch.value = ''
  showResults.value = false
}

function cancelPendingExercise() {
  pendingExercise.value = null
}

async function removeExercise(idx) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  exercises.value.splice(idx, 1)
}

function addSet(exIdx) {
  const sets = exercises.value[exIdx].sets
  sets.push({ set_number: sets.length + 1, weight_kg: 0, reps: 0 })
}

async function removeSet(exIdx, setIdx) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  exercises.value[exIdx].sets.splice(setIdx, 1)
}

function toggleHistoryWorkoutDay(id) {
  expandedWorkoutDay.value = expandedWorkoutDay.value === id ? null : id
}

async function loadWorkoutHistory() {
  workoutHistory.value = await tracking.fetchWorkoutLogs()
}

async function saveWorkoutDay() {
  if (missingMuscleCount.value > 0) {
    editingMuscleForIdx.value = exercises.value.findIndex(ex => !isValidMuscle(ex.muscle_group))
    return
  }
  if (invalidSetsCount.value > 0) {
    return // save-button is disabled in this state; the warning text explains why
  }
  saving.value = true
  savedMessage.value = ''
  try {
    const payload = {
      date: formDate.value,
      notes: '',
      program_day: selectedProgramDayId.value,
      exercises: exercises.value.map((ex, idx) => ({
        exercise: ex.exercise,
        name: ex.name,
        muscle_group: ex.muscle_group,
        order: idx,
        sets: ex.sets.map((s, sIdx) => ({ set_number: sIdx + 1, weight_kg: s.weight_kg, reps: s.reps })),
      })),
    }
    if (editingLogId.value) {
      await tracking.updateWorkoutLog(editingLogId.value, payload)
    } else {
      await tracking.createWorkoutLog(payload)
    }
    savedMessage.value = $t('tracking.workout_saved')
    await Promise.all([loadWorkoutSummary(), loadWorkoutHistory(), loadComparison()])
    // Re-resolve the form against this date rather than blindly clearing it —
    // formDate's log now exists (we just saved it), so this puts the form
    // into "editing today's log" mode. That's what makes a second "1-kun"
    // pick for the same date update it in place instead of creating a
    // duplicate WorkoutLog for the same day.
    loadLogForDate(formDate.value)
  } finally {
    saving.value = false
    setTimeout(() => { savedMessage.value = '' }, 2500)
  }
}

const weekAnchorSunday = computed(() => addDaysISO(weekAnchorMonday.value, 6))
const isCurrentWeek = computed(() => weekAnchorMonday.value === mondayOfWeek(today.value))

async function loadWorkoutSummary() {
  // Only 'week' is navigable — 'month' always shows the trailing 30 days
  // ending today, same as before.
  const endDate = workoutPeriod.value === 'week' ? weekAnchorSunday.value : today.value
  workoutSummary.value = await tracking.fetchWorkoutSummary(workoutPeriod.value, endDate)
}

function goToPreviousWeek() {
  weekAnchorMonday.value = addDaysISO(weekAnchorMonday.value, -7)
  loadWorkoutSummary()
}

function goToNextWeek() {
  if (isCurrentWeek.value) return
  weekAnchorMonday.value = addDaysISO(weekAnchorMonday.value, 7)
  loadWorkoutSummary()
}

watch(workoutPeriod, loadWorkoutSummary)

/* ── NUTRITION STATE ── */
const MEAL_ICONS = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙',
  pre_workout: '🏋️', post_workout: '💪', other: '🍽️',
}

// A reasonable time-of-day guess so most entries need zero taps on the
// dropdown — the user can still override it per entry.
function defaultMealTypeForNow() {
  const hour = new Date().getHours()
  if (hour < 11) return 'breakfast'
  if (hour < 16) return 'lunch'
  if (hour < 22) return 'dinner'
  return 'other'
}

function mealLabel(mealType) {
  return $t(`tracking.nutrition_meal_${mealType}`)
}

function mealIcon(mealType) {
  return MEAL_ICONS[mealType] || MEAL_ICONS.other
}

// Groups entries into fixed, sensible meal-type buckets (breakfast before
// lunch before dinner, etc.) instead of one flat undifferentiated list —
// skips buckets with nothing logged.
function groupByMealType(entries) {
  const byType = {}
  for (const entry of entries) {
    const key = entry.meal_type || 'other'
    if (!byType[key]) byType[key] = []
    byType[key].push(entry)
  }
  return MEAL_TYPES
    .filter(mt => byType[mt]?.length)
    .map(mt => ({
      type: mt,
      entries: byType[mt],
      totalCalories: byType[mt].reduce((sum, e) => sum + e.calories, 0),
    }))
}

const todayNutrition = ref([])
const foodForm = reactive({ name: '', meal_type: defaultMealTypeForNow(), calories: null, protein_g: null, carbs_g: null, fat_g: null })
const addingFood = ref(false)
const editingFoodId = ref(null)
const mealDropdownOpen = ref(false)
const nutritionPeriod = ref('week')
const nutritionSummary = ref(null)
const nutritionHistoryRaw = ref([])
const expandedNutritionDay = ref(null)
const exportingNutrition = ref(false)

const todayTotals = computed(() => {
  return todayNutrition.value.reduce((acc, e) => ({
    calories: acc.calories + e.calories,
    protein_g: acc.protein_g + e.protein_g,
    carbs_g: acc.carbs_g + e.carbs_g,
    fat_g: acc.fat_g + e.fat_g,
  }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 })
})

const todayMealGroups = computed(() => groupByMealType(todayNutrition.value))

const hasCalorieGoal = computed(() => (auth.user.value?.goal_calories || 0) > 0)

function calGoalPct(calories) {
  const goal = auth.user.value?.goal_calories || 0
  return goal > 0 ? Math.round((calories / goal) * 100) : null
}

const nutritionHistoryByDay = computed(() => {
  const groups = {}
  for (const entry of nutritionHistoryRaw.value) {
    if (entry.date === today.value) continue
    if (!groups[entry.date]) groups[entry.date] = []
    groups[entry.date].push(entry)
  }
  return Object.entries(groups)
    .map(([date, entries]) => ({
      date,
      entries,
      mealGroups: groupByMealType(entries),
      totalCalories: entries.reduce((sum, e) => sum + e.calories, 0),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
})

function toggleHistoryNutritionDay(date) {
  expandedNutritionDay.value = expandedNutritionDay.value === date ? null : date
}

async function loadTodayNutrition() {
  todayNutrition.value = await tracking.fetchNutritionLogs(today.value)
}

async function loadNutritionHistory() {
  nutritionHistoryRaw.value = await tracking.fetchNutritionLogs()
}

async function addFood() {
  if (!foodForm.name || !foodForm.calories) return
  addingFood.value = true
  try {
    const payload = {
      name: foodForm.name,
      meal_type: foodForm.meal_type,
      calories: foodForm.calories,
      protein_g: foodForm.protein_g || 0,
      carbs_g: foodForm.carbs_g || 0,
      fat_g: foodForm.fat_g || 0,
    }
    if (editingFoodId.value) {
      await tracking.updateNutritionLog(editingFoodId.value, payload)
      editingFoodId.value = null
    } else {
      await tracking.createNutritionLog(payload)
    }
    foodForm.name = ''
    foodForm.calories = null
    foodForm.protein_g = null
    foodForm.carbs_g = null
    foodForm.fat_g = null
    // meal_type is intentionally left as-is — logging several items for the
    // same meal in a row (breakfast: eggs, toast, juice) shouldn't require
    // re-picking the dropdown every time.
    await Promise.all([loadTodayNutrition(), loadNutritionSummary(), loadNutritionHistory()])
  } finally {
    addingFood.value = false
  }
}

// A user who fat-fingered a value (wrong calories, wrong meal) can fix it
// in place instead of deleting and re-typing the whole entry from scratch.
function startEditFood(entry) {
  editingFoodId.value = entry.id
  foodForm.name = entry.name
  foodForm.meal_type = entry.meal_type
  foodForm.calories = entry.calories
  foodForm.protein_g = entry.protein_g || null
  foodForm.carbs_g = entry.carbs_g || null
  foodForm.fat_g = entry.fat_g || null
}

function cancelEditFood() {
  editingFoodId.value = null
  foodForm.name = ''
  foodForm.calories = null
  foodForm.protein_g = null
  foodForm.carbs_g = null
  foodForm.fat_g = null
}

async function removeFood(id) {
  if (!(await askConfirm($t('tracking.delete_confirm')))) return
  if (editingFoodId.value === id) cancelEditFood()
  await tracking.deleteNutritionLog(id)
  await Promise.all([loadTodayNutrition(), loadNutritionSummary(), loadNutritionHistory()])
}

/* ── NUTRITION GOAL ── */
const goalEditorOpen = ref(false)
const savingGoal = ref(false)
const goalForm = reactive({ calories: null, protein_g: null, carbs_g: null, fat_g: null })

function openGoalEditor() {
  goalForm.calories = auth.user.value?.goal_calories || null
  goalForm.protein_g = auth.user.value?.goal_protein_g || null
  goalForm.carbs_g = auth.user.value?.goal_carbs_g || null
  goalForm.fat_g = auth.user.value?.goal_fat_g || null
  goalEditorOpen.value = true
}

async function saveGoal() {
  savingGoal.value = true
  try {
    await auth.updateProfile({
      goal_calories: goalForm.calories || 0,
      goal_protein_g: goalForm.protein_g || 0,
      goal_carbs_g: goalForm.carbs_g || 0,
      goal_fat_g: goalForm.fat_g || 0,
    })
    goalEditorOpen.value = false
  } finally {
    savingGoal.value = false
  }
}

/* ── NUTRITION EXPORT ── */
async function handleNutritionExport(scope) {
  exportingNutrition.value = true
  try {
    await tracking.exportNutrition(scope)
  } catch (e) {
    console.error('Eksport qilishda xatolik:', e)
  } finally {
    exportingNutrition.value = false
  }
}

async function loadNutritionSummary() {
  nutritionSummary.value = await tracking.fetchNutritionSummary(nutritionPeriod.value)
}

watch(nutritionPeriod, loadNutritionSummary)

/* ── CHARTS ──
   Single-series bars use one brand hue (position + axis label already
   carry category identity — a second color channel would be decorative).
   The 3-way macro split is genuine categorical identity, so it uses the
   validated 3-slot dark-mode palette (see dataviz skill, color-formula). */
const BRAND_HUE = '#00CFFF'
const MACRO_COLORS = ['#3987e5', '#199e70', '#c98500'] // protein, carbs, fat

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#898781' }, grid: { display: false } },
    y: { ticks: { color: '#898781' }, grid: { color: '#2c2c2a' }, beginAtZero: true },
  },
}

const muscleChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: { ...chartOptions.scales.y, ticks: { ...chartOptions.scales.y.ticks, stepSize: 1 } },
  },
}

const doughnutOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom', labels: { color: '#c3c2b7' } } },
}

const muscleChartData = computed(() => ({
  labels: MUSCLE_GROUPS.map(muscleLabel),
  datasets: [{
    label: $t('tracking.workout_chart_title'),
    data: MUSCLE_GROUPS.map(mg => workoutSummary.value?.sets_by_muscle?.[mg] || 0),
    backgroundColor: BRAND_HUE,
    borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
    borderSkipped: 'bottom',
    maxBarThickness: 24,
  }],
}))

const caloriesChartData = computed(() => ({
  labels: (nutritionSummary.value?.days || []).map(d => formatShortDate(d.date)),
  datasets: [{
    label: $t('tracking.nutrition_chart_calories'),
    data: (nutritionSummary.value?.days || []).map(d => d.calories),
    backgroundColor: BRAND_HUE,
    borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
    borderSkipped: 'bottom',
    maxBarThickness: 24,
  }],
}))

const hasMacroData = computed(() => {
  const s = nutritionSummary.value
  return !!s && (s.total_protein_g + s.total_carbs_g + s.total_fat_g) > 0
})

const macroChartData = computed(() => ({
  labels: [$t('tracking.nutrition_protein'), $t('tracking.nutrition_carbs'), $t('tracking.nutrition_fat')],
  datasets: [{
    data: [nutritionSummary.value?.total_protein_g || 0, nutritionSummary.value?.total_carbs_g || 0, nutritionSummary.value?.total_fat_g || 0],
    backgroundColor: MACRO_COLORS,
    borderWidth: 0,
    spacing: 2,
  }],
}))

onMounted(async () => {
  loadActiveProgram()
  loadMyPrograms()
  await loadWorkoutHistory()
  loadLogForDate(formDate.value)
  loadWorkoutSummary()
  loadComparison()
  loadTodayNutrition()
  loadNutritionSummary()
  loadNutritionHistory()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.tracking-page {
  background-color: #222222;
  color: white;
  padding: 14px !important;
  padding-bottom: 100px !important;
  max-width: 450px !important;
  margin: auto;
}

.tracking-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.tracking-header h1 {
  font-family: 'Gropled', sans-serif;
  font-size: 24px;
  margin: 0;
}

.back-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  display: flex;
}

.day-label {
  font-size: 15px;
  color: #aaa;
  margin-bottom: 14px;
}

.day-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.date-input {
  width: auto;
  flex: 1;
  padding: 10px;
  font-size: 14px;
}

.editing-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #00CFFF;
  background: rgba(0,207,255,0.12);
  border-radius: 8px;
  padding: 5px 8px;
  white-space: nowrap;
}

.view-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.saved-badge {
  font-size: 12px;
  font-weight: 700;
  color: #0ca30c;
}

.view-mode-header .icon-btn {
  width: auto;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #00CFFF;
  background: rgba(0,207,255,0.1);
}

.empty-hint {
  color: #777;
  font-size: 14px;
  text-align: center;
  padding: 16px 0;
}

.exercise-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
}

.exercise-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.exercise-name {
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.muscle-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #00CFFF;
  background: rgba(0,207,255,0.12);
  border-radius: 6px;
  padding: 2px 6px;
  border: none;
  cursor: pointer;
}

.muscle-badge.unset {
  color: #ffb020;
  background: rgba(255,176,32,0.12);
}

.muscle-warning {
  color: #ffb020;
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
}

.muscle-chips.inline {
  margin: 0 0 10px;
}

.set-row {
  display: grid;
  grid-template-columns: auto 1fr 1fr auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.set-row input {
  padding: 8px;
  font-size: 13px;
}

.set-index {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.set-row-header {
  margin-bottom: 4px;
}

.set-col-label {
  font-size: 11px;
  color: #888;
  text-align: center;
}

.icon-btn {
  background: rgba(255,255,255,0.08);
  border: none;
  color: #ccc;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.icon-btn.danger {
  color: #ff6b6b;
}

.btn-add-set {
  background: none;
  border: 1px dashed #444;
  color: #00CFFF;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
}

.exercise-picker {
  position: relative;
  margin-top: 8px;
}

.picker-results {
  position: relative;
  background: #1c1c1c;
  border: 1px solid #333;
  border-radius: 12px;
  margin-top: 6px;
  overflow: hidden;
}

.picker-result {
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.picker-result:last-child {
  border-bottom: none;
}

.picker-result:hover {
  background: rgba(0,207,255,0.1);
}

.picker-result.custom {
  color: #00CFFF;
}

.muscle-picker {
  margin-top: 8px;
  background: #1c1c1c;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 12px;
}

.muscle-picker-title {
  font-size: 13px;
  color: #ccc;
  margin-bottom: 10px;
}

.muscle-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.muscle-chip {
  background: rgba(0,207,255,0.1);
  border: 1px solid rgba(0,207,255,0.3);
  color: #00CFFF;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
}

.muscle-chip:active {
  background: #00CFFF;
  color: #000;
}

.muscle-chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: #888;
}

.btn-cancel-pending {
  background: none;
  border: none;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.saved-msg {
  text-align: center;
  color: #00CFFF;
  font-size: 13px;
  margin-top: 8px;
}

.period-toggle {
  display: flex;
  gap: 10px;
  margin: 16px 0;
}

.period-toggle button {
  flex: 1;
  padding: 10px;
  background: #1c1c1c;
  border: 1px solid #333;
  border-radius: 12px;
  color: #ccc;
  cursor: pointer;
  font-size: 13px;
}

.period-toggle button.active {
  background: #00CFFF;
  color: #000;
  border-color: #00CFFF;
}

.week-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.week-nav-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #00CFFF;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.week-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  color: #888;
}

.week-nav-label {
  font-size: 12px;
  color: #ccc;
  white-space: nowrap;
}

.stats-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #00CFFF;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.chart-card {
  padding: 16px;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 12px;
}

.chart-data-list {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  font-size: 12px;
  color: #aaa;
}

.chart-data-list li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.chart-data-list strong {
  color: #fff;
}

.comparison-range {
  font-size: 11px;
  color: #777;
  margin: -6px 0 12px;
}

.comparison-day-group {
  margin-bottom: 14px;
}

.comparison-day-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #00CFFF;
  margin: 0 0 4px;
}

.comparison-exercise {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.comparison-exercise:last-child {
  border-bottom: none;
}

.comparison-exercise-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
}

.comparison-set-row {
  padding: 4px 0;
}

.comparison-set-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ccc;
}


.comparison-set-label {
  color: #888;
  white-space: nowrap;
}

.comparison-values {
  flex: 1;
  text-align: right;
  padding: 0 8px;
}

.comparison-delta {
  font-weight: 700;
  white-space: nowrap;
  min-width: 52px;
  text-align: right;
}

.comparison-delta.up {
  color: #0ca30c;
}

.comparison-delta.down {
  color: #ec835a;
}

.comparison-delta.flat {
  color: #888;
}

.export-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.export-btn {
  background: rgba(0,207,255,0.1);
  border: 1px solid rgba(0,207,255,0.3);
  color: #00CFFF;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-btn.danger {
  background: rgba(255,107,107,0.1);
  border-color: rgba(255,107,107,0.3);
  color: #ff6b6b;
}

.section-subtitle {
  font-size: 16px;
  margin: 20px 0 12px;
}

.program-card {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}

.program-card:hover {
  border-color: rgba(0,207,255,0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
}

.program-card.active {
  border-color: rgba(0,207,255,0.35);
  background: linear-gradient(180deg, rgba(0,207,255,0.07), rgba(255,255,255,0.02));
}

.program-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.program-name {
  font-weight: 700;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.program-active-badge {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #04222c;
  background: linear-gradient(135deg, #00CFFF, #00e0b8);
  border-radius: 999px;
  padding: 4px 10px;
  box-shadow: 0 0 12px rgba(0,207,255,0.35);
}

.program-days-preview {
  font-size: 12.5px;
  color: #999;
  line-height: 1.5;
  margin-bottom: 14px;
}

.program-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.program-actions-row {
  display: flex;
  gap: 8px;
}

.program-btn {
  padding: 11px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: filter 0.2s ease, transform 0.15s ease;
}

.program-btn:hover {
  filter: brightness(1.15);
}

.program-btn:active {
  transform: scale(0.97);
}

.program-btn.activate {
  width: 100%;
  background: linear-gradient(135deg, #00CFFF, #00a8e0);
  color: #061318;
  border: none;
}

.program-actions-row .program-btn {
  flex: 1;
  min-width: 0;
}

.program-btn.edit {
  background: rgba(0,207,255,0.08);
  border-color: rgba(0,207,255,0.25);
  color: #00CFFF;
}

.program-btn.delete {
  background: rgba(255,107,107,0.08);
  border-color: rgba(255,107,107,0.25);
  color: #ff6b6b;
}

.program-day-name-input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  margin-right: 8px;
}

.program-exercise-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.program-exercise-row span:first-child {
  flex: 1;
}

.history-day-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
}

.history-day-header-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px 4px 0;
}

.history-day-header {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  color: #fff;
  padding: 8px 8px 8px 14px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.history-day-meta {
  color: #888;
  font-size: 12px;
}

.history-day-body {
  padding: 0 14px 12px;
}

.history-exercise {
  margin-bottom: 10px;
}

.history-exercise-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 4px;
}

.history-sets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.history-set-chip {
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 12px;
  color: #ccc;
}

.food-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 0 10px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.food-name {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.food-macros {
  font-size: 12px;
  color: #888;
}

.food-calories {
  font-size: 14px;
  font-weight: 700;
  color: #00CFFF;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Nutrition header row: today's label + the goal-edit link, on one line */
.nutrition-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.goal-edit-link {
  background: rgba(0,207,255,0.1);
  border: 1px solid rgba(0,207,255,0.25);
  color: #00CFFF;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.goal-editor {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 12px;
  margin: 10px 0;
}

.goal-editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.goal-editor-actions .btn-calc {
  padding: 11px;
  font-size: 13px;
}

/* Macro summary bar — Fat / Carbs / Protein / Goal% / Calories chips,
   mirroring how the user's own paper/spreadsheet diary reads at a glance. */
.macro-summary-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 12px 6px;
  margin: 14px 0;
}

.macro-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
}

.macro-chip-value {
  font-size: 15px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.macro-chip-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.macro-chip.highlight .macro-chip-value {
  color: #00CFFF;
}

/* Meal-type groups — visually separated blocks so breakfast/lunch/dinner/
   pre- & post-workout entries never blur into one undifferentiated list. */
.meal-group {
  margin-top: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
}

.meal-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(0,207,255,0.06);
  font-size: 13px;
  font-weight: 700;
}

.meal-group-icon {
  font-size: 15px;
}

.meal-group-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meal-group-total {
  color: #00CFFF;
  font-size: 12px;
  white-space: nowrap;
}

.meal-group .food-row:last-child {
  border-bottom: none;
}

.food-form {
  margin-top: 14px;
}

.food-form input {
  margin-bottom: 8px;
}

.food-form .editing-tag {
  display: inline-block;
  margin-bottom: 8px;
}

/* Custom meal-type dropdown — replaces the native <select>, whose popup
   can't be themed (it renders with the OS's own light/blue styling). */
.custom-select {
  position: relative;
  margin-bottom: 8px;
}

.custom-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1c1c1c;
  border: 1px solid #333;
  color: white;
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.custom-select.open .custom-select-trigger {
  border-color: #00CFFF;
}

.custom-select-chevron {
  color: #888;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.custom-select-chevron.open {
  transform: rotate(180deg);
  color: #00CFFF;
}

.custom-select-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
}

.custom-select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 21;
  background: #1c1c1c;
  border: 1px solid rgba(0,207,255,0.25);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  max-height: 260px;
  overflow-y: auto;
}

.custom-select-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #ddd;
  padding: 11px 10px;
  border-radius: 10px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.custom-select-option:hover {
  background: rgba(255,255,255,0.06);
}

.custom-select-option.selected {
  background: rgba(0,207,255,0.12);
  color: #00CFFF;
  font-weight: 700;
}

.custom-select-option-icon {
  font-size: 15px;
}

.food-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
