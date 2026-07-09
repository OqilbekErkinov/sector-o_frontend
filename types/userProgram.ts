import type { MuscleGroup } from './tracking'

export interface UserProgramExercise {
  id?: number
  exercise?: number | null
  name: string
  muscle_group: MuscleGroup | ''
  order: number
}

export interface UserProgramDay {
  id: number
  name: string
  order: number
  exercises: UserProgramExercise[]
}

export interface UserProgram {
  id: number
  name: string
  is_active: boolean
  created_at: string
  days: UserProgramDay[]
}

export interface ProgramAdherence {
  program_name: string
  completed_days: number
  target_days: number
  week_start: string
  week_end: string
}
