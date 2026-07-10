// Reassigns the global `$fetch` (used directly by composables like useTracking,
// useUserProgram, etc.) so an expired/invalid JWT is handled consistently
// everywhere, not just in the few call sites that already had their own
// catch block for it. Only fires when a token was actually being sent —
// a 401 from LoginView on wrong credentials must NOT log the (not yet
// logged in) user out or redirect them away from the form they're filling in.
export default defineNuxtPlugin(() => {
  const { token, logout } = useAuth()

  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401 && token.value) {
        logout()
      }
    },
  })
})
