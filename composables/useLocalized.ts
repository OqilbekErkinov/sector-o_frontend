export const useLocalized = () => {
  const { locale } = useI18n();

  const t = <T extends Record<string, unknown>>(obj: T | null | undefined, fieldBaseName: string): string => {
    if (!obj) return '';
    const localizedField = `${fieldBaseName}_${locale.value}`;
    return (obj[localizedField] as string) || (obj[`${fieldBaseName}_en`] as string) || (obj[fieldBaseName] as string) || '';
  };

  return {
    t
  };
};
