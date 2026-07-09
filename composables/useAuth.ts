import { ref } from 'vue'
import type { AuthUser, AuthTokens } from '~/types/auth'

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth_user', () => null)
    // Note: true httpOnly cookies can only be set from a server response, not
    // from client-side JS — useCookie() here always runs in the browser/SSR
    // request context, so httpOnly isn't reachable without routing auth
    // through a Nitro server route. secure+sameSite are the mitigations
    // available at this layer; they still meaningfully cut CSRF/network risk.
    const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        // Only force Secure in production — local dev usually runs on plain
        // http://localhost or http://127.0.0.1, where a Secure cookie would
        // silently fail to be sent and break login.
        secure: !import.meta.dev,
        sameSite: 'strict',
    })
    const config = useRuntimeConfig()
    const router = useRouter()

    const isLoggedIn = computed(() => !!token.value)

    async function register(formData: FormData | Record<string, unknown>) {
        try {
            const nuxtApp = useNuxtApp()
            const currentLang = nuxtApp.$i18n?.locale?.value || 'uz'
            if (formData instanceof FormData) {
                formData.append('lang', currentLang)
            } else {
                formData.lang = currentLang
            }
            const data = await $fetch<{ message: string }>(`${config.public.apiBase}/api/auth/register/`, {
                method: 'POST',
                body: formData
            })
            return { success: true, message: data.message }
        } catch (err: any) {
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function verifyEmail(email: string, code: string) {
        try {
            const data = await $fetch<AuthTokens & { user: AuthUser }>(`${config.public.apiBase}/api/auth/verify-email/`, {
                method: 'POST',
                body: { email, code }
            })
            token.value = data.access
            user.value = data.user
            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function login(email: string, password: string) {
        try {
            const nuxtApp = useNuxtApp()
            const currentLang = nuxtApp.$i18n?.locale?.value || 'uz'
            const data = await $fetch<AuthTokens & { user: AuthUser }>(`${config.public.apiBase}/api/auth/login/`, {
                method: 'POST',
                body: { email, password, lang: currentLang }
            })
            token.value = data.access
            user.value = data.user
            return { success: true }
        } catch (err: any) {
            if (err.data?.needs_verification) {
                return { success: false, needs_verification: true, error: err.data.error }
            }
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function fetchUser() {
        if (!token.value) return
        try {
            const data = await $fetch<AuthUser>(`${config.public.apiBase}/api/auth/me/`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            user.value = data
        } catch (err) {
            logout()
        }
    }

    async function updateProfile(formData: FormData | Record<string, unknown>) {
        try {
            const data = await $fetch<AuthUser & { message: string }>(`${config.public.apiBase}/api/auth/me/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token.value}`
                },
                body: formData
            })
            user.value = data
            return { success: true, message: data.message }
        } catch (err: any) {
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    function logout() {
        token.value = null
        user.value = null
        router.push('/login')
    }

    return {
        user,
        token,
        isLoggedIn,
        register,
        verifyEmail,
        login,
        fetchUser,
        updateProfile,
        logout
    }
}
