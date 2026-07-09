export interface Category {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
  img: string | null
  slug: string
}

export interface Exercise {
  id: number
  category: number | null
  category_slug: string | null
  category_name_uz: string
  category_name_en: string
  category_name_ru: string
  name_uz: string
  name_ru: string
  name_en: string
  slug: string | null
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  img: string | null
  video: string | null
  description_uz: string
  description_ru: string
  description_en: string
  instructions_uz: string[]
  instructions_ru: string[]
  instructions_en: string[]
  muscles_uz: string[]
  muscles_ru: string[]
  muscles_en: string[]
  mistakes_uz: string[]
  mistakes_ru: string[]
  mistakes_en: string[]
  equipment: string[]
  views: number
  recommended_sets: string
}

export interface ProgramDay {
  id: number
  program: number
  name_uz: string
  name_ru: string
  name_en: string
  exercises: Exercise[]
  order: number
}

export interface Program {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  img: string | null
  description_uz: string
  description_ru: string
  description_en: string
  days: ProgramDay[]
}

export interface Motivation {
  id: number
  quote_uz: string
  quote_ru: string
  quote_en: string
  author: string | null
}

export interface Diet {
  id: number
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner'
  icon: string
  title_uz: string
  title_ru: string
  title_en: string
  description_uz: string
  description_ru: string
  description_en: string
}

export interface Supplement {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
  benefits_uz: string
  benefits_ru: string
  benefits_en: string
  origin_uz: string
  origin_ru: string
  origin_en: string
  dosage_uz: string
  dosage_ru: string
  dosage_en: string
  timing_uz: string
  timing_ru: string
  timing_en: string
  sources_uz: string
  sources_ru: string
  sources_en: string
  img: string | null
}
