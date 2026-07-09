export interface AuthUser {
  id: number
  email: string
  full_name: string
  phone: string
  xp: number
  level: number
  weekly_goal: number
  goal_calories?: number
  goal_protein_g?: number
  goal_carbs_g?: number
  goal_fat_g?: number
  workouts_done: number
  active_days: number
  current_week_workouts: number
  img: string | null
  unread_conversations_count?: number
}

export interface AuthTokens {
  access: string
  refresh?: string
}
