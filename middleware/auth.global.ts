export default defineNuxtRouteMiddleware((to, from) => {
    const { token } = useAuth()
    
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password']
    
    if (publicPages.includes(to.path)) {
        if (token.value) {
            return navigateTo('/')
        }
        return
    }

    if (!token.value) {
        return navigateTo('/login')
    }
})
