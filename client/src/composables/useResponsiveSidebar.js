import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Singleton state — module-level refs shared across all consumers
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const mobileOpen = ref(false)

// Desktop preference — true means collapsed
const desktopCollapsed = ref(
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('sidebar-collapsed') === 'true'
    : false
)

// Track how many instances are mounted so we only add one resize listener
let listenerCount = 0

function handleResize() {
  windowWidth.value = window.innerWidth
}

export function useResponsiveSidebar() {
  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

  // collapsed is true when:
  // - mobile: sidebar is always "collapsed" from grid perspective (fixed drawer handles it)
  // - tablet: always show as icon rail (collapsed)
  // - desktop: respect desktopCollapsed preference
  const collapsed = computed(() => {
    if (isMobile.value) return true
    if (isTablet.value) return true
    return desktopCollapsed.value
  })

  function toggle() {
    if (isMobile.value) {
      mobileOpen.value = !mobileOpen.value
    } else {
      // Tablet or desktop: toggle collapsed preference and persist for desktop
      const next = !collapsed.value
      desktopCollapsed.value = next
      // Only persist to localStorage on desktop (≥1024px)
      if (!isTablet.value) {
        localStorage.setItem('sidebar-collapsed', String(next))
      }
    }
  }

  // Restore desktop preference when resizing back from tablet to desktop
  watch(isTablet, (nowTablet, wasTablet) => {
    if (wasTablet && !nowTablet) {
      // Crossed back to desktop — restore from localStorage
      desktopCollapsed.value = localStorage.getItem('sidebar-collapsed') === 'true'
    }
  })

  // Close mobile drawer on route change
  try {
    const route = useRoute()
    watch(() => route.path, () => {
      if (mobileOpen.value) {
        mobileOpen.value = false
      }
    })
  } catch {
    // useRoute may not be available outside a component — safe to skip
  }

  onMounted(() => {
    if (listenerCount === 0) {
      window.addEventListener('resize', handleResize, { passive: true })
    }
    listenerCount++
    // Sync windowWidth on mount (in case SSR or initial render was wrong)
    windowWidth.value = window.innerWidth
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount === 0) {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    collapsed,
    mobileOpen,
    isMobile,
    isTablet,
    toggle
  }
}
