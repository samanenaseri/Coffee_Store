type Theme = "light" | "dark"

const STORAGE_KEY = "theme"

export const useTheme = () => {
    const colorMode = useState<Theme>(STORAGE_KEY, () => "light")

    const isDark = computed(() => colorMode.value === "dark")

    function applyTheme(mode: Theme) {
        if (import.meta.client) {
            document.documentElement.classList.toggle("dark", mode === "dark")
        }
    }

    const setTheme = (mode: Theme) => {
        colorMode.value = mode
        applyTheme(mode)
        try {
            localStorage.setItem(STORAGE_KEY, mode)
        } catch {
            // localStorage may not be available
        }
    }

    const toggle = () => {
        setTheme(isDark.value ? "light" : "dark")
    }

    if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === "dark" || stored === "light") {
            colorMode.value = stored
            applyTheme(stored)
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            colorMode.value = prefersDark ? "dark" : "light"
            applyTheme(prefersDark ? "dark" : "light")
        }
    }

    watch(isDark, (val) => {
        if (import.meta.client) {
            document.documentElement.classList.toggle("dark", val)
        }
    })

    return { isDark, setTheme, toggle }
}
