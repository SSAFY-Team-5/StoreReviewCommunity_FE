const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

type StoreApiItem = {
  contentid: string
  title: string
  addr1: string
  mapx?: string
  mapy?: string
  firstimage?: string
}

export type StoreOption = {
  id: string
  name: string
  address: string
  latitude: number | null
  longitude: number | null
  raw: StoreApiItem
}

export type PostListItem = {
  id: number
  title: string
  nickname: string
  created_at: string
  store_name: string
}

export type PostSummary = {
  id: number
  title: string
  nickname: string
  createdAt: string
  storeName: string | null
}

export type StoreSummary = {
  contentid: string
  title: string
  addr1: string
  mapx?: string
  mapy?: string
  firstimage?: string
}

export type PostDetailApi = {
  id: number
  nickname: string
  title: string
  content: string
  created_at: string
  store: StoreSummary | null
}

export type PostDetail = {
  id: number
  nickname: string
  title: string
  content: string
  createdAt: string
  store: StoreOption | null
  storeName: string | null
}

export type PostPayload = {
  nickname: string
  password: string
  title: string
  content: string
  store_content_id: string
  store_name: string
  store_address: string | null
}

export type PostUpdatePayload = {
  password: string
  title: string
  content: string
}

export type ChatResponse = {
  answer: string
  stores: StoreApiItem[]
}

export type TodayTopStore = {
  title: string
  review_count: number
}

export type TodayTopStatistics = {
  date: string
  top_stores: TodayTopStore[]
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body !== undefined && init?.body !== null
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: hasBody
      ? {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {})
        }
      : (init?.headers ?? {}),
    ...init
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

function toNumberOrNull(value?: string) {
  if (!value) return null
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function mapStoreApiItem(item: StoreApiItem): StoreOption {
  return {
    id: item.contentid,
    name: item.title,
    address: item.addr1,
    latitude: toNumberOrNull(item.mapy),
    longitude: toNumberOrNull(item.mapx),
    raw: item
  }
}

export function mapPostSummary(item: PostListItem): PostSummary {
  return {
    id: item.id,
    title: item.title,
    nickname: item.nickname,
    createdAt: item.created_at,
    storeName: item.store_name || null
  }
}

export function mapPostDetail(item: PostDetailApi): PostDetail {
  return {
    id: item.id,
    nickname: item.nickname,
    title: item.title,
    content: item.content,
    createdAt: item.created_at,
    store: item.store ? mapStoreApiItem(item.store) : null,
    storeName: item.store?.title ?? null
  }
}

export async function fetchPosts(page = 1, size = 100, keyword = '') {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size)
  })

  if (keyword.trim()) {
    params.set('keyword', keyword.trim())
  }

  return requestJson<{ page: number; size: number; total: number; items: PostListItem[] }>(`/api/posts?${params.toString()}`)
}

export async function fetchPostDetail(postId: number) {
  return requestJson<PostDetailApi>(`/api/posts/${postId}`)
}

export async function createPost(payload: PostPayload) {
  return requestJson(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function updatePost(postId: number, payload: PostUpdatePayload) {
  return requestJson(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export async function verifyPostPassword(postId: number, password: string) {
  return requestJson(`/api/posts/${postId}/verify-password`, {
    method: 'POST',
    body: JSON.stringify({ password })
  })
}

export async function deletePost(postId: number, payload: { password: string }) {
  return requestJson(`/api/posts/${postId}`, {
    method: 'DELETE',
    body: JSON.stringify(payload)
  })
}

export async function fetchStores() {
  return requestJson<StoreApiItem[]>(`/api/stores`)
}

export async function searchStores(keyword: string) {
  const params = new URLSearchParams({ keyword })
  return requestJson<StoreApiItem[]>(`/api/stores/search?${params.toString()}`)
}

export async function fetchChat(message: string) {
  return requestJson<ChatResponse>(`/api/chat`, {
    method: 'POST',
    body: JSON.stringify({ message })
  })
}

export async function fetchTodayTopStores() {
  return requestJson<TodayTopStatistics>(`/api/statistics/today-top`)
}

export async function fetchStatistics() {
  return requestJson<StoreApiItem[]>(`/api/stores`)
}
