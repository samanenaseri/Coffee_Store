export default defineNuxtRoutMiddleware((to, from)=>{
    const {user} = useAuth();
    if(!user.value){
        return navigateTo("/login");
    }
})