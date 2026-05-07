import axios from "axios"
import Cookies from "js-cookie"
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

export const $api = axios.create({
  withCredentials: true,
  baseURL: apiBase
});
$api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
        }
        throw error;
    }
);