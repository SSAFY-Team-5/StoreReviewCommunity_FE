<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HomeView from './views/HomeView.vue'
import WriteView from './views/WriteView.vue'
import DetailView from './views/DetailView.vue'
import Chatbot from './components/Chatbot.vue'
import AppIcon from './components/AppIcon.vue'
import {
  createPost,
  deletePost,
  fetchPostDetail,
  fetchPosts,
  fetchTodayTopStores,
  mapPostSummary,
  mapPostDetail,
  type PostDetail,
  type PostSummary,
  type StoreOption,
  type TodayTopStore,
  verifyPostPassword,
  updatePost
} from './services/api'

// 1. 화면 전환 상태 제어 ('home' | 'write' | 'detail')
const currentView = ref<'home' | 'write' | 'detail'>('home')

// 2. 선택된 권역 정보 (의뢰서 기준 5개 권역 중 '서울'을 기본값으로 설정) [cite: 10, 63]
const selectedRegion = ref('서울') 
const posts = ref<PostSummary[]>([])
const rankingStores = ref<TodayTopStore[]>([])

const selectedPost = ref<PostDetail | null>(null)
const editPostData = ref<{
  id: number | null
  title: string
  content: string
  nickname: string
  password: string
  selectedStore: StoreOption | null
} | null>(null)
const isLoadingPosts = ref(false)
const postLoadError = ref('')

const loadPosts = async () => {
  isLoadingPosts.value = true
  postLoadError.value = ''

  try {
    const firstPage = await fetchPosts(1, 100)
    const totalPages = Math.max(1, Math.ceil(firstPage.total / firstPage.size))
    const mappedPosts = firstPage.items.map(mapPostSummary)

    for (let page = 2; page <= totalPages; page += 1) {
      const response = await fetchPosts(page, firstPage.size)
      mappedPosts.push(...response.items.map(mapPostSummary))
    }

    posts.value = mappedPosts.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
  } catch (error) {
    postLoadError.value = error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.'
    posts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

const loadRankingStores = async () => {
  try {
    const response = await fetchTodayTopStores()
    rankingStores.value = response.top_stores.slice(0, 5)
  } catch {
    rankingStores.value = []
  }
}

// --- 화면 라우팅 및 CRUD 제어 로직 ---

// 상세 페이지로 이동
const goDetail = async (postId: number) => {
  try {
    const post = mapPostDetail(await fetchPostDetail(postId))
    selectedPost.value = post
    currentView.value = 'detail'
  } catch (error) {
    alert(error instanceof Error ? error.message : '게시글 상세 정보를 불러오지 못했습니다.')
  }
}

// 작성 페이지로 이동
const goWrite = () => {
  editPostData.value = null // 새 글 모드
  currentView.value = 'write'
}

// 목록 화면(Home)으로 복귀
const goHome = () => {
  currentView.value = 'home'
  selectedPost.value = null
  editPostData.value = null
}

// 수정 화면으로 진입 (상세보기 -> 수정하기)
const goEdit = async (postId: number) => {
  try {
    const detail = selectedPost.value?.id === postId ? selectedPost.value : mapPostDetail(await fetchPostDetail(postId))

    editPostData.value = {
      id: detail.id,
      title: detail.title,
      content: detail.content,
      nickname: detail.nickname,
      password: '',
      selectedStore: detail.store
    }
    currentView.value = 'write'
  } catch (error) {
    alert(error instanceof Error ? error.message : '수정할 게시글을 불러오지 못했습니다.')
  }
}

const handleEditRequest = async (payload: { postId: number; password: string }) => {
  try {
    await verifyPostPassword(payload.postId, payload.password)
    const detail = selectedPost.value?.id === payload.postId ? selectedPost.value : mapPostDetail(await fetchPostDetail(payload.postId))

    editPostData.value = {
      id: detail.id,
      title: detail.title,
      content: detail.content,
      nickname: detail.nickname,
      password: payload.password,
      selectedStore: detail.store
    }
    currentView.value = 'write'
  } catch (error) {
    alert('비밀번호가 일치하지 않습니다.')
  }
}

// 글 등록 및 수정 완료 핸들러
const handleSubmitPost = async (postData: {
  id: number | null
  title: string
  content: string
  nickname: string
  password: string
  selectedStore: StoreOption | null
}) => {
  try {
    if (postData.id) {
      await updatePost(postData.id, {
        password: postData.password,
        title: postData.title,
        content: postData.content
      })
    } else {
      if (!postData.selectedStore) {
        alert('매장을 선택해 주세요.')
        return
      }

      await createPost({
        nickname: postData.nickname.trim() || '익명',
        password: postData.password,
        title: postData.title,
        content: postData.content,
        store_content_id: postData.selectedStore.id,
        store_name: postData.selectedStore.name,
        store_address: postData.selectedStore.address
      })
    }

    await loadPosts()
    goHome()
  } catch (error) {
    alert(error instanceof Error ? error.message : '게시글 저장에 실패했습니다.')
  }
}

// 게시글 삭제 핸들러
const handleDeletePost = async (payload: { postId: number; password: string }) => {
  try {
    await deletePost(payload.postId, { password: payload.password })
    await loadPosts()
    alert('게시글이 안전하게 삭제되었습니다.')
    goHome()
  } catch (error) {
    alert('비밀번호가 일치하지 않습니다.')
  }
}

onMounted(() => {
  void loadPosts()
  void loadRankingStores()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col">
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3 cursor-pointer" @click="goHome">
          <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md shadow-indigo-100 ring-1 ring-indigo-100 overflow-hidden">
            <img src="/img/logo.png" alt="SudoReview 로고" class="h-full w-full scale-110 object-contain" />
          </div>
          <div>
            <span class="font-black text-lg tracking-tight text-violet-500">SudoReview</span>
            <span class="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-md ml-2 border border-indigo-100">
              {{ selectedRegion }} 권역
            </span>
          </div>
        </div>

        <div class="hidden sm:flex items-center space-x-4">
          <div class="text-xs text-slate-400 font-medium">
            <AppIcon name="clock" size="0.95em" class="mr-1 inline-block align-[-0.125em]" />실시간 공유 중
          </div>
          <button 
            @click="goWrite" 
            class="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-100"
          >
            <AppIcon name="pencil" size="0.95em" class="mr-1 inline-block align-[-0.125em]" />새 리뷰 작성
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="postLoadError" class="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ postLoadError }}
      </div>

      <div v-if="isLoadingPosts && currentView === 'home'" class="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
        게시글을 불러오는 중입니다...
      </div>

      <transition name="fade" mode="out-in">
        <HomeView 
          v-if="currentView === 'home'" 
          :posts="posts" 
          :ranking-stores="rankingStores"
          @write="goWrite" 
          @detail="goDetail"
        />

        <WriteView 
          v-else-if="currentView === 'write'" 
          :editData="editPostData"
          @cancel="goHome" 
          @submit="handleSubmitPost"
        />

        <DetailView 
          v-else-if="currentView === 'detail' && selectedPost" 
          :post="selectedPost" 
          @back="goHome"
          @edit="handleEditRequest"
          @delete="handleDeletePost"
        />
      </transition>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4">
        <p class="font-bold text-slate-500 mb-1">© 2026 SudoReview. All rights reserved.</p>
        <p>본 서비스는 공공데이터를 기반으로 구축된 익명 서울 ·경기 지역 정보 커뮤니티 공간입니다.</p>
      </div>
    </footer>

    <Chatbot />
  </div>
</template>

<style>
/* 트랜지션 애니메이션 정의 (페이지 전환을 부드럽게) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
