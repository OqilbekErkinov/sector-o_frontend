import type {
  WorkoutLog,
  WorkoutSummary,
  WorkoutComparison,
  ExportScope,
  NutritionLog,
  NutritionSummary,
} from '~/types/tracking'

export const useTracking = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })

  // ── Workouts ──
  const fetchWorkoutLogs = (date?: string) => {
    return $fetch<WorkoutLog[]>(`${config.public.apiBase}/api/tracking/workouts/`, {
      headers: authHeaders(),
      query: date ? { date } : undefined,
    })
  }

  const createWorkoutLog = (payload: Pick<WorkoutLog, 'date' | 'notes' | 'exercises' | 'program_day'>) => {
    return $fetch<WorkoutLog>(`${config.public.apiBase}/api/tracking/workouts/`, {
      method: 'POST',
      headers: authHeaders(),
      body: payload,
    })
  }

  const updateWorkoutLog = (id: number, payload: Pick<WorkoutLog, 'date' | 'notes' | 'exercises' | 'program_day'>) => {
    return $fetch<WorkoutLog>(`${config.public.apiBase}/api/tracking/workouts/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: payload,
    })
  }

  const deleteWorkoutLog = (id: number) => {
    return $fetch(`${config.public.apiBase}/api/tracking/workouts/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  const fetchWorkoutSummary = (period: 'week' | 'month', endDate?: string) => {
    return $fetch<WorkoutSummary>(`${config.public.apiBase}/api/tracking/workouts/summary/`, {
      headers: authHeaders(),
      query: {
        period,
        // end_date is the *navigable* anchor — pass a past week's Sunday
        // to browse it. today is always the real current date, so
        // program_adherence stays pinned to the real current week even
        // while end_date is pointed at a different one (see tracking_views.py).
        end_date: endDate || todayISO(),
        today: todayISO(),
      },
    })
  }

  const fetchWorkoutComparison = () => {
    return $fetch<WorkoutComparison>(`${config.public.apiBase}/api/tracking/workouts/comparison/`, {
      headers: authHeaders(),
      query: { end_date: todayISO() },
    })
  }

  // Downloads the formatted .xlsx export and triggers the browser's save dialog.
  const exportWorkouts = async (scope: ExportScope) => {
    const blob = await $fetch<Blob>(`${config.public.apiBase}/api/tracking/workouts/export/`, {
      headers: authHeaders(),
      query: { scope, end_date: todayISO() },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trening_${scope}_${todayISO()}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ── Nutrition ──
  const fetchNutritionLogs = (date?: string) => {
    return $fetch<NutritionLog[]>(`${config.public.apiBase}/api/tracking/nutrition/`, {
      headers: authHeaders(),
      query: date ? { date } : undefined,
    })
  }

  const createNutritionLog = (payload: Pick<NutritionLog, 'name' | 'meal_type' | 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'> & { date?: string }) => {
    return $fetch<NutritionLog>(`${config.public.apiBase}/api/tracking/nutrition/`, {
      method: 'POST',
      headers: authHeaders(),
      // Always send an explicit date (defaulting to the client's local
      // today) — otherwise the server falls back to ITS local date, which
      // runs in UTC and can silently log the entry under the wrong day.
      body: { date: todayISO(), ...payload },
    })
  }

  const updateNutritionLog = (id: number, payload: Partial<Pick<NutritionLog, 'name' | 'meal_type' | 'calories' | 'protein_g' | 'carbs_g' | 'fat_g'>>) => {
    return $fetch<NutritionLog>(`${config.public.apiBase}/api/tracking/nutrition/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: payload,
    })
  }

  const deleteNutritionLog = (id: number) => {
    return $fetch(`${config.public.apiBase}/api/tracking/nutrition/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  const fetchNutritionSummary = (period: 'week' | 'month') => {
    return $fetch<NutritionSummary>(`${config.public.apiBase}/api/tracking/nutrition/summary/`, {
      headers: authHeaders(),
      query: { period, end_date: todayISO() },
    })
  }

  // Downloads the formatted .xlsx nutrition diary export and triggers the
  // browser's save dialog — mirrors exportWorkouts above.
  const exportNutrition = async (scope: ExportScope) => {
    const blob = await $fetch<Blob>(`${config.public.apiBase}/api/tracking/nutrition/export/`, {
      headers: authHeaders(),
      query: { scope, end_date: todayISO() },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ovqatlanish_${scope}_${todayISO()}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    fetchWorkoutLogs,
    createWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
    fetchWorkoutSummary,
    fetchWorkoutComparison,
    exportWorkouts,
    fetchNutritionLogs,
    createNutritionLog,
    updateNutritionLog,
    deleteNutritionLog,
    fetchNutritionSummary,
    exportNutrition,
  }
}
