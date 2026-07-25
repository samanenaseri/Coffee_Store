export default defineNuxtPlugin(() => {
    const { token, user, fetchUser } = useAuth()

    if (token.value && !user.value) {
        fetchUser()
    }
})
