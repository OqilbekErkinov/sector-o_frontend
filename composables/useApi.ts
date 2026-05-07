export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const getMediaUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Prefix with apiBase if it starts with /media/
    return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return {
    apiBase,
    getMediaUrl
  };
};
