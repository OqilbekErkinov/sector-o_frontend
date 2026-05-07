import { ref } from 'vue'

export const useAuth = () => {
    const user = useState('auth_user', () => null)
    const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
    const config = useRuntimeConfig()
    const router = useRouter()

    const isLoggedIn = computed(() => !!token.value)

    async function register(formData) {
        try {
            const nuxtApp = useNuxtApp()
            const currentLang = nuxtApp.$i18n?.locale?.value || 'uz'
            if (formData instanceof FormData) {
                formData.append('lang', currentLang)
            } else {
                formData.lang = currentLang
            }
            const data = await $fetch(`${config.public.apiBase}/api/auth/register/`, {
                method: 'POST',
                body: formData
            })
            return { success: true, message: data.message }
        } catch (err) {
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function verifyEmail(email, code) {
        try {
            const data = await $fetch(`${config.public.apiBase}/api/auth/verify-email/`, {
                method: 'POST',
                body: { email, code }
            })
            token.value = data.access
            user.value = data.user
            return { success: true }
        } catch (err) {
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function login(email, password) {
        try {
            const nuxtApp = useNuxtApp()
            const currentLang = nuxtApp.$i18n?.locale?.value || 'uz'
            const data = await $fetch(`${config.public.apiBase}/api/auth/login/`, {
                method: 'POST',
                body: { email, password, lang: currentLang }
            })
            token.value = data.access
            user.value = data.user
            return { success: true }
        } catch (err) {
            if (err.data?.needs_verification) {
                return { success: false, needs_verification: true, error: err.data.error }
            }
            return { success: false, error: err.data?.error || 'Xatolik yuz berdi' }
        }
    }

    async function fetchUser() {
        if (!token.value) return
        try {
            const data = await $fetch(`${config.public.apiBase}/api/auth/me/`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
            user.value = data
        } catch (err) {
            logout()
        }
    }

    async function updateProfile(formData) {
        try {
            const data = await $fetch(`${config.public.apiBase}/api/auth/me/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token.value}`
                },
                body: formData
            })
            user.value = data
            return { success: true, message: data.message }
        } catch (err) {
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
