<template>
  <button
    class="icon-btn"
    @click="toggleTheme"
    :aria-label="t('theme.toggle')"
    type="button"
  >
    <!-- Sun icon: shown when in dark mode (click to go light) -->
    <svg
      v-if="theme === 'dark'"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
    <!-- Moon icon: shown when in light mode (click to go dark) -->
    <svg
      v-else
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const { theme, toggleTheme } = useTheme()
const { t } = useI18n()
</script>
