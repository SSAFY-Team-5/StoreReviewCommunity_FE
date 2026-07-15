<template>
  <div class="space-y-6">
    <!-- 비주얼 쇼핑 테마 배너 -->
    <div class="relative rounded-3xl overflow-hidden shadow-lg shadow-indigo-100 min-h-[320px] sm:min-h-[360px]">
      <img
        src="/img/lottetower.jpg"
        alt="롯데타워 전경"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/30 to-indigo-700/20"></div>
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute right-1/4 -top-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-xl"></div>

      <div class="relative z-10 p-8 sm:p-10 h-full flex items-end">
        <div class="max-w-2xl space-y-3">
          <span class="inline-flex bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">솔직 담백한 매장 뒷담</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">익명 서울 · 경기 쇼핑 리뷰 커뮤니티! SudoReview</h2>
          <div class="py-3"/>
          <p class="text-indigo-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            광고와 협찬 없이, 소비자가 직접 남기는 익명 매장 후기 공간입니다. 온·오프라인 매장 리뷰부터 핫한 아이템 추천까지 솔직하게 공유해 보세요!
          </p>
        </div>
      </div>
    </div>

    <!-- 통합 검색 헤더 -->
    <div class="bg-white p-4 rounded-2xl border border-slate-300 shadow-md shadow-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-grow max-w-xl">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <AppIcon name="search" />
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="게시글 제목 또는 리뷰 매장 이름 검색... (Enter 입력)" 
          class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          @keyup.enter="triggerSearch"
        >
      </div>
      <button
        type="button"
        @click="triggerSearch"
        class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-indigo-100 self-start md:self-auto"
      >
        검색
      </button>
    </div>

    <!-- 리뷰 리스트 보드 -->
    <div class="bg-white rounded-2xl border border-slate-300 shadow-md shadow-slate-100 overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900">
          리뷰 피드 목록 <span class="text-indigo-600 text-xs ml-1">({{ totalFilteredCount }}개 글)</span>
        </h3>
        <button @click="emitWrite" class="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center space-x-1">
          <span>새 리뷰 쓰기</span>
          <AppIcon name="chevron-right" />
        </button>
      </div>

      <!-- 게시글 목록 테이블 -->
      <div v-if="paginatedPosts.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/90 border-b border-slate-300 text-slate-500 text-xs font-bold tracking-wider uppercase">
              <th class="py-3 px-6 text-center w-18">번호</th>
              <th class="py-3 px-12">제목</th>
              <th class="py-3 px-6 text-center">작성자</th>
              <th class="py-3 px-6 text-center">작성일</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr 
              v-for="(post, index) in paginatedPosts" 
              :key="post.id"
              @click="emitDetail(post.id)"
              class="hover:bg-indigo-50/20 cursor-pointer transition-colors"
            >
              <td class="py-3.5 px-6 text-center text-slate-400 font-semibold text-xs">
                {{ totalFilteredCount - ((currentPage - 1) * itemsPerPage) - index }}
              </td>
              <td class="py-3.5 px-12">
                <div class="text-slate-900 font-medium line-clamp-1 hover:text-indigo-600 transition-colors">
                  {{ post.title }}
                </div>
              </td>
              <td class="py-3.5 px-6 text-center font-medium text-slate-600 text-xs">
                {{ post.nickname }}
              </td>
              <td class="py-3.5 px-6 text-center text-slate-400 text-xs">
                {{ formatDate(post.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 목록이 0개일 경우 처리 -->
      <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <AppIcon name="folder" size="1.35em" class="text-2xl" />
        </div>
        <h4 class="text-sm font-bold text-slate-900 mb-1">검색 결과나 작성된 게시글이 없습니다.</h4>
        <p class="text-xs text-slate-400 max-w-sm mb-4">첫 번째 쇼핑 후기 또는 아이템 리뷰를 남겨보세요!</p>
        <button @click="emitWrite" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all">
          첫 글 쓰기
        </button>
      </div>

      <!-- 컴포넌트 내부 페이지네이션 (정확히 페이지당 20개 노출 제한) -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <div class="flex items-center space-x-1">
          <button 
            v-for="p in totalPages" 
            :key="p"
            @click="currentPage = p"
            :class="[
              'w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors',
              currentPage === p ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-600 border border-slate-200 hover:bg-slate-50'
            ]"
          >
            {{ p }}
          </button>
        </div>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppIcon from '../components/AppIcon.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['write', 'detail']);

const searchQuery = ref('');
const activeSearchKeyword = ref('');
const currentPage = ref(1);
const itemsPerPage = 20; // 20개 고정 노출

const filteredPosts = computed(() => {
  let list = [...props.posts];

  if (activeSearchKeyword.value.trim()) {
    const query = activeSearchKeyword.value.toLowerCase().trim();
    list = list.filter(post => 
      post.title.toLowerCase().includes(query) ||
      (post.storeName && post.storeName.toLowerCase().includes(query))
    );
  }

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const totalFilteredCount = computed(() => filteredPosts.value.length);
const totalPages = computed(() => Math.ceil(totalFilteredCount.value / itemsPerPage) || 1);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPosts.value.slice(start, end);
});

const triggerSearch = () => {
  activeSearchKeyword.value = searchQuery.value;
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = '';
  activeSearchKeyword.value = '';
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const emitWrite = () => emit('write');
const emitDetail = (id) => emit('detail', id);

const formatDate = (isoString) => {
  const d = new Date(isoString);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${month}.${day}`;
};
</script>