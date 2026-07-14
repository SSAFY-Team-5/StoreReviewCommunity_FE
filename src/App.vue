<script setup lang="ts">
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import WriteView from './views/WriteView.vue'
import DetailView from './views/DetailView.vue'
import Chatbot from './components/Chatbot.vue'
import AppIcon from './components/AppIcon.vue'

// 1. 화면 전환 상태 제어 ('home' | 'write' | 'detail')
const currentView = ref<'home' | 'write' | 'detail'>('home')

// 2. 선택된 권역 정보 (의뢰서 기준 5개 권역 중 '서울'을 기본값으로 설정) [cite: 10, 63]
const selectedRegion = ref('서울') 

const storePool = [
  { id: 1, name: '더현대 서울 (The Hyundai Seoul)', address: '서울특별시 영등포구 여의대로 108', latitude: 37.5259, longitude: 126.9278 },
  { id: 2, name: '롯데월드몰 (Lotte World Mall)', address: '서울특별시 송파구 올림픽로 300', latitude: 37.5111, longitude: 127.0981 },
  { id: 3, name: '신세계백화점 본점', address: '서울특별시 중구 소공로 63', latitude: 37.5609, longitude: 126.981 },
  { id: 4, name: '스타필드 코엑스몰', address: '서울특별시 강남구 영동대로 513', latitude: 37.5117, longitude: 127.0592 },
  { id: 5, name: '아이파크몰 용산점', address: '서울특별시 용산구 한강대로23길 55', latitude: 37.5296, longitude: 126.9648 },
  { id: 6, name: '현대백화점 판교점', address: '경기도 성남시 분당구 판교역로146번길 20', latitude: 37.3922, longitude: 127.1127 },
  { id: 7, name: '타임스퀘어', address: '서울특별시 영등포구 영중로 15', latitude: 37.5161, longitude: 126.9031 },
  { id: 8, name: 'AK플라자 홍대', address: '서울특별시 마포구 양화로 188', latitude: 37.5571, longitude: 126.9239 }
]

const nicknamePool = [
  '쇼핑홀릭', '여의도지킴이', '책벌레', '가성비헌터', '마켓탐험가', '오늘도득템', '리뷰수집가', '소소한장보기',
  '패피일기', '전자기기덕후', '뷰티로그', '주말쇼퍼', '동네탐방러', '핫딜추적자', '브랜드노트', '퇴근후쇼핑'
]
const titlePrefixes = ['신상 입어본 후기', '직접 써본 방문 후기', '재방문 의사 높은 곳', '실사용 기준 솔직 후기', '방문 전에 보면 좋은 팁']
const contentPool = [
  '주말 기준으로 방문했을 때 체감 혼잡도가 꽤 높았지만, 피크 타임만 피하면 동선이 훨씬 편했습니다. 직원 응대도 깔끔해서 만족도가 높았어요.',
  '가격대가 완전히 저렴한 편은 아니지만, 품질과 구성이 좋아서 재구매 가능성이 높았습니다. 할인 구간을 잘 보면 체감 가격이 꽤 내려갑니다.',
  '매장 내부가 넓어서 구경하기 편했고, 인기 상품은 빠르게 소진되는 편이라 오전 방문이 유리했습니다. 사진 찍기에도 괜찮았습니다.',
  '온라인보다 실물 확인이 중요한 제품이라 직접 보고 고르길 잘했다는 생각이 들었습니다. 색감이나 마감 차이를 확인할 수 있었어요.',
  '대기 시간이 길 수 있으니 미리 동선을 잡고 가는 걸 추천합니다. 한 번에 여러 매장을 둘러보기보다 목표를 정해 방문하면 훨씬 효율적입니다.'
]

const randomPick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const createRandomPost = (id: number) => {
  const store = randomPick(storePool)
  const nickname = randomPick(nicknamePool)
  const prefix = randomPick(titlePrefixes)
  const titleSuffix = store.name.replace(/\s*\(.+\)$/, '')
  const randomHoursAgo = Math.floor(Math.random() * 24 * 21) + 1

  return {
    id,
    title: `${prefix} - ${titleSuffix}`,
    content: `${randomPick(contentPool)}\n\n방문한 곳: ${store.name}`,
    nickname,
    password: '1',
    createdAt: new Date(Date.now() - 3600000 * randomHoursAgo).toISOString(),
    selectedStore: store
  }
}

const seededPosts = [
  {
    id: 3,
    title: "더현대 서울 지하 식품관 웨이팅 꿀팁 공유합니다!",
    content: "주말에 더현대 서울 방문하시는 분들은 꼭 현대식품관 앱(App) 다운로드 받으셔서 미리 웨이팅 걸어두세요! 현장 대기 기계 앞에 줄 서서 등록하면 기본 1시간 이상 기다려야 합니다. 미리 모바일 앱으로 예약하는 게 최고의 꿀팁입니다.",
    nickname: "여의도지킴이",
    password: "1", // 익명 대조용 평문 비밀번호 [cite: 25]
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2시간 전
    selectedStore: { id: 1, name: "더현대 서울 (The Hyundai Seoul)", address: "서울특별시 영등포구 여의대로 108", latitude: 37.5259, longitude: 126.9278 }
  },
  {
    id: 2,
    title: "코엑스 별마당 도서관 사람 적은 시간대",
    content: "코엑스몰 별마당 도서관은 평일 오전 11시 전이나 저녁 9시 이후에 방문하면 아주 한적하게 사진 촬영이 가능합니다. 주말 오후에는 지나다니기도 힘들 정도로 사람이 많으니 참고하세요!",
    nickname: "책벌레",
    password: "1",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1일 전
    selectedStore: { id: 4, name: "스타필드 코엑스몰", address: "서울특별시 강남구 영동대로 513", latitude: 37.5117, longitude: 127.0592 }
  },
  {
    id: 1,
    title: "신세계백화점 본점 미디어파사드 관람 명당",
    content: "겨울철 신세계백화점 본점 미디어파사드 볼 때 최고 명당은 회현역 1번 출구 앞 또는 맞은편 중앙우체국 앞 광장입니다. 각도가 가장 예쁘게 나오고 안전 펜스 안쪽이라 편안하게 관람할 수 있어요.",
    nickname: "쇼핑홀릭",
    password: "1",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2일 전
    selectedStore: { id: 3, name: "신세계백화점 본점", address: "서울특별시 중구 소공로 63", latitude: 37.5609, longitude: 126.9810 }
  }
]

const randomPosts = Array.from({ length: 50 }, (_, index) => createRandomPost(index + 4))

// 3. 임시 게시글 데이터셋 (Mock Database) - 초기 가이드라인 데이터 + 무작위 생성 데이터
const posts = ref([...seededPosts, ...randomPosts])

// 4. 상세 보기 및 수정을 위한 타겟 데이터 보관함
const selectedPost = ref<any>(null)
const editPostData = ref<any>(null)

// --- 화면 라우팅 및 CRUD 제어 로직 ---

// 상세 페이지로 이동
const goDetail = (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    selectedPost.value = post
    currentView.value = 'detail'
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
const goEdit = (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    // WriteView가 인식할 수 있는 구조로 바인딩
    editPostData.value = {
      ...post,
      selectedStore: post.selectedStore || null
    }
    currentView.value = 'write'
  }
}

// 글 등록 및 수정 완료 핸들러
const handleSubmitPost = (postData: any) => {
  if (postData.id) {
    // [수정 모드]
    const index = posts.value.findIndex(p => p.id === postData.id)
    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...postData,
        createdAt: new Date().toISOString() // 수정 시간 갱신
      }
    }
  } else {
    // [신규 생성 모드]
    const newId = posts.value.length > 0 ? Math.max(...posts.value.map(p => p.id)) + 1 : 1
    const newPost = {
      ...postData,
      id: newId,
      createdAt: new Date().toISOString()
    }
    posts.value.unshift(newPost) // 최신 글이 항상 위로 가도록 맨 앞에 추가
  }
  
  goHome()
}

// 게시글 삭제 핸들러
const handleDeletePost = (postId: number) => {
  posts.value = posts.value.filter(p => p.id !== postId)
  alert('게시글이 안전하게 삭제되었습니다.')
  goHome()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col">
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3 cursor-pointer" @click="goHome">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <AppIcon name="map-pin" size="1.1em" />
          </div>
          <div>
            <span class="font-black text-lg tracking-tight text-slate-900">LocalHub</span>
            <span class="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-md ml-2 border border-indigo-100">
              {{ selectedRegion }} 권역 [cite: 10, 63]
            </span>
          </div>
        </div>

        <div class="hidden sm:flex items-center space-x-4">
          <div class="text-xs text-slate-400 font-medium">
            <AppIcon name="clock" size="0.95em" class="mr-1 inline-block align-[-0.125em]" />실시간 공유 중
          </div>
          <button 
            @click="goWrite" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100"
          >
            <AppIcon name="pencil" size="0.95em" class="mr-1 inline-block align-[-0.125em]" />새 리뷰 작성
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <transition name="fade" mode="out-in">
        <HomeView 
          v-if="currentView === 'home'" 
          :posts="posts" 
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
          @edit="goEdit"
          @delete="handleDeletePost"
        />
      </transition>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4">
        <p class="font-bold text-slate-500 mb-1">© 2026 LocalHub. All rights reserved.</p>
        <p>본 서비스는 공공데이터를 기반으로 구축된 익명 지역 정보 커뮤니티 공간입니다. [cite: 3, 10]</p>
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