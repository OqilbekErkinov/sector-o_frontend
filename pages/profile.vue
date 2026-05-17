<template>
    <div class="profile-page">
        <h1 class="profile-title">{{ $t('profile.title') }}</h1>
        <div class="profile-photo">
            <div class="photo-container">
                <div class="photo-wrapper">
                    <NuxtImg format="webp" loading="lazy" :src="userImage || '/images/profile.png'" alt=""
                        class="avatar-img" />
                    
                    <div class="photo-overlay">
                        <label for="fileUpload" class="overlay-btn edit-btn" :title="$t('profile.change_photo')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </label>
                        <button v-if="userImage" @click="deletePhoto" class="overlay-btn delete-btn" :title="$t('profile.delete_photo')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                    <input type="file" id="fileUpload" accept="image/*" @change="onFileChange" hidden />
                </div>
            </div>
        </div>
        <div class="premium-card">
            <NuxtLink to="/" class="premium-name">Sector-<span style="color: #00CFFF;">O</span></NuxtLink>
            <div class="user-info-stack">
                <span class="user-display-name">{{ user?.full_name || '—' }}</span>
                <!-- <span class="user-display-phone" style="margin-bottom: 5px">{{ user?.phone || '—' }}</span> -->
                
                <div class="gamification-badges">
                    <span class="level-badge-profile">LVL {{ user?.level || 1 }}</span>
                    <span class="xp-badge">{{ user?.xp || 0 }} XP</span>
                </div>
            </div>
        </div>
        <div class="menu-items">
            <div class="menu-item" @click="openSection('settings')">
                <div class="menu-text" :class="{ 'subtitle-greyed': showSettings }">
                    <svg v-if="!showSettings" style="margin-right: 0.5rem !important;" class="me-2" width="22" height="19" viewBox="0 0 18 19" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.9501 6.18363C18.0695 6.50654 17.9688 6.86658 17.7114 7.0967L16.0963 8.55909C16.1373 8.86716 16.1597 9.18265 16.1597 9.50186C16.1597 9.82106 16.1373 10.1365 16.0963 10.4446L17.7114 11.907C17.9688 12.1371 18.0695 12.4972 17.9501 12.8201C17.786 13.2618 17.5883 13.6849 17.3608 14.0932L17.1855 14.3938C16.9393 14.8021 16.6633 15.1881 16.3611 15.5519C16.1411 15.8191 15.7755 15.9082 15.4473 15.8043L13.3697 15.1473C12.8699 15.5296 12.3178 15.8488 11.7285 16.0901L11.2622 18.2094C11.1876 18.5472 10.9265 18.8144 10.5834 18.8701C10.0686 18.9555 9.53898 19 8.99814 19C8.45729 19 7.92763 18.9555 7.41289 18.8701C7.06973 18.8144 6.80863 18.5472 6.73403 18.2094L6.26779 16.0901C5.67845 15.8488 5.12641 15.5296 4.62659 15.1473L2.55272 15.808C2.22448 15.9119 1.85894 15.8191 1.63887 15.5556C1.33674 15.1918 1.06072 14.8058 0.814545 14.3975L0.639236 14.0969C0.411707 13.6886 0.214018 13.2655 0.0498982 12.8238C-0.0694614 12.5009 0.0312482 12.1408 0.288617 11.9107L1.9037 10.4483C1.86267 10.1365 1.84029 9.82106 1.84029 9.50186C1.84029 9.18265 1.86267 8.86716 1.9037 8.55909L0.288617 7.0967C0.0312482 6.86658 -0.0694614 6.50654 0.0498982 6.18363C0.214018 5.74194 0.411707 5.31881 0.639236 4.91053L0.814545 4.60988C1.06072 4.2016 1.33674 3.81559 1.63887 3.45185C1.85894 3.18461 2.22448 3.09553 2.55272 3.19945L4.63032 3.85642C5.13014 3.47412 5.68218 3.15491 6.27152 2.91366L6.73776 0.794296C6.81236 0.456534 7.07346 0.189295 7.41662 0.13362C7.93136 0.0445399 8.46102 0 9.00187 0C9.54271 0 10.0724 0.04454 10.5871 0.129908C10.9303 0.185583 11.1914 0.452823 11.266 0.790584L11.7322 2.90994C12.3216 3.1512 12.8736 3.4704 13.3734 3.85271L15.451 3.19574C15.7793 3.09181 16.1448 3.18461 16.3649 3.44813C16.667 3.81188 16.943 4.19789 17.1892 4.60617L17.3645 4.90682C17.592 5.3151 17.7897 5.73823 17.9538 6.17992L17.9501 6.18363ZM9.00187 12.4712C9.79327 12.4712 10.5523 12.1583 11.1119 11.6015C11.6715 11.0446 11.9859 10.2894 11.9859 9.50186C11.9859 8.71434 11.6715 7.95908 11.1119 7.40222C10.5523 6.84537 9.79327 6.53253 9.00187 6.53253C8.21046 6.53253 7.45147 6.84537 6.89187 7.40222C6.33226 7.95908 6.01788 8.71434 6.01788 9.50186C6.01788 10.2894 6.33226 11.0446 6.89187 11.6015C7.45147 12.1583 8.21046 12.4712 9.00187 12.4712Z"
                            fill="#515151" />
                    </svg>
                    {{ $t('profile.settings') }}
                </div>
                <div class="menu-arrow">
                    <svg v-if="showSettings" style="margin-right: 0.5rem !important;"width="14" height="15" viewBox="0 0 14 15" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.69873L13 13.7669M13 1.69873L1 13.7669" stroke="white" stroke-width="1.5"
                            stroke-linecap="round" />
                    </svg>
                    <svg v-else style="margin-right: 0.5rem !important;" width="8" height="14" viewBox="0 0 8 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="white" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
            <transition name="expand">
                <div v-if="showSettings" class="dropdown">
                    <!-- Personal Info Dropdown -->
                    <div class="dropdown-subtitle" @click="showEditProfile = !showEditProfile">
                        <svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="showEditProfile ? '#00CFFF' : '#515151'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {{ $t('profile.personal_info') || "Shaxsiy ma'lumotlar" }}
                    </div>
                    <div v-if="showEditProfile" class="edit-section">
                        <label class="edit-label">{{ $t('profile.edit_full_name') }}</label>
                        <input v-model="editForm.full_name" :placeholder="$t('profile.edit_full_name')">
                        <label class="edit-label">{{ $t('profile.edit_phone') }}</label>
                        <input v-model="editForm.phone" :placeholder="$t('profile.edit_phone')">
                        <label class="edit-label">{{ $t('profile.edit_email') }}</label>
                        <input v-model="editForm.email" :placeholder="$t('profile.edit_email')">
                        <label class="edit-label">{{ $t('profile.edit_weekly_goal') }}</label>
                        <input v-model.number="editForm.weekly_goal" type="number" min="1" max="7" :placeholder="$t('profile.edit_weekly_goal_placeholder')">
                        <button @click="handleUpdateProfile" :disabled="isUpdating">
                            {{ isUpdating ? $t('profile.saving') : $t('profile.save') }}
                        </button>
                    </div>

                    <!-- Language Selection -->
                    <div class="dropdown-subtitle" @click="showLanguages = !showLanguages">
                        <svg class="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_449_8189)">
                                <path
                                    d="M13.0625 9.5C13.0625 10.3238 13.018 11.118 12.94 11.875H6.06367C5.98203 11.118 5.94121 10.3238 5.94121 9.5C5.94121 8.67617 5.98574 7.88203 6.06367 7.125H12.94C13.0217 7.88203 13.0625 8.67617 13.0625 9.5ZM14.1312 7.125H18.6994C18.8961 7.88574 19 8.67988 19 9.5C19 10.3201 18.8961 11.1143 18.6994 11.875H14.1312C14.2092 11.1105 14.25 10.3164 14.25 9.5C14.25 8.68359 14.2092 7.88945 14.1312 7.125ZM18.3098 5.9375H13.9791C13.608 3.56621 12.8732 1.58086 11.927 0.311719C14.8326 1.07988 17.1965 3.1877 18.3061 5.9375H18.3098ZM12.7768 5.9375H6.22324C6.44961 4.58672 6.79844 3.3918 7.2252 2.42324C7.61484 1.54746 8.04902 0.912891 8.46836 0.512109C8.88398 0.11875 9.2291 0 9.5 0C9.7709 0 10.116 0.11875 10.5316 0.512109C10.951 0.912891 11.3852 1.54746 11.7748 2.42324C12.2053 3.38809 12.5504 4.58301 12.7768 5.9375ZM5.0209 5.9375H0.690234C1.80352 3.1877 4.16367 1.07988 7.07305 0.311719C6.12676 1.58086 5.39199 3.56621 5.0209 5.9375ZM0.300586 7.125H4.86875C4.79082 7.88945 4.75 8.68359 4.75 9.5C4.75 10.3164 4.79082 11.1105 4.86875 11.875H0.300586C0.103906 11.1143 0 10.3201 0 9.5C0 8.67988 0.103906 7.88574 0.300586 7.125ZM7.2252 16.573C6.79473 15.6082 6.44961 14.4133 6.22324 13.0625H12.7768C12.5504 14.4133 12.2016 15.6082 11.7748 16.573C11.3852 17.4488 10.951 18.0834 10.5316 18.4842C10.116 18.8813 9.7709 19 9.5 19C9.2291 19 8.88398 18.8813 8.46836 18.4879C8.04902 18.0871 7.61484 17.4525 7.2252 16.5768V16.573ZM5.0209 13.0625C5.39199 15.4338 6.12676 17.4191 7.07305 18.6883C4.16367 17.9201 1.80352 15.8123 0.690234 13.0625H5.0209ZM18.3098 13.0625C17.1965 15.8123 14.8363 17.9201 11.9307 18.6883C12.877 17.4191 13.608 15.4338 13.9828 13.0625H18.3135H18.3098Z"
                                    :fill="showLanguages ? '#00CFFF' : '#515151'" />
                            </g>
                            <defs>
                                <clipPath id="clip0_449_8189">
                                    <rect width="19" height="19" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        {{ $t('profile.language') }} ({{ locale.toUpperCase() }})
                        <span class="menu-arrow" style="color: #515151; font-size: 15px">{{ locale === 'uz' ? "O'zbekcha" :
                            locale === 'en' ? 'English' : 'Русский' }}</span>
                    </div>
                    <div v-if="showLanguages" class="lang-list">
                        <div v-for="l in ['uz', 'ru', 'en']" :key="l" @click="setLocale(l); showLanguages = false" class="lang-item" :class="{active: locale === l}">
                            {{ l === 'uz' ? "O'zbekcha" : l === 'en' ? 'English' : 'Русский' }}
                        </div>
                    </div>
                </div>
            </transition>

            <div class="menu-item" @click="openSection('care')">
                <a class="menu-text" :class="{ 'subtitle-greyed': showCareServiceModal }">
                    <span class="menu-icon" :class="{ 'icon-hidden': showCareServiceModal }">
                        <svg width="22" height="19" viewBox="0 0 22 19" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.04531 11.2064L9.80977 18.527C10.132 18.8308 10.5574 19 11 19C11.4426 19 11.868 18.8308 12.1902 18.527L19.9547 11.2064C21.2609 9.9784 22 8.25566 22 6.45481V6.20313C22 3.16989 19.8301 0.58361 16.8695 0.0845793C14.9102 -0.245215 12.9164 0.401355 11.5156 1.816L11 2.33672L10.4844 1.816C9.08359 0.401355 7.08984 -0.245215 5.13047 0.0845793C2.16992 0.58361 0 3.16989 0 6.20313V6.45481C0 8.25566 0.739062 9.9784 2.04531 11.2064Z"
                                fill="#515151" />
                        </svg>
                    </span>
                    {{ $t('profile.care_service') }}
                </a>
                <div class="menu-arrow">
                    <svg v-if="showCareServiceModal" width="14" height="15" viewBox="0 0 14 15" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.69873L13 13.7669M13 1.69873L1 13.7669" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="white" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
            <transition name="expand">
                <div v-if="showCareServiceModal" class="dropdown care-dropdown">
                    <p class="care-desc">{{ $t('profile.care_service_desc') }}</p>
                    <a href="https://t.me/oqilbek_erkinov" target="_blank" class="care-link">
                        {{ $t('profile.care_service_btn') }} →
                    </a>
                </div>
            </transition>
            <div class="menu-item" @click="openSection('social')">
                <div class="menu-text" :class="{ 'subtitle-greyed': showSocialNetworkModal }">
                    <span class="menu-icon" :class="{ 'icon-hidden': showSocialNetworkModal }">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11 0C4.92339 0 0 4.92339 0 11C0 17.0766 4.92339 22 11 22C17.0766 22 22 17.0766 22 11C22 4.92339 17.0766 0 11 0ZM16.1008 7.48266C15.9367 9.22137 15.2181 13.444 14.8544 15.3911C14.6992 16.2161 14.3976 16.4911 14.1048 16.5177C13.4661 16.5754 12.9827 16.0964 12.3617 15.6883C11.3948 15.054 10.8448 14.6593 9.90887 14.0383C8.82218 13.3242 9.52742 12.9294 10.144 12.2863C10.3081 12.1177 13.1202 9.55847 13.1734 9.32782C13.1823 9.29677 13.1867 9.19032 13.1202 9.13266C13.0536 9.075 12.9605 9.09718 12.894 9.11048C12.7964 9.13118 11.2499 10.1528 8.25444 12.1754C7.8168 12.477 7.41909 12.6234 7.06129 12.6145C6.66653 12.6056 5.9125 12.3927 5.34919 12.2109C4.66169 11.9891 4.11169 11.8694 4.16048 11.4879C4.18414 11.2898 4.45766 11.0872 4.98105 10.8802C8.18643 9.48454 10.3243 8.56344 11.3948 8.11694C14.4508 6.84839 15.0851 6.62661 15.4976 6.61774C15.5907 6.61774 15.7903 6.63992 15.9234 6.74637C16.0102 6.82272 16.0656 6.92865 16.0786 7.04355C16.1026 7.18861 16.1101 7.33592 16.1008 7.48266Z"
                                fill="#515151" />
                        </svg>
                    </span>
                    {{ $t('profile.social_networks') }}
                </div>
                <div class="menu-arrow">
                    <svg v-if="showSocialNetworkModal" width="14" height="15" viewBox="0 0 14 15" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.69873L13 13.7669M13 1.69873L1 13.7669" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="white" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
            <transition name="expand">
                <div v-if="showSocialNetworkModal" class="dropdown social-dropdown">
                    <!-- YouTube -->
                    <a href="https://youtube.com/@OqilbekErkinov" target="_blank" class="social-row">
                        <span class="social-icon-plain">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" fill="#FF0000"/>
                            </svg>
                        </span>
                        <span class="social-name">YouTube</span>
                        <span class="social-go">{{ $t('profile.go_to') }}</span>
                    </a>
                    <!-- Instagram -->
                    <a href="https://instagram.com/oqilbek_erkinov" target="_blank" class="social-row">
                        <span class="social-icon-plain">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="ig2" x1="0" y1="24" x2="24" y2="0">
                                        <stop offset="0%" stop-color="#F58529"/>
                                        <stop offset="50%" stop-color="#DD2A7B"/>
                                        <stop offset="100%" stop-color="#8134AF"/>
                                    </linearGradient>
                                </defs>
                                <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig2)" stroke-width="2" fill="none"/>
                                <circle cx="12" cy="12" r="4.5" stroke="url(#ig2)" stroke-width="2" fill="none"/>
                                <circle cx="17.5" cy="6.5" r="1.2" fill="#DD2A7B"/>
                            </svg>
                        </span>
                        <span class="social-name">Instagram</span>
                        <span class="social-go">{{ $t('profile.go_to') }}</span>
                    </a>
                    <!-- Telegram -->
                    <a href="https://t.me/oqilbek_erkinov" target="_blank" class="social-row">
                        <span class="social-icon-plain">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13" stroke="#2AABEE" stroke-width="2" stroke-linecap="round"/>
                                <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#2AABEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            </svg>
                        </span>
                        <span class="social-name">Telegram</span>
                        <span class="social-go">{{ $t('profile.go_to') }}</span>
                    </a>
                </div>
            </transition>
            
            <NuxtLink to="/rankings" class="menu-item" style="text-decoration: none;">
                <div class="menu-text">
                    <svg class="me-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00CFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span style="color: #fff;">{{ $t('profile.rankings') || 'Reyting' }}</span>
                </div>
                <div class="menu-arrow">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="white" stroke-linecap="round" />
                    </svg>
                </div>
            </NuxtLink>

            <NuxtLink to="/chat" class="menu-item" style="text-decoration: none;">
                <div class="menu-text">
                    <svg class="me-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00CFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span style="color: #fff;">{{ $t('profile.chat') || 'Xabarlar' }}</span>
                    <span v-if="user?.unread_conversations_count > 0" class="chat-badge">
                        {{ user.unread_conversations_count }}
                    </span>
                </div>
                <div class="menu-arrow">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="white" stroke-linecap="round" />
                    </svg>
                </div>
            </NuxtLink>
            
            <div class="menu-item" @click="handleLogout">
                <div class="menu-text" style="color: #ff4d4d">
                    <svg class="me-2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    {{ $t('profile.logout') || 'Chiqish' }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { locale, setLocale } = useI18n()
const { user, fetchUser, updateProfile, logout } = useAuth()

const showSettings = ref(false)
const showCareServiceModal = ref(false)
const showSocialNetworkModal = ref(false)
const showEditProfile = ref(false)
const showLanguages = ref(false)
const isUpdating = ref(false)
const userImage = ref('')

const editForm = reactive({
    full_name: '',
    phone: '',
    email: '',
    weekly_goal: 4
})

// Accordion: faqat bitta section ochiq turadi
const openSection = (section) => {
    const isOpen = section === 'settings' ? showSettings.value
        : section === 'care' ? showCareServiceModal.value
        : showSocialNetworkModal.value

    // barchasini yop
    showSettings.value = false
    showCareServiceModal.value = false
    showSocialNetworkModal.value = false
    showEditProfile.value = false
    showLanguages.value = false

    // agar yopiq edi, ochib qo'y
    if (!isOpen) {
        if (section === 'settings') showSettings.value = true
        else if (section === 'care') showCareServiceModal.value = true
        else showSocialNetworkModal.value = true
    }
}

onMounted(async () => {
    await fetchUser()
    if (user.value) {
        editForm.full_name = user.value.full_name || ''
        editForm.phone = user.value.phone || ''
        editForm.email = user.value.email || ''
        editForm.weekly_goal = user.value.weekly_goal || 4
        userImage.value = user.value.img || ''
    }
})

const handleUpdateProfile = async () => {
    isUpdating.value = true
    await updateProfile(editForm)
    isUpdating.value = false
}

const handleLogout = () => {
    logout()
}

const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = async (e) => {
            userImage.value = e.target.result
            await updateProfile({ img: userImage.value })
        }
        reader.readAsDataURL(file)
    }
}

const deletePhoto = async () => {
    userImage.value = ''
    await updateProfile({ img: "" }) // backend treats empty string as delete
}
</script>

<style scoped>
@import "~/assets/css/profile.css";

.chat-badge {
    background: #00CFFF;
    color: #000;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
    margin-left: 0.5rem;
}
</style>
