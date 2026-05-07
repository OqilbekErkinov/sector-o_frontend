export const useLocalized = () => {
  const { locale } = useI18n();

  const t = (obj: any, fieldBaseName: string) => {
    if (!obj) return '';
    const localizedField = `${fieldBaseName}_${locale.value}`;
    return obj[localizedField] || obj[`${fieldBaseName}_en`] || obj[fieldBaseName] || '';
  };

  return {
    t
  };
};
