<template>
  <div class="chat-room-page">
    <!-- Header -->
    <header class="chat-header">
      <button class="back-button" @click="$router.push('/chat')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18L9 12L15 6"/>
        </svg>
      </button>
      
      <div v-if="otherUser" class="header-user-info">
        <img :src="otherUser.img || '/images/profile.png'" alt="Avatar" class="header-avatar" />
        <div class="header-text">
          <h2 class="header-name">{{ otherUser.full_name || 'Anonymous' }}</h2>
          <!-- Could add online status here in future -->
        </div>
      </div>
      <div v-else>
        <Skeleton height="40px" width="150px" borderRadius="10px" />
      </div>
    </header>

    <!-- Messages Area -->
    <div class="messages-container" ref="messagesContainer">
      <template v-if="pending && messages.length === 0">
        <div class="loading-state">
          <Skeleton height="40px" width="60%" borderRadius="15px" class="mb-3 align-self-start" />
          <Skeleton height="40px" width="50%" borderRadius="15px" class="mb-3 align-self-end" />
          <Skeleton height="40px" width="70%" borderRadius="15px" class="mb-3 align-self-start" />
        </div>
      </template>

      <template v-else>
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          class="message-wrapper"
          :class="{'is-me': msg.sender_id === currentUser?.id}"
        >
          <div class="message-bubble">
            <p class="message-text">{{ msg.content }}</p>
            <span class="message-time">
              {{ formatTime(msg.created_at) }}
              
              <span v-if="msg.sender_id === currentUser?.id" class="dumbbell-receipt">
                <!-- O'qilmagan: 1 ta gantel -->
                <svg v-if="!msg.is_read" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="6" width="4" height="12" rx="1" />
                  <rect x="17" y="6" width="4" height="12" rx="1" />
                  <rect x="7" y="10" width="10" height="4" />
                </svg>

                <!-- O'qilgan: 2 ta gantel -->
                <div v-else class="double-dumbbell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="dumbbell-1">
                    <rect x="3" y="6" width="4" height="12" rx="1" />
                    <rect x="17" y="6" width="4" height="12" rx="1" />
                    <rect x="7" y="10" width="10" height="4" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="dumbbell-2">
                    <rect x="3" y="6" width="4" height="12" rx="1" />
                    <rect x="17" y="6" width="4" height="12" rx="1" />
                    <rect x="7" y="10" width="10" height="4" />
                  </svg>
                </div>
              </span>
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Input Area -->
    <footer class="chat-footer">
      <form @submit.prevent="sendMessage" class="message-form">
        <input 
          v-model="newMessage" 
          type="text" 
          :placeholder="$t('chat.type_message') || 'Xabar yozing...'" 
          required 
          autocomplete="off"
        />
        <button type="submit" :disabled="isSending || !newMessage.trim()" class="btn-send">
          <svg v-if="!isSending" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const config = useRuntimeConfig();
const route = useRoute();
const { user: currentUser, token } = useAuth();

const convId = route.params.id;
const messages = ref([]);
const otherUser = ref(null);
const pending = ref(true);
const newMessage = ref('');
const isSending = ref(false);
const messagesContainer = ref(null);

let ws = null;
let lastMessageCount = 0;

// Need to get conversation details first, or we can just get messages and assume the API returns what we need.
// Wait, my message list API only returns messages. Let me fetch conversations list to find the other_user.
async function fetchInitialData() {
  try {
    const convs = await $fetch(`${config.public.apiBase}/api/chat/conversations/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const currentConv = convs.find(c => c.id == convId);
    if (currentConv) {
      otherUser.value = currentConv.other_user;
    }
    
    await fetchMessages();
  } catch (err) {
    console.error(err);
  } finally {
    pending.value = false;
  }
}

async function fetchMessages() {
  try {
    const data = await $fetch(`${config.public.apiBase}/api/chat/conversations/${convId}/messages/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    
    messages.value = data;
    
    if (data.length > lastMessageCount) {
      lastMessageCount = data.length;
      scrollToBottom();
    }
  } catch (err) {
    console.error(err);
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || isSending.value) return;
  
  const content = newMessage.value.trim();
  newMessage.value = '';
  isSending.value = true;
  
  // Optimistic update
  const tempMsg = {
    id: 'temp-' + Date.now(),
    sender_id: currentUser.value?.id,
    content: content,
    is_read: false,
    created_at: new Date().toISOString()
  };
  messages.value.push(tempMsg);
  scrollToBottom();
  
  try {
    await $fetch(`${config.public.apiBase}/api/chat/conversations/${convId}/messages/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { content }
    });
    // Re-fetch to get real ID and status
    await fetchMessages();
  } catch (err) {
    console.error('Failed to send message', err);
    // Remove optimistic message on fail
    messages.value = messages.value.filter(m => m.id !== tempMsg.id);
  } finally {
    isSending.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
}

onMounted(() => {
  // Remove global padding-bottom for this page
  document.body.style.setProperty('padding-bottom', '0', 'important');
  
  fetchInitialData();
  
  // WebSocket ulanish
  const token = useCookie('auth_token').value;
  if (token) {
    const config = useRuntimeConfig();
    const wsBase = config.public.apiBase.replace('http', 'ws').replace('/api', '');
    ws = new WebSocket(`${wsBase}/ws/chat/?token=${token}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        const payload = data.message;
        if (payload.action === 'new_message' && payload.conversation_id == route.params.id) {
          // Yangi xabar keldi
          messages.value.push(payload.msg);
          scrollToBottom();
          // O'qilganini bildirish uchun 1 marta qayta yuklash
          fetchMessages();
        } else if (payload.action === 'messages_read' && payload.conversation_id == route.params.id) {
          // Boshqa foydalanuvchi xabarlarimni o'qidi
          messages.value.forEach(msg => msg.is_read = true);
        }
      }
    };
  }
});

onUnmounted(() => {
  // Restore body style
  document.body.style.removeProperty('padding-bottom');
  
  if (ws) {
    ws.close();
  }
});

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
</script>

<style scoped>
.chat-room-page {
  min-height: 100vh;
  padding-top: 65px;
  padding-bottom: 75px;
  display: flex;
  flex-direction: column;
  color: #fff;
  max-width: 450px;
  margin: 0 auto;
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}


/* Header */
.chat-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  /* background: rgba(17, 17, 17, 0.95); */
  backdrop-filter: blur(10px);
  padding: 12px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  z-index: 20;
}

.back-button {
  background: none;
  border: none;
  color: #fff;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
}

.header-user-info {
  display: flex;
  align-items: center;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  background: #333;
}

.header-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

/* Messages Area */
.messages-container {
  flex: 1;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Hide scrollbar for cleaner look */
.messages-container::-webkit-scrollbar {
  width: 5px;
}
.messages-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 5px;
}

.loading-state {
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  display: flex;
  margin-bottom: 5px;
}

.message-wrapper.is-me {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
  background: rgba(255,255,255,0.1);
  border-bottom-left-radius: 4px;
}

.is-me .message-bubble {
  background: #00CFFF;
  color: #000;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 4px;
}

.message-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 4px;
  opacity: 0.7;
}

.is-me .message-time {
  color: rgba(0,0,0,0.6);
}

.dumbbell-receipt {
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
  color: rgba(0,0,0,0.4);
  transform: translateY(2px);
}

.dumbbell-receipt svg {
  transform: rotate(-30deg); /* Gantellarni qiyshiqroq qilish */
}

.double-dumbbell {
  display: inline-flex;
  position: relative;
  color: #000; /* O'qilganda qorayadi */
}

.double-dumbbell .dumbbell-2 {
  margin-left: -10px; /* 2-gantel birinchisini ustiga yaqinroq keladi */
}

/* Footer Input */
.chat-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  z-index: 20;
  /* background: rgba(17, 17, 17, 0.95); */
  backdrop-filter: blur(10px);
  padding: 12px 15px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255,255,255,0.05);
}

.message-form {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  padding: 4px;
}

.message-form input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 15px;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.message-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-send {
  background: #00CFFF;
  border: none;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-send:not(:disabled):active {
  transform: scale(0.95);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0,0,0,0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
