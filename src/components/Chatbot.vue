<template>
  <div class="fixed bottom-6 right-6 z-[1900]">
    <!-- 접힌 상태 플로팅 버튼 -->
    <button 
      v-if="!isOpen" 
      @click="toggleChat"
      class="w-14 h-14 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-violet-200 transition-all duration-300 flex items-center justify-center relative active:scale-95 group"
    >
      <span class="absolute -top-1.5 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-violet-500 text-[9px] text-white font-bold items-center justify-center">AI</span>
      </span>
        <AppIcon name="chat" size="1.35em" class="text-2xl group-hover:rotate-12 transition-transform duration-300" />
    </button>

    <!-- 대화창 전개 레이아웃 -->
    <div 
      v-else 
      class="bg-white rounded-2xl shadow-2xl shadow-slate-400/30 border border-slate-300 w-[92vw] sm:w-[400px] max-w-lg h-[480px] flex flex-col overflow-hidden transition-all duration-300"
    >
      <!-- 헤더 바 -->
      <div class="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white flex items-center justify-between shadow-md">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <AppIcon name="robot" />
          </div>
          <div>
            <h4 class="font-extrabold text-xs leading-tight">SudoReview 쇼핑 가이드</h4>
            <p class="text-[9px] text-indigo-100">AI 스마트 서포터</p>
          </div>
        </div>
        <button @click="toggleChat" class="text-white hover:text-indigo-100 p-1 rounded-lg transition-colors">
          <AppIcon name="close" size="1.05em" />
        </button>
      </div>

      <!-- 대화 피드 영역 -->
      <div ref="chatContainer" class="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/70">
        <!-- AI 가이드 팁 안내문구 -->
        <div class="bg-indigo-50/70 border border-indigo-100/60 rounded-xl p-3 text-xs leading-relaxed text-indigo-800">
          <p class="font-bold flex items-center text-indigo-900 mb-1">
            <AppIcon name="help" class="text-indigo-600 mr-1.5" />쇼핑 관련해서 편하게 대화해 보세요!
          </p>
          <ul class="list-disc list-inside space-y-0.5 text-slate-600 mt-1 pl-1">
            <li>"인기 오프라인 쇼핑몰 목록 알려줘"</li>
            <li>"더현대 서울 주소나 위치는 어디야?"</li>
            <li>"SudoReview 서비스의 장점이 궁금해"</li>
          </ul>
        </div>

        <!-- 메시지 루프 -->
        <div 
          v-for="(msg, i) in messages" 
          :key="i"
          :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div class="flex items-start space-x-2 max-w-[85%]">
            <div v-if="msg.sender === 'bot'" class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
              <AppIcon name="robot" />
            </div>
            <div>
              <div 
                :class="[
                  'rounded-2xl px-3.5 py-2 text-xs shadow-sm leading-relaxed',
                  msg.sender === 'user' 
                    ? 'bg-violet-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                ]"
              >
                <p class="whitespace-pre-wrap">{{ msg.text }}</p>
              </div>
              <span class="text-[8px] text-slate-400 mt-1 block px-1" :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
                {{ msg.time }}
              </span>
            </div>
          </div>
        </div>

        <!-- 타이핑 시뮬레이션 -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="flex items-start space-x-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
              <AppIcon name="robot" />
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex items-center space-x-1.5">
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 입력 하단 바 -->
      <div class="p-3 bg-white border-t border-slate-200/80 flex items-center space-x-2">
        <input 
          v-model="chatInput" 
          type="text" 
          placeholder="쇼핑 질문을 작성해 보세요..." 
          class="flex-grow px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          @keyup.enter="sendMessage"
        >
        <button 
          @click="sendMessage" 
          class="w-8 h-8 bg-violet-500 hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-md shadow-violet-100"
        >
          <AppIcon name="send" size="0.9em" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import AppIcon from './AppIcon.vue';
import { fetchChat, mapStoreApiItem } from '../services/api';

const isOpen = ref(false);
const chatInput = ref('');
const isTyping = ref(false);
const chatContainer = ref(null);

const messages = ref([
  { sender: 'bot', text: '안녕하세요! SudoReview 스마트 도우미입니다. 쇼핑 매장에 관련된 유용한 정보를 바로 물어보세요! 😊', time: '오후 12:00' }
]);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

const sendMessage = async () => {
  const text = chatInput.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  messages.value.push({ sender: 'user', text, time: timeStr });
  chatInput.value = '';
  isTyping.value = true;
  scrollToBottom();

  try {
    const response = await fetchChat(text);
    const mappedStores = (response.stores ?? []).map(mapStoreApiItem);
    const storeText = mappedStores.length
      ? `\n\n추천 매장\n${mappedStores.map(store => `• ${store.name}\n  ${store.address}`).join('\n\n')}`
      : '';

    messages.value.push({
      sender: 'bot',
      text: `${response.answer}${storeText}`,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    messages.value.push({
      sender: 'bot',
      text: error instanceof Error ? error.message : '챗봇 응답을 불러오지 못했습니다.',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};
</script>
