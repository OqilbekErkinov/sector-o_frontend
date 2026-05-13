export const useFitness = () => {
  // Global reactive state using Nuxt's useState
  const categories = useState<any[]>('categories', () => []);
  const exercises = useState<any[]>('exercises', () => []);
  const programs = useState<any[]>('programs', () => []);
  const motivation = useState<any[]>('motivation', () => []);
  const diets = useState<any[]>('diets', () => []);
  const supplements = useState<any[]>('supplements', () => []);
  const loading = useState('fitness_loading', () => false);
  const error = useState<string | null>('fitness_error', () => null);

  // Getters (Simple functions)
  const getCategoryBySlug = (slug: string) => categories.value.find(c => c.slug === slug);
  const getExercisesByCategory = (categorySlug: string) => exercises.value.filter(ex => ex.category_slug === categorySlug);
  const getExerciseById = (id: number | string) => exercises.value.find(ex => ex.id == id);
  const popularExercises = () => {
    return [...exercises.value].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
  };
  const latestMotivation = () => motivation.value[0] || null;

  // Actions
  const loadAllData = async () => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;

    try {
      const [cats, exs, progs, mot, dt, sups] = await Promise.all([
        $fetch(`${apiBase}/api/categories/`),
        $fetch(`${apiBase}/api/exercises/`),
        $fetch(`${apiBase}/api/programs/`),
        $fetch(`${apiBase}/api/motivation/`),
        $fetch(`${apiBase}/api/diet/`),
        $fetch(`${apiBase}/api/supplements/`),
      ]);

      categories.value = cats as any[];
      exercises.value = exs as any[];
      programs.value = progs as any[];
      motivation.value = mot as any[];
      diets.value = dt as any[];
      supplements.value = sups as any[];
      
      error.value = null;
    } catch (err: any) {
      console.error('Failed to fetch fitness data:', err);
      // More user-friendly error message
      if (err.response?.status === 0 || err.message?.includes('fetch')) {
        error.value = 'Serverga ulanib bo‘lmadi. Iltimos, internetingizni tekshiring.';
      } else {
        error.value = err.message || 'Ma’lumotlarni yuklashda xatolik yuz berdi.';
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    exercises,
    programs,
    motivation,
    diets,
    supplements,
    loading,
    error,
    loadAllData,
    getCategoryBySlug,
    getExercisesByCategory,
    getExerciseById,
    popularExercises,
    latestMotivation
  };
};
