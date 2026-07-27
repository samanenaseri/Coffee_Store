/**
 * Post-login return path: query param + sessionStorage backup
 * so the user returns to the same page after login/register.
 */

const AUTH_PAGES = ['/login', '/register']
const STORAGE_KEY = 'auth_return_to'
const DEFAULT_FALLBACK = '/profile'

/**
 * Only allow internal relative paths (blocks open redirects).
 * Strips hash for storage; hash stored separately if needed.
 */
export function sanitizeRedirectPath(
  path: string | null | undefined,
  fallback = DEFAULT_FALLBACK,
): string {
  if (!path || typeof path !== 'string') {
    return fallback
  }

  let trimmed = path.trim()

  // Decode once if still encoded
  try {
    if (trimmed.includes('%')) {
      trimmed = decodeURIComponent(trimmed)
    }
  } catch {
    // keep as-is
  }

  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback
  }

  // Never bounce back to auth screens
  const pathOnly = trimmed.split('?')[0].split('#')[0]
  if (AUTH_PAGES.some(p => pathOnly === p || pathOnly.startsWith(`${p}/`))) {
    return fallback
  }

  return trimmed
}

function readStoredReturn(): string | null {
  if (!import.meta.client) return null
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredReturn(path: string) {
  if (!import.meta.client) return
  try {
    const safe = sanitizeRedirectPath(path, '')
    if (safe) {
      sessionStorage.setItem(STORAGE_KEY, safe)
    }
  } catch {
    // ignore
  }
}

function clearStoredReturn() {
  if (!import.meta.client) return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/**
 * Remember where the user was before auth, and build /login?redirect=...
 */
export function rememberReturnPath(path: string) {
  const safe = sanitizeRedirectPath(path, '')
  if (safe) {
    writeStoredReturn(safe)
  }
  return safe
}

/**
 * Resolve where to go after successful login/register.
 * Priority: query.redirect → sessionStorage → fallback
 */
export function resolvePostAuthRedirect(
  queryRedirect?: string | null,
  fallback = DEFAULT_FALLBACK,
): string {
  const fromQuery = sanitizeRedirectPath(queryRedirect, '')
  if (fromQuery) {
    clearStoredReturn()
    return fromQuery
  }

  const fromStore = sanitizeRedirectPath(readStoredReturn(), '')
  if (fromStore) {
    clearStoredReturn()
    return fromStore
  }

  return fallback
}

export function useAuthRedirect() {
  const route = useRoute()

  /** Current page to return to after login/register */
  const currentReturnPath = computed(() => {
    return sanitizeRedirectPath(route.fullPath, DEFAULT_FALLBACK)
  })

  /** Path from ?redirect= query (login/register pages) */
  const redirectFromQuery = computed(() => {
    const q = route.query.redirect
    const raw = Array.isArray(q) ? q[0] : q
    return resolvePostAuthRedirect(
      typeof raw === 'string' ? raw : null,
      DEFAULT_FALLBACK,
    )
  })

  /** Login URL that returns to current page */
  const loginUrl = computed(() => {
    const path = currentReturnPath.value
    rememberReturnPath(path)
    return `/login?redirect=${encodeURIComponent(path)}`
  })

  /** Register URL that returns to current page */
  const registerUrl = computed(() => {
    const path = currentReturnPath.value
    rememberReturnPath(path)
    return `/register?redirect=${encodeURIComponent(path)}`
  })

  function loginUrlFor(path: string) {
    const safe = sanitizeRedirectPath(path, currentReturnPath.value)
    rememberReturnPath(safe)
    // Avoid raw # in query: store full path (with hash) only in sessionStorage;
    // put path without hash in query for readability
    const pathNoHash = safe.split('#')[0]
    const hash = safe.includes('#') ? safe.slice(safe.indexOf('#')) : ''
    if (hash) {
      rememberReturnPath(safe) // keep full path with hash in storage
    }
    return `/login?redirect=${encodeURIComponent(pathNoHash)}`
  }

  function registerUrlFor(path: string) {
    const safe = sanitizeRedirectPath(path, currentReturnPath.value)
    rememberReturnPath(safe)
    const pathNoHash = safe.split('#')[0]
    return `/register?redirect=${encodeURIComponent(pathNoHash)}`
  }

  /**
   * Call after successful auth. Navigates to saved page.
   */
  async function goAfterAuth() {
    const q = route.query.redirect
    const raw = Array.isArray(q) ? q[0] : q
    // Prefer storage first if it has a more complete path (e.g. with hash)
    const stored = sanitizeRedirectPath(readStoredReturn(), '')
    const fromQuery = sanitizeRedirectPath(
      typeof raw === 'string' ? raw : null,
      '',
    )

    let target = DEFAULT_FALLBACK
    if (stored && fromQuery) {
      // If stored is same path + hash, prefer stored
      if (stored.startsWith(fromQuery.split('#')[0])) {
        target = stored
      } else {
        target = fromQuery
      }
    } else {
      target = stored || fromQuery || DEFAULT_FALLBACK
    }

    clearStoredReturn()
    return navigateTo(target)
  }

  return {
    currentReturnPath,
    redirectFromQuery,
    loginUrl,
    registerUrl,
    loginUrlFor,
    registerUrlFor,
    sanitizeRedirectPath,
    rememberReturnPath,
    resolvePostAuthRedirect,
    goAfterAuth,
  }
}
