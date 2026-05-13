export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const getMediaUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Prefix with apiBase if it starts with /media/
    return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length >= 10) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return {
    apiBase,
    getMediaUrl,
    getYouTubeEmbedUrl
  };
};
