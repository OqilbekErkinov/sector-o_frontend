<script setup lang="ts">
useHead({
  link: [
    {
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
      rel: "stylesheet",
      media: "print",
      onload: "this.media='all'",
      integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
      crossorigin: "anonymous"
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
      rel: "stylesheet",
      media: "print",
      onload: "this.media='all'"
    },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
  ],
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
      defer: true,
      integrity: "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
      crossorigin: "anonymous"
    }
  ]
})

const route = useRoute()
const { fetchUser, isLoggedIn } = useAuth()

onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchUser()
  }
})
</script>


<template>
  <div>
    <main>
      <slot />
    </main>
    <Menu v-if="route.path !== '/downloading' && route.path !== '/success'"
      :class="{ 'fixed-footer': route.path === '/styles-pro' || route.path === '/creator' || route.path === '/creator-pro'}" />
  </div>
</template>

<style scoped>
/* .fixed-footer {
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
} */
</style>