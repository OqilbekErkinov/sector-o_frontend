<template>
    <div class="menu-back container" style="padding: 0 !important; margin: 0">
        <div class="menu container">
            <NuxtLink @click="hapticLight" to="/" :class="{ active: $route.path === '/' }" aria-label="Home">
                <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24.7144 10.9785C24.7144 11.752 24.0779 12.3578 23.3564 12.3578H21.9984L22.0281 19.2414C22.0281 19.3574 22.0196 19.4734 22.0069 19.5895V20.2855C22.0069 21.2352 21.2472 22.0043 20.3093 22.0043H19.6303C19.5836 22.0043 19.537 22.0043 19.4903 22C19.4309 22.0043 19.3714 22.0043 19.312 22.0043L17.9328 22H16.9143C15.9764 22 15.2167 21.2309 15.2167 20.2813V19.25V16.5C15.2167 15.7395 14.6099 15.125 13.8587 15.125H11.1427C10.3915 15.125 9.78464 15.7395 9.78464 16.5V19.25V20.2813C9.78464 21.2309 9.025 22 8.08711 22H7.06859H5.71481C5.65116 22 5.5875 21.9957 5.52384 21.9914C5.47292 21.9957 5.42199 22 5.37106 22H4.69205C3.75417 22 2.99452 21.2309 2.99452 20.2813V15.4688C2.99452 15.4301 2.99452 15.3871 2.99876 15.3484V12.3535H1.64074C0.87685 12.3535 0.282715 11.752 0.282715 10.9742C0.282715 10.5875 0.41003 10.2438 0.707098 9.94297L11.584 0.34375C11.8811 0.0429688 12.2206 0 12.5177 0C12.8147 0 13.1542 0.0859375 13.4089 0.300781L24.2476 9.94727C24.5871 10.248 24.7569 10.5918 24.7144 10.9785Z"
                        :fill="$route.path === '/' ? '#00CFFF' : '#525252'" />
                </svg>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/nutrition" :class="{ active: ['/nutrition'].includes($route.path) }" aria-label="Nutrition">
                <svg width="25" height="25" viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M127.9 78.4C127.1 70.2 120.2 64 112 64C103.8 64 96.9 70.2 96 78.3L81.9 213.7C80.6 219.7 80 225.8 80 231.9C80 277.8 115.1 315.5 160 319.6L160 544C160 561.7 174.3 576 192 576C209.7 576 224 561.7 224 544L224 319.6C268.9 315.5 304 277.8 304 231.9C304 225.8 303.4 219.7 302.1 213.7L287.9 78.3C287.1 70.2 280.2 64 272 64C263.8 64 256.9 70.2 256.1 78.4L242.5 213.9C241.9 219.6 237.1 224 231.4 224C225.6 224 220.8 219.6 220.2 213.8L207.9 78.6C207.2 70.3 200.3 64 192 64C183.7 64 176.8 70.3 176.1 78.6L163.8 213.8C163.3 219.6 158.4 224 152.6 224C146.8 224 142 219.6 141.5 213.9L127.9 78.4zM512 64C496 64 384 96 384 240L384 352C384 387.3 412.7 416 448 416L480 416L480 544C480 561.7 494.3 576 512 576C529.7 576 544 561.7 544 544L544 96C544 78.3 529.7 64 512 64z"
                        :fill="['/nutrition'].includes($route.path) ? '#00CFFF' : '#525252'" />

                </svg>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/programs" :class="{ active: ['/programs', '/training'].includes($route.path) }" aria-label="Styles">
                <NuxtImg format="webp" style="margin-top: -1.2rem; width: 55px;"
                    :src="['/programs', '/training'].includes($route.path) ? '/images/logo4.png' : '/images/logo3.png'"
                    alt="Logo" />
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/exercises-category" :class="{ active: ['/exercises-category', '/exercises-type', '/exercises-detail'].includes($route.path) }" aria-label="Exercises">
                <svg width="26" height="26" viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M96 176C96 149.5 117.5 128 144 128C170.5 128 192 149.5 192 176L192 288L448 288L448 176C448 149.5 469.5 128 496 128C522.5 128 544 149.5 544 176L544 192L560 192C586.5 192 608 213.5 608 240L608 288C625.7 288 640 302.3 640 320C640 337.7 625.7 352 608 352L608 400C608 426.5 586.5 448 560 448L544 448L544 464C544 490.5 522.5 512 496 512C469.5 512 448 490.5 448 464L448 352L192 352L192 464C192 490.5 170.5 512 144 512C117.5 512 96 490.5 96 464L96 448L80 448C53.5 448 32 426.5 32 400L32 352C14.3 352 0 337.7 0 320C0 302.3 14.3 288 32 288L32 240C32 213.5 53.5 192 80 192L96 192L96 176z"
                        :fill="['/exercises-category', '/exercises-type', '/exercises-detail'].includes($route.path) ? '#00CFFF' : '#525252'" />
                </svg>
            </NuxtLink>
            <NuxtLink @click="hapticLight" to="/profile" :class="{ active: ['/profile', '/premium', '/premium-done'].includes($route.path) }" aria-label="Profile">
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_193_1091)">
                        <path
                            d="M9.625 11C11.0837 11 12.4826 10.4205 13.5141 9.38909C14.5455 8.35764 15.125 6.95869 15.125 5.5C15.125 4.04131 14.5455 2.64236 13.5141 1.61091C12.4826 0.579463 11.0837 0 9.625 0C8.16631 0 6.76736 0.579463 5.73591 1.61091C4.70446 2.64236 4.125 4.04131 4.125 5.5C4.125 6.95869 4.70446 8.35764 5.73591 9.38909C6.76736 10.4205 8.16631 11 9.625 11ZM7.66133 13.0625C3.42891 13.0625 0 16.4914 0 20.7238C0 21.4285 0.571484 22 1.27617 22H17.9738C18.6785 22 19.25 21.4285 19.25 20.7238C19.25 16.4914 15.8211 13.0625 11.5887 13.0625H7.66133Z"
                            :fill="['/profile', '/premium', '/premium-done'].includes($route.path) ? '#00CFFF' : '#515151'" />
                    </g>
                    <defs>
                        <clipPath id="clip0_193_1091">
                            <rect width="19.25" height="22" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { useHaptic } from '~/composables/useHaptic';

const { hapticLight } = useHaptic();
</script>

<style scoped>
.menu {
    position: fixed;
    bottom: 1.5rem;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #2A2A2A;
    box-shadow: 0 0 8px rgba(18, 95, 128, 0.5);
    padding: 8px;
    border-radius: 15px;
    width: 80%;
    height: 50px;
    color: white;
    z-index: 4100;
      max-width: 450px !important;
}

.menu a svg path {
    transition: fill 0.3s ease;
}

.menu a:hover svg path {
    fill: #00CFFF !important;
}

.menu a.active svg path {
    fill: #00CFFF !important;
}
</style>
