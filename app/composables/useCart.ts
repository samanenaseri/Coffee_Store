export interface CartItem {
    id: number
    title: string
    slug: string
    price: number
    image: string
    quantity: number
}

export const useCart = () => {
    const items = useState<CartItem[]>("cart-items", () => [])

    const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
    const totalPrice = computed(() => items.value.reduce((acc, item) => acc + item.price * item.quantity, 0))

    const addItem = (product: { id: number; title: string; slug: string; price: number; image: string }) => {
        const existing = items.value.find((item) => item.id === product.id)
        if (existing) {
            existing.quantity++
        } else {
            items.value.push({ ...product, quantity: 1 })
        }
    }

    const removeItem = (productId: number) => {
        items.value = items.value.filter((item) => item.id !== productId)
    }

    const updateQuantity = (productId: number, quantity: number) => {
        const item = items.value.find((item) => item.id === productId)
        if (item) {
            item.quantity = Math.max(1, quantity)
        }
    }

    const clearCart = () => {
        items.value = []
    }

    return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }
}
