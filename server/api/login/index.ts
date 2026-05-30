export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body || {}

    if (username === "admin" && password === "admin") {
        return {
            token: "mock-token-12345",
            user: {
                id: 1,
                username: "admin",
                name: "مدیر فروشگاه",
            },
        }
    }

    throw createError({
        statusCode: 401,
        statusMessage: "نام کاربری یا رمز عبور اشتباه است",
    })
})
