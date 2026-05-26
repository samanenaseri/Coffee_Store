export const useAuth = () => {
    const user = useState<Record<string, unknown> | null>("auth-user", () => null)
    const token = useState<string | null>("auth-token", () => null)

    const login = async (username: string, password: string) => {
        const data = await $fetch<{ token: string }>("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { username, password },
        })
        user.value = data as unknown as Record<string, unknown>
        token.value = data.token
        return data
    }

    const logout = async () => {
        user.value = null
        token.value = null
    }

    return { user, token, login, logout }
}