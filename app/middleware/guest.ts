/**
 * For auth pages (login/register): if user is fully logged in, send them away.
 * Do NOT treat bare token as logged-in (stale JWT would lock user out of login).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, isLoggedIn, fetchUser } = useAuth()
  const { resolvePostAuthRedirect, sanitizeRedirectPath } = useAuthRedirect()

  // Token without user: try restore; if invalid, stay on login
  if (token.value && !user.value) {
    await fetchUser()
  }

  if (!isLoggedIn.value) {
    return
  }

  const q = to.query.redirect
  const raw = Array.isArray(q) ? q[0] : q
  const target = resolvePostAuthRedirect(
    typeof raw === 'string' ? raw : null,
    '/profile',
  )

  return navigateTo(sanitizeRedirectPath(target, '/profile'))
})
