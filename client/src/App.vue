<template>
  <div class="app" :class="{ 'is-collapsed': collapsed, 'is-mobile': isMobile, 'mobile-open': mobileOpen }">
    <Sidebar
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      :is-mobile="isMobile"
      @close="toggle()"
    />

    <div v-if="isMobile && mobileOpen" class="sidebar-backdrop" @click="toggle()"></div>

    <header class="top-bar">
      <button
        class="icon-btn"
        @click="toggle()"
        :aria-label="collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        :aria-expanded="!collapsed"
        type="button"
      >
        <!-- Chevron left/right toggler -->
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
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="top-bar-spacer"></div>
      <ThemeToggle />
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="showProfileDetails = true"
        @show-tasks="showTasks = true"
      />
    </header>

    <main class="main-content">
      <FilterBar />
      <div class="page-body">
        <router-view />
      </div>
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'
import { useResponsiveSidebar } from './composables/useResponsiveSidebar'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import Sidebar from './components/Sidebar.vue'
import ThemeToggle from './components/ThemeToggle.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher,
    Sidebar,
    ThemeToggle
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()

    // Initialize theme (singleton — applies on module load, but call here to ensure it runs)
    useTheme()

    // Responsive sidebar — replaces the simple sidebarCollapsed ref
    const { collapsed, mobileOpen, isMobile, isTablet, toggle } = useResponsiveSidebar()

    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      collapsed,
      mobileOpen,
      isMobile,
      isTablet,
      toggle,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
/* ─── Design tokens ─────────────────────────────────────────── */
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-2: #fafafa;
  --surface-3: #f4f4f5;
  --text: #0a0a0a;
  --text-muted: #666666;
  --text-subtle: #8f8f8f;
  --border: #ebebeb;
  --border-strong: #d4d4d4;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-soft: #eff4ff;
  --on-accent: #ffffff;
  --success: #15803d;
  --success-bg: #f0fdf4;
  --success-border: #bbf7d0;
  --warning: #b45309;
  --warning-bg: #fffbeb;
  --warning-border: #fde68a;
  --danger: #b91c1c;
  --danger-bg: #fef2f2;
  --danger-border: #fecaca;
  --info: #2563eb;
  --info-bg: #eff6ff;
  --info-border: #bfdbfe;
  --shadow-xs: 0 1px 2px rgba(0,0,0,.04);
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06);
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-full: 9999px;
  --sidebar-width: 248px;
  --sidebar-width-collapsed: 60px;
  --topbar-height: 56px;
  --z-sidebar: 200;
  --z-topbar: 150;
  --z-filterbar: 90;
  --z-dropdown: 1000;
  --transition-fast: .15s ease;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
}

[data-theme="dark"] {
  --bg: #000000;
  --surface: #0a0a0a;
  --surface-2: #111111;
  --surface-3: #1a1a1a;
  --text: #fafafa;
  --text-muted: #a1a1a1;
  --text-subtle: #6f6f6f;
  --border: #1f1f1f;
  --border-strong: #2e2e2e;
  --accent: #3b82f6;
  --accent-hover: #60a5fa;
  --accent-soft: #0e1b33;
  --on-accent: #ffffff;
  --success: #4ade80;
  --success-bg: #0c1f14;
  --success-border: #14532d;
  --warning: #fbbf24;
  --warning-bg: #241a06;
  --warning-border: #854d0e;
  --danger: #f87171;
  --danger-bg: #2a0e0e;
  --danger-border: #7f1d1d;
  --info: #60a5fa;
  --info-bg: #0e1b33;
  --info-border: #1e3a8a;
  --shadow-xs: 0 1px 2px rgba(0,0,0,.5);
  --shadow-sm: 0 1px 3px rgba(0,0,0,.6);
}

/* ─── Reset ─────────────────────────────────────────────────── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ─── Base ──────────────────────────────────────────────────── */
html {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

body {
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

/* ─── App shell grid ────────────────────────────────────────── */
.app {
  --rail: var(--sidebar-width);
  display: grid;
  grid-template-columns: var(--rail) 1fr;
  grid-template-rows: var(--topbar-height) 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  min-height: 100vh;
  transition: grid-template-columns var(--transition-fast);
}

.app.is-collapsed {
  --rail: var(--sidebar-width-collapsed);
}

/* Sidebar grid area — the component itself handles inner layout */
.app > aside {
  grid-area: sidebar;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: var(--z-sidebar);
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow: hidden;
  transition: width var(--transition-fast);
}

/* Top bar */
.top-bar {
  grid-area: topbar;
  position: sticky;
  top: 0;
  z-index: var(--z-topbar);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.top-bar-spacer {
  margin-left: auto;
}

/* Main content column */
.main-content {
  grid-area: content;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.page-body {
  padding: var(--space-6) var(--space-8);
  flex: 1;
}

/* ─── Icon button (top bar actions) ─────────────────────────── */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}

.icon-btn:hover {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--border-strong);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ─── Page header ───────────────────────────────────────────── */
.page-header {
  margin-bottom: var(--space-6);
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-1);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

/* ─── Stats grid ────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

/* ─── Stat card ─────────────────────────────────────────────── */
.stat-card {
  background: var(--surface);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  transition: border-color var(--transition-fast);
}

.stat-card:hover {
  border-color: var(--border-strong);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  margin-bottom: var(--space-2);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.stat-card.warning .stat-value {
  color: var(--warning);
}

.stat-card.success .stat-value {
  color: var(--success);
}

.stat-card.danger .stat-value {
  color: var(--danger);
}

.stat-card.info .stat-value {
  color: var(--info);
}

/* ─── Card ──────────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: 1px solid var(--border);
  margin-bottom: var(--space-5);
  transition: border-color var(--transition-fast);
}

.card:hover {
  border-color: var(--border-strong);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

/* ─── Table ─────────────────────────────────────────────────── */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

thead {
  background: var(--surface-2);
}

th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-subtle);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

td {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--border);
  color: var(--text);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color var(--transition-fast);
}

tbody tr:hover {
  background: var(--surface-2);
}

/* ─── Badge ─────────────────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid transparent;
}

.badge.success,
.badge.increasing {
  background: var(--success-bg);
  color: var(--success);
  border-color: var(--success-border);
}

.badge.warning,
.badge.medium {
  background: var(--warning-bg);
  color: var(--warning);
  border-color: var(--warning-border);
}

.badge.danger,
.badge.decreasing,
.badge.high {
  background: var(--danger-bg);
  color: var(--danger);
  border-color: var(--danger-border);
}

.badge.info,
.badge.low {
  background: var(--info-bg);
  color: var(--info);
  border-color: var(--info-border);
}

.badge.stable {
  background: var(--surface-3);
  color: var(--text-muted);
  border-color: var(--border-strong);
}

/* ─── Loading / Error states ────────────────────────────────── */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.error {
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  color: var(--danger);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin: var(--space-4) 0;
  font-size: 0.9375rem;
}

/* ─── Responsive sidebar ────────────────────────────────────── */

/* Backdrop for mobile drawer */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: calc(var(--z-sidebar) - 1);
}

[data-theme="dark"] .sidebar-backdrop {
  background: rgba(0, 0, 0, 0.65);
}

/* Mobile: sidebar is a fixed off-canvas drawer */
@media (max-width: 767px) {
  .app {
    grid-template-columns: 0 1fr; /* sidebar takes no space in grid */
  }

  .app > aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-width) !important;
    transform: translateX(-100%);
    transition: transform var(--transition-fast);
    z-index: var(--z-sidebar);
  }

  .app.mobile-open > aside {
    transform: translateX(0);
  }
}

/* Tablet: auto icon-only rail */
@media (min-width: 768px) and (max-width: 1023px) {
  .app {
    --rail: var(--sidebar-width-collapsed);
    grid-template-columns: var(--rail) 1fr;
  }
}
</style>
