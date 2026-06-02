<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- Wordmark -->
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <span class="sidebar-wordmark">{{ t('nav.companyName') }}</span>
        <span v-if="!collapsed" class="sidebar-subtitle">{{ t('nav.subtitle') }}</span>
      </div>
      <button
        v-if="isMobile"
        class="sidebar-close-btn icon-btn"
        @click="$emit('close')"
        :aria-label="t('nav.collapseSidebar')"
        type="button"
      >
        <svg
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
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Primary navigation -->
    <nav class="sidebar-nav" aria-label="Primary">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        :aria-label="collapsed ? item.label : undefined"
        :title="collapsed ? item.label : undefined"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        exact-active-class=""
        active-class=""
        :class="{ 'sidebar-link--active': isActive(item.to) }"
      >
        <span class="sidebar-icon" aria-hidden="true" v-html="item.icon"></span>
        <span class="sidebar-label" :class="{ 'visually-hidden': collapsed }">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  mobileOpen: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const route = useRoute()
const { t } = useI18n()

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const navItems = computed(() => [
  {
    to: '/',
    label: t('nav.overview'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>`
  },
  {
    to: '/inventory',
    label: t('nav.inventory'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`
  },
  {
    to: '/orders',
    label: t('nav.orders'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>`
  },
  {
    to: '/spending',
    label: t('nav.finance'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>`
  },
  {
    to: '/demand',
    label: t('nav.demandForecast'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>`
  },
  {
    to: '/reports',
    label: t('nav.reports'),
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>`
  }
])
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: flex-start;
  padding: var(--space-4) var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--border);
  min-height: var(--topbar-height);
}

.sidebar--collapsed .sidebar-header {
  justify-content: center;
  align-items: center;
  padding: 0 var(--space-3);
}

.sidebar-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow: hidden;
  align-self: center;
}

.sidebar-wordmark {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: -0.02em;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.sidebar--collapsed .sidebar-wordmark {
  font-size: 0.6875rem;
  letter-spacing: 0;
}

.sidebar-subtitle {
  font-size: 0.6875rem;
  color: var(--text-subtle);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-3) var(--space-2);
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background var(--transition-fast), color var(--transition-fast);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-link:hover {
  background: var(--surface-2);
  color: var(--text);
}

.sidebar-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.sidebar-link--active {
  background: var(--surface-3);
  color: var(--text);
  font-weight: 600;
  box-shadow: inset 2px 0 0 var(--accent);
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: inherit;
}

.sidebar-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Collapsed state */
.sidebar--collapsed .sidebar-nav {
  padding: var(--space-3) var(--space-2);
  align-items: center;
}

.sidebar--collapsed .sidebar-link {
  justify-content: center;
  padding: var(--space-2);
  gap: 0;
  width: 40px;
  align-self: center;
}

/* Visually hidden but accessible */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile close button — sits at the end of the header row */
.sidebar-close-btn {
  margin-left: auto;
  flex-shrink: 0;
}
</style>
