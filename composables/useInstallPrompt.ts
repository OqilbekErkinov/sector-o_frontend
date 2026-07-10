// Ilovani "Bosh ekranga o'rnatish" tugmasi uchun.
// Android/Chrome/Desktop: @vite-pwa/nuxt'ning o'zi taqdim etadigan usePWA() orqali
// tayyor beforeinstallprompt oqimidan foydalanamiz.
// iOS (Safari): brauzer beforeinstallprompt'ni umuman qo'llamaydi, shuning uchun
// qo'lda aniqlab, "Share -> Add to Home Screen" ko'rsatmasini ko'rsatish kerak bo'ladi.

export const useInstallPrompt = () => {
  const pwa = usePWA()

  const isIOS = ref(false)
  const isStandaloneIOS = ref(false)

  onMounted(() => {
    const ua = window.navigator.userAgent
    const isAppleTouchDevice = /iPad|iPhone|iPod/.test(ua)
      // iPadOS 13+ Safari o'zini Mac deb tanishtiradi, lekin sensorli ekran bilan
      || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
    isIOS.value = isAppleTouchDevice
    isStandaloneIOS.value = (window.navigator as any).standalone === true
  })

  const isInstalled = computed(() => Boolean(pwa?.isPWAInstalled) || isStandaloneIOS.value)

  const canShowInstallButton = computed(() => {
    if (isInstalled.value) return false
    if (isIOS.value) return true
    return Boolean(pwa?.showInstallPrompt)
  })

  const promptInstall = async () => {
    if (isIOS.value || !pwa) return
    await pwa.install()
  }

  return { isIOS, isInstalled, canShowInstallButton, promptInstall }
}
