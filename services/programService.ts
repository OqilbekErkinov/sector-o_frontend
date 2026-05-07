export interface ProgramDay {
  id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
  exercises: any[];
}

export interface Program {
  id: number | string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  img: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  days: ProgramDay[];
}

// Hardcoded data removed. Use useFitness composable to access data from the backend.
