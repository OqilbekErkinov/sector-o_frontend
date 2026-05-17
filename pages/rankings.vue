<template>
  <div class="rankings-page">
    <header class="rankings-header mb-4 text-center">
      <button class="back-button" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18L9 12L15 6"/>
        </svg>
      </button>
      <h1 class="rankings-title">{{ $t('profile.rankings') || 'Reyting' }}</h1>
    </header>

    <template v-if="pending">
      <div class="loading-state">
        <Skeleton height="200px" borderRadius="20px" class="mb-4" />
        <Skeleton v-for="i in 5" :key="i" height="70px" borderRadius="15px" class="mb-3" />
      </div>
    </template>

    <template v-else-if="users && users.length > 0">
      <!-- Top 3 Podium -->
      <div class="podium-section" v-if="topThree.length > 0">
        <!-- 2nd Place -->
        <div class="podium-place place-2" v-if="topThree[1]">
          <div class="avatar-wrapper">
            <div class="rank-badge silver">2</div>
            <img :src="topThree[1].img || '/images/profile.png'" alt="Avatar" class="avatar-img" />
            <button v-if="currentUser && topThree[1].id !== currentUser.id" class="btn-chat-podium" @click="startChatWith(topThree[1].id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>
          <h3 class="user-name">{{ topThree[1].full_name || 'Anonymous' }}</h3>
          <p class="user-xp">{{ topThree[1].xp }} XP</p>
        </div>

        <!-- 1st Place -->
        <div class="podium-place place-1" v-if="topThree[0]">
          <div class="crown">👑</div>
          <div class="avatar-wrapper">
            <div class="rank-badge gold">1</div>
            <img :src="topThree[0].img || '/images/profile.png'" alt="Avatar" class="avatar-img" />
            <button v-if="currentUser && topThree[0].id !== currentUser.id" class="btn-chat-podium" @click="startChatWith(topThree[0].id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>
          <h3 class="user-name">{{ topThree[0].full_name || 'Anonymous' }}</h3>
          <p class="user-xp">{{ topThree[0].xp }} XP</p>
        </div>

        <!-- 3rd Place -->
        <div class="podium-place place-3" v-if="topThree[2]">
          <div class="avatar-wrapper">
            <div class="rank-badge bronze">3</div>
            <img :src="topThree[2].img || '/images/profile.png'" alt="Avatar" class="avatar-img" />
            <button v-if="currentUser && topThree[2].id !== currentUser.id" class="btn-chat-podium" @click="startChatWith(topThree[2].id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>
          <h3 class="user-name">{{ topThree[2].full_name || 'Anonymous' }}</h3>
          <p class="user-xp">{{ topThree[2].xp }} XP</p>
        </div>
      </div>

      <!-- Others List -->
      <div class="rankings-list mt-4" v-if="visibleOthers.length > 0">
        <div v-for="user in visibleOthers" :key="user.id" class="ranking-card" :class="{ 'me': currentUser && user.id === currentUser.id }">
          <div class="rank-number">{{ user.rank }}</div>
          <img :src="user.img || '/images/profile.png'" alt="Avatar" class="list-avatar" />
          <div class="list-info">
            <h4>{{ user.full_name || 'Anonymous' }} <span v-if="currentUser && user.id === currentUser.id" class="me-badge">(Siz)</span></h4>
            <p>Level {{ user.level }}</p>
          </div>
          <div class="list-xp">
            <span>{{ user.xp }} XP</span>
          </div>
          <button v-if="currentUser && user.id !== currentUser.id" class="btn-chat-list" @click="startChatWith(user.id)" title="Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      </div>

      <!-- Load More Button -->
      <button v-if="canLoadMore" class="btn-load-more mt-4" @click="loadMore">
        {{ $t('common.load_more') || "Qolganlarni ko'rish" }}
      </button>
    </template>
    
    <template v-else>
      <div class="text-center py-5">
        <p style="color: rgba(255,255,255,0.5)">Reyting ma'lumotlari topilmadi.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const config = useRuntimeConfig();
const router = useRouter();
const { user: currentUser, token } = useAuth();

const { data: users, pending } = await useAsyncData('rankings', () => {
  return $fetch(`${config.public.apiBase}/api/auth/rankings/`);
});

const limit = ref(10); // initial limit

const topThree = computed(() => {
  return users.value ? users.value.slice(0, 3) : [];
});

const others = computed(() => {
  return users.value ? users.value.slice(3) : [];
});

const visibleOthers = computed(() => {
  // We want total visible to be limit, so limit - 3
  const othersLimit = Math.max(0, limit.value - 3);
  return others.value.slice(0, othersLimit);
});

const canLoadMore = computed(() => {
  return others.value.length > visibleOthers.value.length;
});

function loadMore() {
  limit.value += 10;
}

const isStartingChat = ref(false);
async function startChatWith(userId) {
  if (isStartingChat.value) return;
  isStartingChat.value = true;
  try {
    const data = await $fetch(`${config.public.apiBase}/api/chat/conversations/start/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { user_id: userId }
    });
    router.push(`/chat/${data.id}`);
  } catch(e) {
    console.error(e);
  } finally {
    isStartingChat.value = false;
  }
}
</script>

<style scoped>
.rankings-page {
  min-height: 100vh;
  color: #fff;
  animation: fadeIn 0.4s ease;
  margin: 0 auto;

    background: #222222;
    padding: 14px;
    max-width: 450px;
    margin: 0 auto;
    overflow: visible;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.rankings-header {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}

.back-button {
  position: absolute;
  left: 0;
  background: none;
  border: none;
  color: #fff;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(5px);
}

.rankings-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 1rem;
}

/* Podium Styles */
.podium-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 0 10px;
  gap: 15px;
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  flex: 1;
}

.place-1 {
  z-index: 2;
  transform: translateY(-20px);
}
.place-2, .place-3 {
  z-index: 1;
}

.crown {
  font-size: 28px;
  margin-bottom: -10px;
  filter: drop-shadow(0 2px 5px rgba(255,215,0,0.5));
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.place-1 .avatar-img {
  width: 90px;
  height: 90px;
  border: 4px solid #FFD700;
}

.place-2 .avatar-img {
  width: 75px;
  height: 75px;
  border: 3px solid #C0C0C0;
}

.place-3 .avatar-img {
  width: 75px;
  height: 75px;
  border: 3px solid #CD7F32;
}

.avatar-img {
  border-radius: 50%;
  object-fit: cover;
  background: #2a2a2a;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

.rank-badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: #000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

.gold { background: #FFD700; }
.silver { background: #C0C0C0; }
.bronze { background: #CD7F32; color: #fff;}

.user-name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.place-1 .user-name {
  font-size: 16px;
  color: #FFD700;
}

.user-xp {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin: 4px 0 0 0;
  font-weight: 600;
}

/* List Styles */
.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 6px 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.ranking-card.me {
  background: rgba(0, 207, 255, 0.1);
  border-color: rgba(0, 207, 255, 0.3);
}

.rank-number {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  width: 25px;
}

.me .rank-number {
  color: #00CFFF;
}

.list-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid rgba(255,255,255,0.1);
}

.list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-badge {
  font-size: 12px;
  color: #00CFFF;
  margin-left: 5px;
}

.list-info p {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.list-xp {
  font-size: 14px;
  font-weight: 700;
  color: #00CFFF;
  margin-right: 15px;
}

.btn-chat-podium {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #00CFFF;
  border: 2px solid #222222;
  color: #000;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.btn-chat-podium:hover {
  transform: scale(1.1);
}

.btn-chat-list:hover {
  background: #00CFFF;
  color: #000;
}

.btn-chat-list {
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid rgba(0, 207, 255, 0.3);
  color: #00CFFF;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

/* Load More Button */
.btn-load-more {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-load-more:hover {
  background: rgba(255, 255, 255, 0.1);
}

.loading-state {
  margin-top: 20px;
}
</style>
