<template>
  <Teleport to="body">
  <div v-if="show" class="fixed inset-0 z-[9999] h-screen min-h-screen w-screen bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
      <div class="flex items-center space-x-3 text-slate-900">
        <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
          <AppIcon name="key" />
        </div>
        <div>
          <h4 class="font-bold text-sm">익명 비밀번호 확인</h4>
          <p class="text-xs text-slate-500">리뷰 등록 시 설정한 비밀번호를 입력하세요.</p>
        </div>
      </div>

      <div class="space-y-1.5">
        <input 
          v-model="passwordInput" 
          type="password" 
          placeholder="비밀번호 입력" 
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          @keyup.enter="handleConfirm"
        >
        <p v-if="isError" class="text-xs text-rose-600 font-medium flex items-center mt-1">
          <AppIcon name="alert" class="mr-1" />비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <div class="flex space-x-2 pt-2">
        <button @click="handleClose" class="flex-1 py-2.5 text-xs font-bold border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-all">
          취소
        </button>
        <button @click="handleConfirm" class="flex-1 py-2.5 text-xs font-bold bg-violet-500 hover:bg-violet-600 text-white rounded-xl shadow-md shadow-violet-100 transition-all">
          확인
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

const passwordInput = ref('');
const isError = ref(false);

watch(() => props.show, (newVal) => {
  if (newVal) {
    passwordInput.value = '';
    isError.value = false;
  }
});

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  if (!passwordInput.value.trim()) {
    isError.value = true;
    return;
  }

  isError.value = false;
  emit('confirm', passwordInput.value);
};
</script>
