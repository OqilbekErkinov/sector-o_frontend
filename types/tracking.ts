export const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs', 'glutes',
] as const

export type MuscleGroup = typeof MUSCLE_GROUPS[number]

export interface WorkoutSet {
  id?: number
  set_number: number
  weight_kg: number
  reps: number
}

export interface WorkoutExerciseEntry {
  id?: number
  exercise?: number | null
  name: string
  muscle_group: MuscleGroup
  order: number
  sets: WorkoutSet[]
}

export interface WorkoutLog {
  id: number
  date: string
  notes: string
  program_day?: number | null
  exercises: WorkoutExerciseEntry[]
  created_at: string
}

export interface WorkoutSummary {
  period: 'week' | 'month'
  start_date: string
  end_date: string
  total_workout_days: number
  sets_by_muscle: Record<MuscleGroup, number>
  program_adherence?: import('./userProgram').ProgramAdherence
}

export interface WorkoutSetComparison {
  set_number: number
  current_weight_kg: number
  current_reps: number
  previous_weight_kg: number | null
  previous_reps: number | null
  // Estimated one-rep max (Epley formula) — the single number that makes
  // "heavier for fewer reps" and "lighter for more reps" comparable.
  current_1rm_kg: number
  previous_1rm_kg: number | null
  change_pct: number | null
}

export interface WorkoutExerciseComparison {
  name: string
  muscle_group: MuscleGroup
  program_day_name: string | null
  current_date: string
  previous_date: string
  sets: WorkoutSetComparison[]
}

export interface WorkoutComparison {
  this_week_start: string
  this_week_end: string
  last_week_start: string
  last_week_end: string
  exercises: WorkoutExerciseComparison[]
}

export type ExportScope = 'day' | 'week' | 'month' | 'all'

export const MEAL_TYPES = [
  'breakfast', 'lunch', 'dinner', 'pre_workout', 'post_workout', 'other',
] as const

export type MealType = typeof MEAL_TYPES[number]

export interface NutritionLog {
  id: number
  date: string
  meal_type: MealType
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at: string
}

export interface NutritionDaySummary {
  date: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface NutritionSummary {
  period: 'week' | 'month'
  start_date: string
  end_date: string
  logged_days: number
  total_calories: number
  avg_calories_per_logged_day: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  days: NutritionDaySummary[]
}
