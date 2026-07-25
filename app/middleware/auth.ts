export default defineNuxtRouteMiddleware(async (to) => {
    const { token, user, fetchUser } = useAuth()
    const { sanitizeRedirectPath, rememberReturnPath } = useAuthRedirect()

    const returnPath = sanitizeRedirectPath(to.fullPath, to.path)
    rememberReturnPath(returnPath)

    if (!token.value) {
        return navigateTo(`/login?redirect=${encodeURIComponent(returnPath.split('#')[0])}`, { replace: true })
    }

    if (!user.value) {
        try {
            await fetchUser()
        } catch (e: any) {
            if (e?.status === 401 || e?.statusCode === 401) {
                return navigateTo(`/login?redirect=${encodeURIComponent(returnPath.split('#')[0])}`, { replace: true })
            }
        }
    }
})


