export interface Exercise {
  id: number | string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  category: any;
  img: string;
  video: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
}

// Hardcoded data removed. Use useFitness composable to access data from the backend.
