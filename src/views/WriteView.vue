<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button @click="handleCancel" class="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
          <AppIcon name="arrow-left" />
        </button>
        <h2 class="text-xl font-bold text-slate-900">
          {{ isEditMode ? '리뷰 수정하기' : '새로운 리뷰 작성' }}
        </h2>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">익명 닉네임</label>
          <input 
            v-model="formData.nickname" 
            type="text" 
            placeholder="익명 닉네임 입력" 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            :disabled="isEditMode"
          >
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">수정/삭제용 비밀번호</label>
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="비밀번호(평문 저장 및 대조)" 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          >
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">리뷰 제목</label>
        <input 
          v-model="formData.title" 
          type="text" 
          placeholder="리뷰 게시글의 핵심 타이틀을 입력하세요." 
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-semibold"
        >
      </div>

      <!-- 지도 바인딩 컴포넌트 연동 -->
      <StoreMap 
        v-model="formData.selectedStore"
        mapId="write-view-map"
      />

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">리뷰 내용</label>
        <textarea 
          v-model="formData.content" 
          rows="6" 
          placeholder="구매 과정, 실제 제품 퀄리티, 가성비 등 방문 또는 구매에 도움이 되는 팁을 자유롭게 적어보세요." 
          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all leading-relaxed"
        ></textarea>
      </div>

      <!-- 등록/취소 버튼 세션 -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        <button type="button" @click="handleCancel" class="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all">
          취소하기
        </button>
        <button type="button" @click="handleSubmit" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100">
          {{ isEditMode ? '리뷰 수정 완료' : '리뷰 등록 완료' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StoreMap from '../components/StoreMap.vue';
import AppIcon from '../components/AppIcon.vue';

const props = defineProps({
  editData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['cancel', 'submit']);

const isEditMode = ref(false);
const formData = ref({
  id: null,
  title: '',
  content: '',
  nickname: '익명',
  password: '',
  selectedStore: null
});

onMounted(() => {
  if (props.editData) {
    isEditMode.value = true;
    formData.value = { ...props.editData };
  }
});

const handleCancel = () => {
  emit('cancel');
};

const handleSubmit = () => {
  if (!formData.value.nickname.trim()) {
    formData.value.nickname = '익명';
  }
  if (!formData.value.password.trim()) return alert('비밀번호를 설정해 주세요.');
  if (!formData.value.title.trim()) return alert('제목을 적어주세요.');
  if (!formData.value.content.trim()) return alert('내용을 적어주세요.');

  emit('submit', {
    ...formData.value,
    storeName: formData.value.selectedStore ? formData.value.selectedStore.name : null
  });
};
</script>