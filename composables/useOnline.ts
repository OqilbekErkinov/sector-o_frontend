export const useOnline = () => {
  const isOnline = useState('is_online', () => true)

  onMounted(() => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', () => { isOnline.value = true })
    window.addEventListener('offline', () => { isOnline.value = false })
  })

  return { isOnline }
}
