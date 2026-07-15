<template>
  <div class="space-y-3">
    <!-- 검색창 입력 영역 -->
    <div class="relative" v-if="!disabled">
      <input 
        v-model="storeQuery" 
        @input="handleInput"
        type="text" 
        placeholder="매장 이름 검색 (예: 현대, 롯데, 신세계, 스타필드 등)" 
        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
      >
      <!-- 검색 자동완성 드롭다운 -->
      <div v-if="filteredStores.length > 0 && showSuggestions" class="absolute z-[1001] w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
        <div 
          v-for="store in filteredStores" 
          :key="store.id"
          @click="selectStore(store)"
          class="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <div class="text-sm font-bold text-slate-900">{{ store.name }}</div>
            <div class="text-xs text-slate-500 mt-0.5">
              <AppIcon name="location" class="text-slate-400 mr-1" />{{ store.address }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 선택된 상점 피드백 정보 카드 -->
    <div v-if="modelValue" class="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex items-start justify-between">
      <div class="space-y-1">
        <div class="text-xs text-indigo-600 font-bold uppercase tracking-wider">연동된 쇼핑 매장 정보</div>
        <h4 class="text-sm font-extrabold text-slate-900">{{ modelValue.name }}</h4>
        <p class="text-xs text-slate-600">{{ modelValue.address }}</p>
      </div>
      <button 
        v-if="!disabled" 
        type="button" 
        @click="clearStore" 
        class="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white border border-rose-100 rounded-lg px-2.5 py-1 transition-all"
      >
        선택 해제
      </button>
    </div>

    <!-- Leaflet 지도 영역 -->
    <div class="relative h-60 w-full rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100">
      <div :id="mapId" class="h-full w-full z-0"></div>
      <!-- 미선택 시 레이어 가이드 -->
      <div v-if="!modelValue && !disabled" class="absolute inset-0 bg-slate-900/40 z-10 flex flex-col items-center justify-center text-white p-4 text-center">
        <AppIcon name="map" size="1.35em" class="text-2xl mb-2" />
        <h5 class="font-bold text-sm">리뷰할 쇼핑 오프라인 매장이 있다면 검색하여 지도를 연동해 보세요</h5>
        <p class="text-[11px] text-slate-200 mt-1">온라인 구매나 일반 글의 경우 지도 등록 없이 진행 가능합니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import AppIcon from './AppIcon.vue';
import { fetchStores, mapStoreApiItem } from '../services/api';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  mapId: {
    type: String,
    default: 'leaflet-store-map'
  }
});

const emit = defineEmits(['update:modelValue']);

const storesData = ref([]);

const storeQuery = ref('');
const showSuggestions = ref(false);
let mapInstance = null;
let markerInstance = null;

const normalizedStore = computed(() => {
  const value = props.modelValue;
  if (!value) return null;

  return {
    id: value.id || value.contentid || null,
    name: value.name || value.title || '',
    address: value.address || value.addr1 || '',
    latitude: value.latitude ?? value.mapy ?? null,
    longitude: value.longitude ?? value.mapx ?? null
  };
});

const filteredStores = computed(() => {
  if (!storeQuery.value.trim()) return [];
  const keyword = storeQuery.value.toLowerCase();

  return storesData.value.filter((store) => {
    const storeName = (store.name || '').toLowerCase();
    const storeAddress = (store.address || '').toLowerCase();
    return storeName.includes(keyword) || storeAddress.includes(keyword);
  });
});

const handleInput = () => {
  showSuggestions.value = true;
};

const selectStore = (store) => {
  const selectedStore = {
    ...store,
    id: store.id ?? store.contentid ?? null,
    name: store.name ?? store.title ?? '',
    address: store.address ?? store.addr1 ?? '',
    latitude: store.latitude ?? null,
    longitude: store.longitude ?? null
  };

  emit('update:modelValue', selectedStore);
  showSuggestions.value = false;
  storeQuery.value = selectedStore.name;

  if (selectedStore.latitude != null && selectedStore.longitude != null) {
    updateMap(selectedStore.latitude, selectedStore.longitude, selectedStore.name);
  }
};

const clearStore = () => {
  emit('update:modelValue', null);
  storeQuery.value = '';
  showSuggestions.value = false;

  if (markerInstance && mapInstance) {
    mapInstance.removeLayer(markerInstance);
    markerInstance = null;
  }
};

// 지도 초기화 및 마커 동적 갱신 핵심 로직
const initMap = () => {
  nextTick(() => {
    const container = document.getElementById(props.mapId);
    if (!container) return;

    const defaultLat = normalizedStore.value?.latitude ?? 37.56;
    const defaultLng = normalizedStore.value?.longitude ?? 126.97;
    const initialZoom = 15;

    if (!mapInstance) {
      mapInstance = L.map(props.mapId).setView([defaultLat, defaultLng], initialZoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);
    } else {
      mapInstance.setView([defaultLat, defaultLng], initialZoom);
    }

    mapInstance.invalidateSize();

    if (normalizedStore.value?.latitude != null && normalizedStore.value?.longitude != null) {
      updateMap(normalizedStore.value.latitude, normalizedStore.value.longitude, normalizedStore.value.name);
    }
  });
};

const updateMap = (lat, lng, name) => {
  if (!mapInstance || lat == null || lng == null) return;

  if (markerInstance) {
    mapInstance.removeLayer(markerInstance);
  }

  markerInstance = L.circleMarker([lat, lng], {
    radius: 8,
    color: '#dc2626',
    fillColor: '#ef4444',
    fillOpacity: 1,
    weight: 2
  })
    .addTo(mapInstance)
    .bindPopup(`<b style="font-size:12px;">${name}</b>`)
    .openPopup();

  mapInstance.setView([lat, lng], 15);
  setTimeout(() => {
    mapInstance.invalidateSize();
    mapInstance?.setView([lat, lng], 15);
  }, 180);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    storeQuery.value = normalizedStore.value?.name || '';
    nextTick(() => {
      if (!mapInstance) {
        initMap();
      } else {
        updateMap(normalizedStore.value?.latitude, normalizedStore.value?.longitude, normalizedStore.value?.name);
      }
    });
  } else {
    storeQuery.value = '';
    if (markerInstance && mapInstance) {
      mapInstance.removeLayer(markerInstance);
      markerInstance = null;
    }
  }
}, { deep: true });

onMounted(() => {
  void (async () => {
    try {
      const response = await fetchStores();
      storesData.value = response.map(mapStoreApiItem);
    } catch (error) {
      storesData.value = [];
    }
  })();

  initMap();
  if (normalizedStore.value) {
    storeQuery.value = normalizedStore.value.name;
  }
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<style scoped>
/* 격리된 맵 스타일 정의 */
.leaflet-container {
  z-index: 1;
}
</style>