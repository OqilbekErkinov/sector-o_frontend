<template>
  <div class="chat-list-page">
    <header class="chat-header mb-4 text-center">
      <button class="back-button" @click="$router.push('/profile')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18L9 12L15 6"/>
        </svg>
      </button>
      <h1 class="chat-title">{{ $t('chat.my_messages') || 'Mening xabarlarim' }}</h1>
    </header>

    <!-- Search / Start new chat -->
    <div class="search-section mb-4">
      <form @submit.prevent="startNewChat" class="search-box">
        <input 
          v-model="searchEmail" 
          type="email" 
          :placeholder="$t('chat.search_by_email') || 'Email orqali izlash...'" 
          required 
        />
        <button type="submit" :disabled="isSearching" class="btn-search">
          <svg v-if="!isSearching" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span v-else class="spinner"></span>
        </button>
      </form>
      <p v-if="searchError" class="text-danger small mt-1 px-2">{{ searchError }}</p>
    </div>

    <!-- Loading -->
    <template v-if="pending">
      <div class="loading-state">
        <Skeleton v-for="i in 4" :key="i" height="70px" borderRadius="15px" class="mb-3" />
      </div>
    </template>

    <!-- Conversations List -->
    <template v-else-if="conversations && conversations.length > 0">
      <div class="conversations-list">
        <NuxtLink 
          v-for="conv in conversations" 
          :key="conv.id" 
          :to="`/chat/${conv.id}`" 
          class="conversation-card"
        >
          <img :src="conv.other_user.img || '/images/profile.png'" alt="Avatar" class="conv-avatar" />
          <div class="conv-info">
            <div class="conv-header">
              <h4 class="user-name">{{ conv.other_user.full_name || 'Anonymous' }}</h4>
              <span class="msg-time">{{ formatTime(conv.last_message_time) }}</span>
            </div>
            <div class="conv-body">
              <p class="last-message" :class="{'unread-text': conv.unread_count > 0}">
                {{ conv.last_message || '...' }}
              </p>
              <div v-if="conv.unread_count > 0" class="unread-badge">
                {{ conv.unread_count }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </template>

    <!-- Empty State -->
    <template v-else>
      <div class="empty-state text-center py-5">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3; margin-bottom: 10px;">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <p style="color: rgba(255,255,255,0.5)">
          {{ $t('chat.no_messages') || "Sizda hozircha suhbatlar yo'q. Boshlash uchun foydalanuvchi emailini kiriting." }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const config = useRuntimeConfig();
const router = useRouter();
const { token, isLoggedIn, user: currentUser, fetchUser } = useAuth();

const searchEmail = ref('');
const searchError = ref('');
const isSearching = ref(false);

let ws = null;

const { data: conversations, pending, refresh: fetchConversations } = await useAsyncData('conversations', () => {
  return $fetch(`${config.public.apiBase}/api/chat/conversations/`, {
    headers: { Authorization: `Bearer ${token.value}` }
  });
});

onMounted(async () => {
  if (isLoggedIn.value && !currentUser.value) {
    await fetchUser();
  }
  fetchConversations();
  
  // WebSocket ulanish — uzoq muddatli JWT o'rniga bir martalik, qisqa
  // muddatli "ticket" ishlatamiz, shunda token URL/serverlogda qolmaydi
  if (token.value) {
    try {
      const { ticket } = await $fetch(`${config.public.apiBase}/api/chat/ws-ticket/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` }
      });
      const wsBase = config.public.apiBase.replace('http', 'ws').replace('/api', '');
      ws = new WebSocket(`${wsBase}/ws/chat/?ticket=${ticket}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          // Yangi xabar bo'lsa ro'yxatni yangilaymiz
          fetchConversations();
        }
      };
    } catch (e) {
      console.error("WebSocket ulanishda xatolik:", e);
    }
  }
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});

async function startNewChat() {
  if (!searchEmail.value) return;
  
  isSearching.value = true;
  searchError.value = '';
  
  try {
    const data = await $fetch(`${config.public.apiBase}/api/chat/conversations/start/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { email: searchEmail.value }
    });
    
    // Success, go to chat
    router.push(`/chat/${data.id}`);
  } catch (err) {
    searchError.value = err.data?.error || 'Xatolik yuz berdi';
  } finally {
    isSearching.value = false;
  }
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  
  // If today, show HH:MM. Else show DD/MM
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }
}
</script>

<style scoped>
.chat-list-page {
  background: #222222;
  min-height: 100vh;
  padding: 14px;
  color: #fff;
  animation: fadeIn 0.4s ease;
  max-width: 450px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-header {
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

.chat-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 1.2rem;
}

/* Search Box */
.search-box {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 15px;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-search {
  background: #00CFFF;
  border: none;
  color: #fff;
  padding: 0 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-search:active {
  opacity: 0.8;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* Conversations List */
.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conversation-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 12px;
  text-decoration: none;
  color: #fff;
  transition: background 0.2s;
}

.conversation-card:active {
  background: rgba(255, 255, 255, 0.08);
}

.conv-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  background: #333;
}

.conv-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.conv-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  padding-right: 10px;
}

.last-message.unread-text {
  color: #fff;
  font-weight: 600;
}

.unread-badge {
  background: #00CFFF;
  color: #000;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}
</style>
