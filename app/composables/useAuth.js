export const useAuth = () => {
    const user = useState("auth-user",()=> null)
    const token = useState("auth-token",()=> null)

    const login=async (username, password)=>{
        const data = await $fetch("/api/login",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body : {username, password}
        })
        user.value=data
        token.value=data.token
        return data
    }

    const logout = async () => {
        user.value= null
        token.value=null
    }
    return {user, token, login, logout}
}