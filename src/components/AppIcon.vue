<script setup lang="ts">
type IconName =
  | 'map-pin'
  | 'clock'
  | 'pencil'
  | 'chat'
  | 'robot'
  | 'close'
  | 'help'
  | 'send'
  | 'key'
  | 'alert'
  | 'location'
  | 'map'
  | 'chevron-left'
  | 'chevron-right'
  | 'edit-square'
  | 'trash'
  | 'store'
  | 'globe'
  | 'search'
  | 'folder'
  | 'arrow-left'

const props = defineProps<{
  name: IconName
  size?: string
}>()
</script>

<template>
  <svg
    :width="props.size ?? '1em'"
    :height="props.size ?? '1em'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <g v-if="props.name === 'map-pin' || props.name === 'location' || props.name === 'map'">
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.25" />
    </g>

    <g v-else-if="props.name === 'clock'">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </g>

    <g v-else-if="props.name === 'pencil'">
      <path d="M4 20h4l10-10a2.2 2.2 0 0 0-3.1-3.1L4.9 16.9 4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </g>

    <g v-else-if="props.name === 'chat'">
      <path d="M4 5h16v10H9l-5 4V5Z" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
    </g>

    <g v-else-if="props.name === 'robot'">
      <rect x="7" y="8" width="10" height="9" rx="2" />
      <path d="M12 5v3" />
      <circle cx="10" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 15h4" />
      <circle cx="12" cy="5" r="0.8" fill="currentColor" stroke="none" />
    </g>

    <g v-else-if="props.name === 'close'">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </g>

    <g v-else-if="props.name === 'help'">
      <circle cx="12" cy="12" r="8" />
      <path d="M9.75 9.5A2.5 2.5 0 0 1 12 8a2.25 2.25 0 0 1 1.3 4.08c-.92.62-1.3 1.08-1.3 2.17" />
      <path d="M12 17h.01" />
    </g>

    <g v-else-if="props.name === 'send'">
      <path d="M4 12 20 4l-4 16-4-7-8-1Z" />
      <path d="M12 13l8-9" />
    </g>

    <g v-else-if="props.name === 'key'">
      <circle cx="8.5" cy="11.5" r="3.5" />
      <path d="M11.5 11.5H20v3h-2v2h-2v-2h-2.5" />
    </g>

    <g v-else-if="props.name === 'alert'">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </g>

    <g v-else-if="props.name === 'chevron-left' || props.name === 'arrow-left'">
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </g>

    <g v-else-if="props.name === 'chevron-right'">
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </g>

    <g v-else-if="props.name === 'edit-square'">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 15.5h1.5l6-6a1.1 1.1 0 0 0-1.5-1.5l-6 6V15.5Z" />
    </g>

    <g v-else-if="props.name === 'trash'">
      <path d="M5 7h14" />
      <path d="M10 4h4" />
      <path d="M8 7l1 13h6l1-13" />
    </g>

    <g v-else-if="props.name === 'store'">
      <path d="M4 9h16" />
      <path d="M6 9v9h12V9" />
      <path d="M5 9 7 4h10l2 5" />
      <path d="M9 18v-4h6v4" />
    </g>

    <g v-else-if="props.name === 'globe'">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4a12 12 0 0 1 0 16" />
      <path d="M12 4a12 12 0 0 0 0 16" />
    </g>

    <g v-else-if="props.name === 'search'">
      <circle cx="11" cy="11" r="5.5" />
      <path d="M15.5 15.5 20 20" />
    </g>

    <g v-else-if="props.name === 'folder'">
      <path d="M4 7h6l2 2h8v8H4V7Z" />
    </g>
  </svg>
</template>