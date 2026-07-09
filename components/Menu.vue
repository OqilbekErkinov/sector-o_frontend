<template>
    <div class="menu-back container" style="padding: 0 !important; margin: 0">
        <transition name="fade-scale">
            <div v-if="moreOpen" class="more-backdrop" @click="moreOpen = false"></div>
        </transition>
        <div class="menu-stack">
        <transition name="fade-scale">
            <div v-if="moreOpen" class="more-popup">
                                <NuxtLink to="/nutrition" class="more-item" :class="{ active: $route.path === '/nutrition' }" @click="closeMore">
                    <span class="more-item-icon">
                        <svg width="18" height="20" viewBox="0 0 640 640" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M127.9 78.4C127.1 70.2 120.2 64 112 64C103.8 64 96.9 70.2 96 78.3L81.9 213.7C80.6 219.7 80 225.8 80 231.9C80 277.8 115.1 315.5 160 319.6L160 544C160 561.7 174.3 576 192 576C209.7 576 224 561.7 224 544L224 319.6C268.9 315.5 304 277.8 304 231.9C304 225.8 303.4 219.7 302.1 213.7L287.9 78.3C287.1 70.2 280.2 64 272 64C263.8 64 256.9 70.2 256.1 78.4L242.5 213.9C241.9 219.6 237.1 224 231.4 224C225.6 224 220.8 219.6 220.2 213.8L207.9 78.6C207.2 70.3 200.3 64 192 64C183.7 64 176.8 70.3 176.1 78.6L163.8 213.8C163.3 219.6 158.4 224 152.6 224C146.8 224 142 219.6 141.5 213.9L127.9 78.4zM512 64C496 64 384 96 384 240L384 352C384 387.3 412.7 416 448 416L480 416L480 544C480 561.7 494.3 576 512 576C529.7 576 544 561.7 544 544L544 96C544 78.3 529.7 64 512 64z" />
                        </svg>
                    </span>
                    <span class="more-item-label">{{ $t('nutrition.title') || 'Sport ozuqalari' }}</span>
                </NuxtLink>
                <NuxtLink to="/calculator" class="more-item" :class="{ active: $route.path === '/calculator' }" @click="closeMore">
                    <span class="more-item-icon">
                        <svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                            <line x1="8" y1="6" x2="16" y2="6"></line>
                            <line x1="8" y1="10" x2="8.01" y2="10"></line>
                            <line x1="12" y1="10" x2="12.01" y2="10"></line>
                            <line x1="16" y1="10" x2="16.01" y2="10"></line>
                            <line x1="8" y1="14" x2="8.01" y2="14"></line>
                            <line x1="12" y1="14" x2="12.01" y2="14"></line>
                            <line x1="16" y1="14" x2="16.01" y2="14"></line>
                            <line x1="8" y1="18" x2="8.01" y2="18"></line>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                    </span>
                    <span class="more-item-label">{{ $t('calculator.title') || 'Kalkulyator' }}</span>
                </NuxtLink>
                <NuxtLink to="/rankings" class="more-item" :class="{ active: $route.path === '/rankings' }" @click="closeMore">
                    <span class="more-item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </span>
                    <span class="more-item-label">{{ $t('profile.rankings') || 'Reyting' }}</span>
                </NuxtLink>
                <NuxtLink to="/chat" class="more-item" :class="{ active: $route.path.startsWith('/chat') }" @click="closeMore">
                    <span class="more-item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span v-if="user?.unread_conversations_count > 0" class="more-badge">{{ user.unread_conversations_count }}</span>
                    </span>
                    <span class="more-item-label">{{ $t('profile.chat') || 'Xabarlar' }}</span>
                </NuxtLink>
                <NuxtLink to="/profile" class="more-item" :class="{ active: ['/profile', '/premium', '/premium-done'].includes($route.path) }" @click="closeMore">
                    <span class="more-item-icon">
                        <svg width="18" height="20" viewBox="0 0 20 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.625 11C11.0837 11 12.4826 10.4205 13.5141 9.38909C14.5455 8.35764 15.125 6.95869 15.125 5.5C15.125 4.04131 14.5455 2.64236 13.5141 1.61091C12.4826 0.579463 11.0837 0 9.625 0C8.16631 0 6.76736 0.579463 5.73591 1.61091C4.70446 2.64236 4.125 4.04131 4.125 5.5C4.125 6.95869 4.70446 8.35764 5.73591 9.38909C6.76736 10.4205 8.16631 11 9.625 11ZM7.66133 13.0625C3.42891 13.0625 0 16.4914 0 20.7238C0 21.4285 0.571484 22 1.27617 22H17.9738C18.6785 22 19.25 21.4285 19.25 20.7238C19.25 16.4914 15.8211 13.0625 11.5887 13.0625H7.66133Z" />
                        </svg>
                    </span>
                    <span class="more-item-label">{{ $t('profile.title') || 'Profil' }}</span>
                </NuxtLink>
            </div>
        </transition>

        <div class="menu container" :class="{ merged: moreOpen }">
            <NuxtLink @click="hapticLight" to="/" class="nav-item" :class="{ active: $route.path === '/' }">
                <svg width="22" height="20" viewBox="0 0 25 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24.7144 10.9785C24.7144 11.752 24.0779 12.3578 23.3564 12.3578H21.9984L22.0281 19.2414C22.0281 19.3574 22.0196 19.4734 22.0069 19.5895V20.2855C22.0069 21.2352 21.2472 22.0043 20.3093 22.0043H19.6303C19.5836 22.0043 19.537 22.0043 19.4903 22C19.4309 22.0043 19.3714 22.0043 19.312 22.0043L17.9328 22H16.9143C15.9764 22 15.2167 21.2309 15.2167 20.2813V19.25V16.5C15.2167 15.7395 14.6099 15.125 13.8587 15.125H11.1427C10.3915 15.125 9.78464 15.7395 9.78464 16.5V19.25V20.2813C9.78464 21.2309 9.025 22 8.08711 22H7.06859H5.71481C5.65116 22 5.5875 21.9957 5.52384 21.9914C5.47292 21.9957 5.42199 22 5.37106 22H4.69205C3.75417 22 2.99452 21.2309 2.99452 20.2813V15.4688C2.99452 15.4301 2.99452 15.3871 2.99876 15.3484V12.3535H1.64074C0.87685 12.3535 0.282715 11.752 0.282715 10.9742C0.282715 10.5875 0.41003 10.2438 0.707098 9.94297L11.584 0.34375C11.8811 0.0429688 12.2206 0 12.5177 0C12.8147 0 13.1542 0.0859375 13.4089 0.300781L24.2476 9.94727C24.5871 10.248 24.7569 10.5918 24.7144 10.9785Z" />
                </svg>
                <span class="nav-label">{{ $t('nav.home') }}</span>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/tracking" class="nav-item" :class="{ active: $route.path === '/tracking' }">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
                <span class="nav-label">{{ $t('tracking.title') }}</span>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/programs" class="nav-item" :class="{ active: ['/programs', '/training'].includes($route.path) }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2L6 13H11L9 22L18 10H13L14 2Z"></path>
                </svg>
                <span class="nav-label">{{ $t('nav.programs') }}</span>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/exercises-category" class="nav-item" :class="{ active: ['/exercises-category', '/exercises-type', '/exercises-detail'].includes($route.path) }">
                <svg width="22" height="22" viewBox="0 0 640 640" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z" />
                </svg>
                <span class="nav-label">{{ $t('nav.exercises') }}</span>
            </NuxtLink>
            <button type="button" class="nav-item more-trigger" :class="{ active: moreActive }" @click="toggleMore">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2.2" />
                    <circle cx="12" cy="12" r="2.2" />
                    <circle cx="19" cy="12" r="2.2" />
                </svg>
                <span class="nav-label">{{ $t('nav.more') }}</span>
            </button>
        </div>
        </div>
    </div>
</template>

<script setup>
import { useHaptic } from '~/composables/useHaptic';
import { useAuth } from '~/composables/useAuth';

const { hapticLight } = useHaptic();
const { user } = useAuth();
const route = useRoute();

const moreOpen = ref(false);

// "More" covers everything that isn't one of the other 4 fixed tabs, so its
// dot indicator lights up on any of those pages too (including chat's
// sub-routes like /chat/:id, which aren't a plain string match).
const moreActive = computed(() => {
    const p = route.path;
    return ['/profile', '/premium', '/premium-done', '/rankings', '/nutrition', '/calculator'].includes(p)
        || p.startsWith('/chat');
});

function toggleMore() {
    hapticLight();
    moreOpen.value = !moreOpen.value;
}

function closeMore() {
    hapticLight();
    moreOpen.value = false;
}

watch(() => route.path, () => { moreOpen.value = false; });
</script>

<style scoped>
/* Fixed-position, intrinsic-height wrapper anchored to the bottom of the
   viewport — .more-popup and .menu stack inside it via flex-column, so
   opening the popup grows the stack upward from the same fixed bottom
   edge instead of needing separate positioning math for each piece. */
.menu-stack {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 450px !important;
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 4100;
}

.menu {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #2A2A2A;
    box-shadow: 0 0 8px rgba(18, 95, 128, 0.5);
    padding: 8px 6px;
    border-radius: 15px;
    position: relative;
}

/* When the popup is open above it, the two are meant to read as one
   continuous card — the shared edge loses its own rounding and shadow, and
   pulls up 1px to close any sub-pixel seam between the two pieces. */
.menu.merged {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: none;
    margin-top: -1px;
}

/* One rule set drives every icon's color, whether it's fill-based or
   stroke-based (each icon just points fill/stroke at currentColor) — so
   gray-by-default / cyan-on-hover / cyan-when-active behaves identically
   across all five nav items instead of needing a per-icon CSS override. */
.menu a {
    color: #525252;
    transition: color 0.25s ease;
    text-decoration: none;
}

.menu a:hover,
.menu a.active,
.more-trigger:hover,
.more-trigger.active {
    color: #00CFFF;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex: 1;
    min-width: 0;
}

.nav-label {
    color: #fff;
    font-size: 9.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.more-trigger {
    background: none;
    border: none;
    padding: 0;
    color: #525252;
    transition: color 0.25s ease;
    cursor: pointer;
}

.more-backdrop {
    position: fixed;
    inset: 0;
    z-index: 4090;
}

/* Laid out as one horizontal row, same pill shape/spacing language as the
   main tab bar — and the same width, sitting flush on top of it so the two
   read as a single joined card (shared edge is flattened on both sides). */
.more-popup {
    width: 100%;
    background: #2A2A2A;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: none;
    border-radius: 18px 18px 0 0;
    box-shadow: 0 -2px 14px rgba(0, 0, 0, 0.3);
    padding: 12px 4px;
    padding-bottom: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
}

/* Same gray-by-default / cyan-on-hover-or-active language as the main tab
   bar (.menu a) — the icon follows currentColor, the circle behind it and
   the label tint along with it, so the two menus read as one system. */
.more-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
    text-decoration: none;
    color: #525252;
    flex: 1;
    min-width: 0;
    padding: 2px;
    border-radius: 12px;
    transition: color 0.25s ease;
}

.more-item:hover,
.more-item.active {
    color: #00CFFF;
}

.more-item-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
}

.more-item-label {
    font-size: 10.5px;
    font-weight: 600;
    text-align: center;
    line-height: 1.25;
    white-space: normal;
    word-break: break-word;
    max-width: 64px;
    color: #fff;
}

.more-badge {
    position: absolute;
    top: -4px;
    right: -6px;
    background: #ff6b6b;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    padding: 1px 5px;
    min-width: 16px;
    text-align: center;
    line-height: 1.4;
}
</style>
