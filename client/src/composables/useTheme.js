import { ref, watch } from 'vue'

const getInitialTheme = () => {
  const saved = localStorage.getItem('app-theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(getInitialTheme())

const applyTheme = (value) => {
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.style.colorScheme = value
  localStorage.setItem('app-theme', value)
}

// Apply immediately on module load
applyTheme(theme.value)

watch(theme, (value) => {
  applyTheme(value)
})

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const setTheme = (value) => {
  if (value === 'light' || value === 'dark') {
    theme.value = value
  }
}

export function useTheme() {
  return { theme, toggleTheme, setTheme }
}
