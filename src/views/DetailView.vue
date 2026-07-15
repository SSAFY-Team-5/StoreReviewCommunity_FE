<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 상단 액션 바 -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-950 font-semibold text-xs transition-colors">
          <AppIcon name="chevron-left" />
        <span>목록으로 돌아가기</span>
      </button>
      
      <div class="flex items-center space-x-2">
        <button @click="triggerAction('edit')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5">
          <AppIcon name="edit-square" />
          <span>수정</span>
        </button>
        <button @click="triggerAction('delete')" class="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 hover:border-rose-200 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5">
          <AppIcon name="trash" />
          <span>삭제</span>
        </button>
      </div>
    </div>

    <!-- 메인 레이아웃 및 디테일 지도시각화 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 본문 영역 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <span v-if="post.storeName" class="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                <AppIcon name="store" class="mr-1" />
                {{ post.storeName }}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
              {{ post.title }}
            </h2>
            
            <div class="flex items-center justify-between text-slate-400 text-xs pt-2 border-b border-slate-100 pb-4">
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase text-[10px]">
                  {{ post.nickname.charAt(0) }}
                </span>
                <span class="font-bold text-slate-700">{{ post.nickname }}</span>
                <span class="text-slate-300">|</span>
                <span>익명 구매자</span>
              </div>
              <div>
                <span>{{ formatDetailDate(post.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 본문 마크다운/텍스트 출력 -->
          <div class="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
            {{ post.content }}
          </div>
        </div>
      </div>

      <!-- 사이드바: 맵 연동 구역 -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <AppIcon name="location" class="text-rose-500" />
            <span>리뷰 대상 위치</span>
          </h3>

          <!-- 오프라인 지도 바인딩 -->
          <StoreMap 
            v-if="post.selectedStore"
            v-model="post.selectedStore"
            :disabled="true"
            mapId="detail-view-map"
          />

          <!-- 일반 게시글 가이드라인 -->
          <div v-else class="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <AppIcon name="globe" size="1.35em" class="text-2xl mb-2 text-slate-300" />
            <h4 class="text-xs font-bold text-slate-700">온라인/자유 구매리뷰</h4>
            <p class="text-[10px] text-slate-400 mt-1">지도가 미연동된 온라인몰 중심의 쇼핑 게시글입니다.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 검증 확인 공용 컴포넌트 마운트 -->
    <PasswordModal 
      :show="showModal"
      @close="showModal = false"
      @confirm="onAuthConfirmed"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StoreMap from '../components/StoreMap.vue';
import PasswordModal from '../components/PasswordModal.vue';
import AppIcon from '../components/AppIcon.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['back', 'edit', 'delete']);

const showModal = ref(false);
const currentAction = ref(''); // 'edit', 'delete'

const goBack = () => emit('back');

const triggerAction = (action) => {
  currentAction.value = action;
  showModal.value = true;
};

const onAuthConfirmed = (password) => {
  showModal.value = false;
  if (currentAction.value === 'edit') {
    emit('edit', { postId: props.post.id, password });
  } else if (currentAction.value === 'delete') {
    emit('delete', { postId: props.post.id, password });
  }
};

const formatDetailDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>